// resource-detail.js
// Fetches a resource URL and generates an AI summary

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { url, resourceName, resourceType, userStage, stageName } = JSON.parse(event.body);

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL is required' })
      };
    }

    const systemPrompt = `You are a helpful assistant summarizing a resource for someone exploring eating disorder support. They are at the "${stageName}" stage.

Your job:
1. Summarize what this organization/practitioner offers
2. Highlight their approach and philosophy (if evident)
3. Note anything particularly relevant to someone at this stage
4. Mention practical details: location, telehealth options, cost/insurance if mentioned
5. Flag any potential considerations (e.g., waitlists, specific focus areas)

Keep your summary:
- Warm and supportive in tone
- Factual and balanced (not promotional)
- Organized with clear sections
- About 150-250 words

Format with these sections:
**What They Offer**
**Their Approach** 
**Practical Details**
**Good Fit If...**

If the website content is limited or unclear, acknowledge that and suggest they contact directly for more information.`;

    const userPrompt = `Please analyze this resource and provide a helpful summary:

Resource: ${resourceName}
Type: ${resourceType || 'Support Resource'}
Website: ${url}

Fetch and summarize the key information from their website that would help someone decide if this is a good fit for them.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: userPrompt }]
    });

    // Extract text response
    let summary = "";
    for (const block of response.content) {
      if (block.type === "text") {
        summary += block.text;
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary })
    };

  } catch (error) {
    console.error('Resource detail error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch resource details' })
    };
  }
};
