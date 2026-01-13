// search-status.js
// Polls for search job status and returns results when complete

const { getStore } = require("@netlify/blobs");

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const jobId = event.queryStringParameters?.jobId;

  if (!jobId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing jobId parameter' })
    };
  }

  try {
    const store = getStore("search-jobs");
    const job = await store.get(jobId, { type: "json" });

    if (!job) {
      return {
        statusCode: 404,
        body: JSON.stringify({ 
          status: 'not_found',
          error: 'Job not found. It may have expired.' 
        })
      };
    }

    // Return the job status (and results if complete)
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    };

  } catch (error) {
    console.error('Error checking status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        status: 'error',
        error: 'Failed to check search status' 
      })
    };
  }
};
