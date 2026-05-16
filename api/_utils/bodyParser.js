import formidable from 'formidable';

export async function parseJsonBody(req) {
  if (req.body) {
    if (typeof req.body === 'string') {
      const trimmedBody = req.body.trim();
      if (trimmedBody) {
        try {
          return JSON.parse(trimmedBody);
        } catch (error) {
          const err = new Error('Invalid JSON body');
          err.statusCode = 400;
          throw err;
        }
      }
    }

    if (typeof req.body === 'object' && Object.keys(req.body).length > 0) {
      return req.body;
    }
  }

  if (req.rawBody) {
    const rawBody = typeof req.rawBody === 'string' ? req.rawBody : req.rawBody.toString('utf8');
    if (rawBody.trim()) {
      try {
        return JSON.parse(rawBody);
      } catch (error) {
        const err = new Error('Invalid JSON body');
        err.statusCode = 400;
        throw err;
      }
    }
  }

  let rawBody = '';
  if (req.readable !== false) {
    for await (const chunk of req) {
      rawBody += chunk;
    }
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
