// search-resources-background.js
// Background function - can run up to 15 minutes
// The "-background" suffix tells Netlify this is a background function

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisSet(key, value, exSeconds = 600) {
  const response = await fetch(`${UPSTASH_URL}/set/${key}?EX=${exSeconds}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    body: JSON.stringify(value)
  });
  return response.json();
}

export const handler = async (event, context) => {
  console.log('Background function triggered');
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { jobId, stage, stageName, stageHelps, location, preference } = JSON.parse(event.body);
  console.log('Job ID:', jobId, 'Location:', location);

  try {
    // Update status to "searching" immediately
    console.log('Writing pending status to Redis...');
    await redisSet(jobId, {
      status: 'searching',
      createdAt: Date.now()
    });
    console.log('Redis write complete, starting search...');

    // Build preference text
    let preferenceText = "";
    if (preference === "local") {
      preferenceText = "Focus on IN-PERSON services only - clinics, therapists with physical offices, local support groups that meet face-to-face.";
    } else if (preference === "remote") {
      preferenceText = "Focus on REMOTE/TELEHEALTH services only - online therapy, virtual support groups, telehealth providers who serve this region.";
    } else {
      preferenceText = "Include BOTH in-person local services AND remote/telehealth options that serve this area.";
    }

    // Build the comprehensive search prompt
    const systemPrompt = `You are a compassionate eating disorder support navigator. Your job is to search for and compile REAL, SPECIFIC resources for someone seeking eating disorder support.

CRITICAL INSTRUCTIONS:
1. Search for ACTUAL providers, clinics, and services in or serving the specified location
2. Look BEYOND major hospitals and university clinics - find private practice therapists, specialized ED clinics, independent dietitians, and community resources
3. Include a MIX of:
   - Private practice therapists specializing in eating disorders
   - Specialized eating disorder treatment centers/clinics
   - Registered dietitians (especially HAES/non-diet/ED-specialized)
   - Support groups (including free peer support options)
   - Sliding scale or lower-cost options when available
   - Telehealth providers if they serve this region
4. For each resource, provide: name, type, description, website URL (if available), phone (if available)
5. Verify that resources actually exist and serve the specified location
6. Group resources into logical categories

IMPORTANT - NAMED INDIVIDUALS:
- Prioritize finding NAMED individual practitioners (e.g., "Sarah Smith, Clinical Psychologist" not "Psychology Today therapists")
- Search directories like Psychology Today, Healthpoint, and professional registries to find SPECIFIC people by name
- When you find a directory listing, extract the actual practitioner names and list them individually
- Include their credentials, specialties, and any distinguishing details
- AVOID generic entries like "Multiple therapists on Psychology Today" - instead, name 2-3 specific individuals you find
- Individual practitioners appreciate being discoverable - help connect them with people who need their services

${preferenceText}

The person is at "${stageName}" stage. Resources that typically help at this stage include:
${stageHelps.map(h => `- ${h}`).join('\n')}

IMPORTANT: Search thoroughly. Take your time to find quality, relevant resources. This information could meaningfully help someone's recovery journey.`;

    const userPrompt = `Please search for eating disorder support resources in or serving: ${location}

Find real, specific resources including:
1. NAMED therapists/psychologists specializing in eating disorders (search Psychology Today, Healthpoint, professional directories - give me actual names)
2. Eating disorder treatment programs or clinics  
3. NAMED dietitians specializing in eating disorders (especially non-diet/HAES approach)
4. Support groups (both professional and peer-led)
5. Recovery coaches or counsellors with ED specialization
6. Any sliding scale or accessible options

For practitioners, I want SPECIFIC NAMES like "Jane Doe, Clinical Psychologist" - not generic references to directories.

Return your findings as JSON in this exact format:
{
  "introduction": "Brief supportive intro about what you found for this location",
  "categories": [
    {
      "name": "Category Name",
      "resources": [
        {
          "name": "Resource Name",
          "type": "Therapist|Clinic|Dietitian|Support Group|Program|Coach",
          "description": "What they offer, specialties, approach",
          "url": "https://...",
          "phone": "phone number if available",
          "notes": "Sliding scale available, telehealth offered, etc."
        }
      ]
    }
  ],
  "additionalNotes": "Any helpful context about ED support in this region"
}

Search thoroughly and return ONLY the JSON, no other text.`;

    // Make the API call with web search
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: systemPrompt,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: userPrompt }]
    });

    // Extract text response
    let textContent = "";
    for (const block of response.content) {
      if (block.type === "text") {
        textContent += block.text;
      }
    }

    // Parse the JSON response
    let results;
    try {
      // Strip markdown code blocks if present
      let cleanedContent = textContent
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();
      
      // Find the start of JSON object
      const jsonStart = cleanedContent.indexOf('{');
      if (jsonStart === -1) {
        throw new Error("No JSON object found");
      }
      
      // Find matching closing brace by counting braces
      let braceCount = 0;
      let jsonEnd = -1;
      for (let i = jsonStart; i < cleanedContent.length; i++) {
        if (cleanedContent[i] === '{') braceCount++;
        if (cleanedContent[i] === '}') braceCount--;
        if (braceCount === 0) {
          jsonEnd = i + 1;
          break;
        }
      }
      
      if (jsonEnd === -1) {
        throw new Error("Unbalanced JSON braces");
      }
      
      const jsonString = cleanedContent.substring(jsonStart, jsonEnd);
      results = JSON.parse(jsonString);
      
    } catch (parseError) {
      console.error("JSON parse error:", parseError.message);
      console.error("Raw content preview:", textContent.substring(0, 500));
      results = {
        introduction: "We found some resources for you, though we had trouble formatting them perfectly.",
        categories: [{
          name: "Search Results",
          resources: [{
            name: "Raw Results",
            type: "Information",
            description: textContent.substring(0, 1000),
            url: null,
            phone: null
          }]
        }],
        additionalNotes: "Please try searching again for better formatted results."
      };
    }

    // Store successful results in Redis
    console.log('Search complete, storing results...');
    await redisSet(jobId, {
      status: 'complete',
      completedAt: Date.now(),
      results: results
    });
    console.log('Results stored successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'complete' })
    };

  } catch (error) {
    console.error('Background search error:', error);
    
    // Store error status in Redis
    await redisSet(jobId, {
      status: 'error',
      error: error.message || 'Search failed',
      completedAt: Date.now()
    });

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
