// search-start.js
// Triggers the background search and returns immediately with a job ID

import { getStore } from "@netlify/blobs";

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { jobId, stage, stageName, stageHelps, location, preference } = JSON.parse(event.body);

    if (!jobId || !location) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Store the job as "pending" with the search parameters
    const store = getStore("search-jobs");
    
    await store.setJSON(jobId, {
      status: "pending",
      createdAt: Date.now(),
      params: { stage, stageName, stageHelps, location, preference }
    });

    // Trigger the background function
    const backgroundUrl = `${process.env.URL || 'http://localhost:8888'}/.netlify/functions/search-resources-background`;
    
    // Fire and forget - don't await
    fetch(backgroundUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, stage, stageName, stageHelps, location, preference })
    }).catch(err => console.log('Background trigger sent'));

    return {
      statusCode: 202,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        jobId, 
        status: 'pending',
        message: 'Search started' 
      })
    };

  } catch (error) {
    console.error('Error starting search:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to start search' })
    };
  }
};
