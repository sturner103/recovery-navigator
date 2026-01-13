// Netlify Function: search-resources
// Calls Claude API with web search to find ED support resources

export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Parse request body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { stage, stageName, stageHelps, location, preference } = body;

  if (!location) {
    return { statusCode: 400, body: 'Location is required' };
  }

  // Get API key from environment
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not configured');
    return { statusCode: 500, body: 'Server configuration error' };
  }

  // Build the search prompt based on stage and preferences
  const searchTypes = {
    local: 'in-person resources only',
    remote: 'telehealth and online resources only',
    both: 'both in-person and remote/telehealth resources'
  };

  const prompt = `You are helping someone find eating disorder support resources. Search for real, current resources and return structured results.

CONTEXT:
- Location: ${location}
- Support stage: ${stageName} (Level ${stage})
- What typically helps at this stage: ${stageHelps.join('; ')}
- Search preference: ${searchTypes[preference] || searchTypes.both}

TASK:
Search for eating disorder support resources that match this person's stage and location. Focus on finding:
${stage === 0 ? `- Psychoeducation resources and body image programs
- Gentle embodiment practices (yoga, mindful movement)
- Educational websites and anonymous screening tools
- Support groups for early concerns` : ''}
${stage === 1 ? `- Facilitated support groups
- Somatic and embodiment practitioners
- Non-diet dietitians and intuitive eating support
- Coaching and skills-based programs
- Online support communities` : ''}
${stage === 2 ? `- Eating disorder therapists and psychologists
- Non-diet/HAES-aligned dietitians
- Outpatient treatment programs
- Family education resources
- Adjunctive somatic/body-based therapy` : ''}
${stage === 3 ? `- Eating disorder specialists and clinics
- Intensive outpatient programs (IOP)
- Day programs
- Residential treatment options
- Medical evaluation resources
- Crisis and urgent support` : ''}

${preference === 'local' || preference === 'both' ? `Search for LOCAL resources in/near ${location}.` : ''}
${preference === 'remote' || preference === 'both' ? `Search for REMOTE/TELEHEALTH options that serve ${location} or are available internationally.` : ''}

IMPORTANT GUIDELINES:
- Search for REAL resources that currently exist
- Include organization names, what they offer, and website URLs when available
- Include phone numbers for crisis resources or intake lines
- Note whether each resource is in-person, telehealth, or both
- If a resource serves a specific region, note that
- Do not make up or hallucinate resources - only include what you find
- If limited resources exist locally, note this and suggest broader options

RESPONSE FORMAT:
Return a JSON object with this structure:
{
  "introduction": "A brief 1-2 sentence summary acknowledging their stage and location",
  "categories": [
    {
      "name": "Category name (e.g., 'Therapy & Counseling', 'Support Groups', 'Dietitian Support')",
      "description": "Optional brief description of this category",
      "resources": [
        {
          "name": "Organization or provider name",
          "type": "In-person | Telehealth | Both",
          "description": "What they offer and why it might be relevant",
          "details": ["Location or region served", "Any notable specializations"],
          "url": "https://... (if found)",
          "phone": "Phone number (if found and relevant)"
        }
      ]
    }
  ]
}

Search now and return ONLY the JSON object, no other text.`;

  try {
    // Call Claude API with web search tool
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        tools: [
          {
            type: 'web_search_20250305',
            name: 'web_search'
          }
        ],
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Search service unavailable' })
      };
    }

    const data = await response.json();
    
    // Extract text content from response
    let resultText = '';
    for (const block of data.content) {
      if (block.type === 'text') {
        resultText += block.text;
      }
    }

    // Try to parse as JSON
    let results;
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanedText = resultText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.slice(7);
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3);
      }
      cleanedText = cleanedText.trim();
      
      results = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError);
      console.error('Raw response:', resultText);
      
      // Return a fallback structure with the raw text
      results = {
        introduction: "We found some resources that may be helpful.",
        categories: [
          {
            name: "Search Results",
            resources: [
              {
                name: "Resources found",
                type: "Various",
                description: resultText.substring(0, 500) + (resultText.length > 500 ? '...' : ''),
                details: ["Please search directly for more specific results"]
              }
            ]
          }
        ]
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(results)
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Search failed. Please try again.' })
    };
  }
}
