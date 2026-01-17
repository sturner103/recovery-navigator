// search-start.js
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisSet(key, value, exSeconds) {
  var url = UPSTASH_URL + "/set/" + key + "?EX=" + (exSeconds || 600);
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + UPSTASH_TOKEN },
    body: JSON.stringify(value)
  });
  return response.json();
}

export const handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const data = JSON.parse(event.body);
    const jobId = data.jobId;
    const stage = data.stage;
    const stageName = data.stageName;
    const stageHelps = data.stageHelps;
    const location = data.location;
    const preference = data.preference;
    if (!jobId || !location) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }
    await redisSet(jobId, { status: "pending", createdAt: Date.now(), params: { stage: stage, stageName: stageName, stageHelps: stageHelps, location: location, preference: preference } });
    var backgroundUrl = process.env.URL + "/.netlify/functions/search-resources-background";
    fetch(backgroundUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId: jobId, stage: stage, stageName: stageName, stageHelps: stageHelps, location: location, preference: preference }) }).catch(function(err) { console.log("Background trigger sent"); });
    return { statusCode: 202, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId: jobId, status: "pending", message: "Search started" }) };
  } catch (error) {
    console.error("Error starting search:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to start search" }) };
  }
};
