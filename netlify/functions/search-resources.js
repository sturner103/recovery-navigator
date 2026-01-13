// search-resources.js
// Simplified, optimized search function

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { stage, stageName, stageHelps, location, preference } = JSON.parse(event.body);

    // Build preference text
    let preferenceText = "";
    if (preference === "local") {
      preferenceText = "Focus on in-person services only.";
    } else if (preference === "remote") {
      preferenceText = "Focus on telehealth/remote services only.";
    } else {
      preferenceText = "Include both in-person and telehealth options.";
    }

    // Simplified, faster prompt
    const systemPrompt = `You are an eating disorder support navigator. Search for REAL resources in the specified location. Be concise but helpful. ${preferenceText}`;

    const userPrompt = `Find eating disorder support resources in: ${location}

Stage: ${stageName}
Helpful resources for this stage: ${stageHelps.join(', ')}

Search for 3-5 real resources including therapists, dietitians, support groups, or clinics specializing in eating disorders.

Return ONLY valid JSON in this format:
{"introduction":"One sentence about resources in this area","categories":[{"name":"Category","resources":[{"name":"Provider Name","type":"Therapist/Clinic/Dietitian/Support Group","description":"Brief description","url":"website if found","phone":"phone if found"}]}],"additionalNotes":"One helpful tip"}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
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

    // Parse JSON
    let results;
    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        results = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (parseError) {
      // Fallback response
      results = {
        introduction: "We found some resources for you.",
        categories: [{
          name: "Search Results",
          resources: [{
            name: "Results",
            type: "Information", 
            description: textContent.substring(0, 500),
            url: null,
            phone: null
          }]
        }],
        additionalNotes: "Try the DIY search prompts for more options."
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(results)
    };

  } catch (error) {
    console.error('Search error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Search failed',
        message: error.message 
      })
    };
  }
};
