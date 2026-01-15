// resource-detail.js
// Searches for a resource and generates an AI summary

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { url, resourceName, resourceType, stageName, location } = JSON.parse(event.body);

    if (!resourceName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Resource name is required' })
      };
    }

    const systemPrompt = `You are a helpful assistant summarizing a resource for someone exploring eating disorder support. They are at the "${stageName}" stage.

Your job:
1. Search for and summarize what this organization/practitioner offers
2. Highlight their approach and philosophy (if evident)
3. Note anything particularly relevant to someone at this stage
4. Mention practical details: location, telehealth options, cost/insurance if mentioned
5. Flag any potential considerations (e.g., waitlists, specific focus areas)

Keep your summary:
- Warm and supportive in tone
- Factual and balanced (not promotional)
- About 150-250 words

Format with these sections:
**What They Offer**
[2-3 sentences about services]

**Their Approach** 
[2-3 sentences about philosophy/methods]

**Practical Details**
[Location, hours, contact, cost info if available]

**Good Fit If...**
[1-2 sentences about who this might suit]

If you cannot find enough information, provide what you can and note that they should contact directly for more details.`;

    // Build search query - use URL if available, otherwise search by name
    let userPrompt;
    if (url) {
      userPrompt = `Please search for and summarize information about this resource:

Name: ${resourceName}
Type: ${resourceType || 'Support Resource'}
Website: ${url}

Find information from their website or other reliable sources to help someone decide if this is a good fit for them.`;
    } else {
      userPrompt = `Please search for and summarize information about this resource:

Name: ${resourceName}
Type: ${resourceType || 'Support Resource'}
Location: ${location || 'Unknown'}

Search for this practitioner or organization to find their website, services, and any other relevant information to help someone decide if this is a good fit for them.`;
    }

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

    // If we got an empty response, provide a fallback
    if (!summary || summary.trim().length < 50) {
      summary = `**What They Offer**
We couldn't retrieve detailed information about ${resourceName} at this time.

**Their Approach**
We weren't able to find specific details about their approach.

**Practical Details**
${url ? `Website: ${url}` : 'Website not available - try searching online for more information.'}

**Good Fit If...**
You're interested in learning more about their services. We recommend searching for them online or contacting them directly for the most accurate information.`;
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summary })
    };

  } catch (error) {
    console.error('Resource detail error:', error);
    
    // Return a graceful fallback instead of error
    const { resourceName, url } = JSON.parse(event.body || '{}');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        summary: `**What They Offer**
We couldn't retrieve detailed information about ${resourceName || 'this resource'} at this time.

**Practical Details**
${url ? `Website: ${url}` : 'Try searching online for more information.'}

**Next Steps**
Please search for them online or contact them directly for more information about their services, availability, and whether they might be a good fit for your needs.`
      })
    };
  }
};
