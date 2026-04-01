const AuditService = require('../services/auditService');

/**
 * Middleware to capture request context for audit logging
 * Attaches audit info to the request object for use in controllers
 */
const attachAuditContext = (req, res, next) => {
  req.auditContext = {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    userId: req.user?.id || null,
    userEmail: req.user?.email || null,
    endpoint: req.originalUrl,
    method: req.method,
    startTime: Date.now()
  };

  // Add helper to log behaviors
  req.logBehavior = async (behaviorData) => {
    const executionTimeMs = Date.now() - req.auditContext.startTime;
    
    return AuditService.logBehavior({
      ...behaviorData,
      userId: req.auditContext.userId,
      userRole: req.user?.role,
      ipAddress: req.auditContext.ipAddress,
      userAgent: req.auditContext.userAgent,
      endpoint: req.auditContext.endpoint,
      method: req.auditContext.method,
      executionTimeMs,
      result: behaviorData.result || 'SUCCESS'
    });
  };

  // Add helper to log changes
  req.logChange = async (changeData) => {
    return AuditService.logChange({
      ...changeData,
      userId: req.auditContext.userId,
      userEmail: req.auditContext.userEmail,
      ipAddress: req.auditContext.ipAddress,
      userAgent: req.auditContext.userAgent
    });
  };

  next();
};

/**
 * Middleware to automatically log successful responses
 */
const logResponseAudit = (req, res, next) => {
  const originalJson = res.json;

  res.json = function(data) {
    // Log behavior for successful responses
    if (res.statusCode >= 200 && res.statusCode < 300 && req.auditContext) {
      const executionTimeMs = Date.now() - req.auditContext.startTime;
      
      // Determine action based on method
      let action = 'REQUEST';
      if (req.method === 'POST') action = 'CREATE';
      if (req.method === 'PUT' || req.method === 'PATCH') action = 'UPDATE';
      if (req.method === 'DELETE') action = 'DELETE';

      // Use a timeout to prevent audit logging from blocking requests when DB is down
      const auditPromise = Promise.race([
        req.logBehavior({
          action: `${action}_SUCCESS`,
          category: 'USER_ACTIVITY',
          description: `${req.method} ${req.originalUrl}`,
          result: 'SUCCESS',
          executionTimeMs,
          severity: 'LOW'
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Audit timeout')), 2000))
      ]);

      auditPromise.catch(err => {
        // Silently fail - don't block the response
        if (process.env.DEBUG_AUDIT === 'true') {
          console.error('Failed to log response audit:', err.message);
        }
      });
    }

    return originalJson.call(this, data);
  };

  next();
};

/**
 * Middleware to automatically log errors
 */
const logErrorAudit = (err, req, res, next) => {
  if (req.auditContext) {
    const executionTimeMs = Date.now() - req.auditContext.startTime;

    // Use a timeout to prevent audit logging from blocking error responses
    const auditPromise = Promise.race([
      req.logBehavior({
        action: 'ERROR',
        category: 'SYSTEM_EVENT',
        description: `Error on ${req.method} ${req.originalUrl}`,
        result: 'FAILED',
        errorDetails: err.message,
        executionTimeMs,
        severity: 'HIGH'
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Audit timeout')), 2000))
    ]);

    auditPromise.catch(err => {
      // Silently fail - don't block error responses
      if (process.env.DEBUG_AUDIT === 'true') {
        console.error('Failed to log error audit:', err.message);
      }
    });
  }

  next(err);
};

module.exports = {
  attachAuditContext,
  logResponseAudit,
  logErrorAudit
};
