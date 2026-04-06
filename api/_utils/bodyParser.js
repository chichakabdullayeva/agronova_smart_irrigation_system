export async function parseJsonBody(req) {
  if (req.body && Object.keys(req.body).length > 0) {
    return req.body;
  }

  let rawBody = '';
  for await (const chunk of req) {
    rawBody += chunk;
  }

  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch (error) {
    const err = new Error('Invalid JSON body');
    err.statusCode = 400;
    throw err;
  }
}
