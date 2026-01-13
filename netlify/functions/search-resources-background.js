// search-resources-background.js
// Background function - can run up to 15 minutes
// Naming with -background suffix tells Netlify to run this as background function

const Anthropic = require("@anthropic-ai/sdk").default;
const { getStore } = require("@netlify/blobs");

const client = new Anthropic();

exports.handler = async (event, context) => {
  // Background functions should return immediately
  // The actual work happens after the return
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { jobId, stage, stageName, stageHelps, location, preference } = JSON.parse(event.body);
  const store = getStore("search-jobs");

  try {
    // Update status to "searching"
    await store.setJSON(jobId, {
      status: "searching",
      progress: "Starting search...",
      createdAt: Date.now(),
      params: { stage, stageName, stageHelps, location, preference }
    });

    // Build preference text
    let preferenceText = "";
    if (preference === "local") {
      preferenceText = "Focus on IN-PERSON services only - clinics, therapists with physical offices, local support groups that meet face-to-face.";
    } else if (preference === "remote") {
      preferenceText = "Focus on REMOTE/TELEHEALTH services only - online therapy, virtual support groups, telehealth providers who serve this region.";
    } else {
      preferenceText = "Include BOTH in-person local services AND remote/telehealth options that serve this area.";
    }

    // Build the search prompt
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

${preferenceText}

The person is at "${stageName}" stage. Resources that typically help at this stage include:
${stageHelps.map(h => `- ${h}`).join('\n')}

IMPORTANT: Search thoroughly. Take your time to find quality, relevant resources. This information could meaningfully help someone's recovery journey.`;

    const userPrompt = `Please search for eating disorder support resources in or serving: ${location}

Find real, specific resources including:
1. Therapists/psychologists specializing in eating disorders
2. Eating disorder treatment programs or clinics  
3. Dietitians specializing in eating disorders (especially non-diet/HAES approach)
4. Support groups (both professional and peer-led)
5. Any sliding scale or accessible options

Return your findings as JSON in this exact format:
{
  "introduction": "Brief supportive intro about what you found for this location",
  "categories": [
    {
      "name": "Category Name",
      "resources": [
        {
          "name": "Resource Name",
          "type": "Therapist|Clinic|Dietitian|Support Group|Program",
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

    // Update progress
    await store.setJSON(jobId, {
      status: "searching",
      progress: "Searching for therapists and specialists...",
      createdAt: Date.now(),
      params: { stage, stageName, stageHelps, location, preference }
    });

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
      // Try to find JSON in the response
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        results = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Create a structured response from the text
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

    // Store successful results
    await store.setJSON(jobId, {
      status: "complete",
      progress: "Search complete!",
      completedAt: Date.now(),
      results: results
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'complete' })
    };

  } catch (error) {
    console.error('Background search error:', error);
    
    // Store error status
    await store.setJSON(jobId, {
      status: "error",
      error: error.message || "Search failed",
      completedAt: Date.now()
    });

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
