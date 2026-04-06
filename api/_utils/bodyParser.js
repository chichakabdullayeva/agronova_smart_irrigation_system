import formidable from 'formidable';

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

export async function parseFormBody(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}

export async function parseRequestBody(req) {
  const contentType = String(req.headers['content-type'] || req.headers['Content-Type'] || '');
  if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
    return parseFormBody(req);
  }
  return parseJsonBody(req);
}
