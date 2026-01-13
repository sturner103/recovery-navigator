const handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { stage, stageName, stageHelps, location, preference } = JSON.parse(event.body);

  const preferenceText = preference === 'local' ? 'in-person only' : 
                         preference === 'remote' ? 'telehealth/online only' : 
                         'both in-person and telehealth';

  const prompt = `Find eating disorder support resources in ${location} for someone at "${stageName}" stage who needs: ${stageHelps.join(', ')}.

IMPORTANT SEARCH GUIDANCE:
- Look beyond major hospitals and universities
- Prioritize: private practice therapists, specialized ED clinics, independent dietitians
- Include: support groups (free), HAES/non-diet practitioners, sliding scale options
- Search for: "eating disorder therapist ${location}", "HAES dietitian ${location}", "ED support group ${location}"
- Preference: ${preferenceText}

Return JSON only:
{
  "introduction": "Brief encouraging intro",
  "categories": [
    {
      "name": "Category Name",
      "resources": [
        {
          "name": "Resource name",
          "type": "Therapist|Clinic|Support Group|Dietitian|Program",
          "description": "2-3 sentences",
          "url": "website if found",
          "phone": "phone if found"
        }
      ]
    }
  ]
}

Include 3-4 categories with 2-4 resources each. Prioritize smaller, specialized providers over large institutions. Include at least one free or low-cost option if possible.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
        tools: [{
          name: 'web_search',
          type: 'web_search_20250305'
        }]
      })
    });

    const data = await response.json();
    
    let textContent = '';
    if (data.content) {
      for (const block of data.content) {
        if (block.type === 'text') {
          textContent += block.text;
        }
      }
    }

    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        introduction: "We found some resources that may help.",
        categories: [{ name: "Resources", resources: [{ name: "Search completed", description: textContent.substring(0, 500) }] }]
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Search failed' })
    };
  }
};

module.exports = { handler };