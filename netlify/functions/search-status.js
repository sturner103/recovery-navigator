// search-status.js
// Polls Redis for search job status and returns results when complete

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet(key) {
  const response = await fetch(`${UPSTASH_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
  });
  const data = await response.json();
  return data.result ? JSON.parse(data.result) : null;
}

export const handler = async (event, context) => {
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
    const job = await redisGet(jobId);

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
