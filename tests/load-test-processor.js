// Load test processor for Artillery
// This file contains custom logic for load testing scenarios

module.exports = {
  beforeRequest: function(requestParams, context, ee, next) {
    // Add custom headers, authentication, etc.
    requestParams.headers = requestParams.headers || {};
    requestParams.headers['User-Agent'] = 'Artillery-Load-Test/1.0';

    // Add session cookie if available
    if (context.vars.sessionCookie) {
      requestParams.headers['Cookie'] = `session=${context.vars.sessionCookie}`;
    }

    return next();
  },

  afterResponse: function(requestParams, response, context, ee, next) {
    // Check response time and log slow requests
    if (response.timings && response.timings.phases) {
      const totalTime = response.timings.phases.total;
      if (totalTime > 5000) { // Log requests taking more than 5 seconds
        console.log(`Slow request: ${requestParams.url} took ${totalTime}ms`);
      }
    }

    // Store session cookie for subsequent requests
    if (response.headers && response.headers['set-cookie']) {
      const cookies = response.headers['set-cookie'];
      const sessionCookie = cookies.find(cookie => cookie.startsWith('session='));
      if (sessionCookie) {
        context.vars.sessionCookie = sessionCookie.split(';')[0].split('=')[1];
      }
    }

    return next();
  },

  generateRandomData: function(context, events, done) {
    // Generate random test data
    context.vars.productId = `product_${Math.floor(Math.random() * 1000)}`;
    context.vars.userEmail = `test${Math.floor(Math.random() * 1000)}@example.com`;
    context.vars.quantity = Math.floor(Math.random() * 5) + 1;

    return done();
  }
};
