// src/security/helmet.js
const helmet = require('helmet');
const crypto = require('crypto');

module.exports = function configureSecurity(app) {
  // if you deploy behind a proxy (nginx/render/heroku), keep this:
  app.set('trust proxy', 1);

  // per-request nonce for safe inline <script nonce="..."> if needed later
  app.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
    next();
  });

  // base helmet hardening
  app.use(
    helmet({
      hsts: process.env.NODE_ENV === 'production' ? undefined : false, // enable HSTS only in prod/HTTPS
      hidePoweredBy: true,
      referrerPolicy: { policy: 'no-referrer' },
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
    })
  );

  // strict CSP (good for API or minimal HTML). Open up only if you add UI/CDNs later.
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: false,
      directives: {
        defaultSrc: ["'none'"],
        baseUri: ["'none'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],

        // scripts allowed from self + per-request nonce
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],

        // styles from self; if you later use Swagger/UI libs with inline styles, add "'unsafe-inline'" temporarily
        styleSrc: ["'self'"],

        // images (allow data: for small inline logos/favicons)
        imgSrc: ["'self'", "data:"],

        // xhr/fetch/websocket endpoints
        connectSrc: ["'self'"],

        // fonts if you serve local ones
        fontSrc: ["'self'", "data:"],

        workerSrc: ["'self'"],
        mediaSrc: ["'self'"],

        // upgrade any mixed content
        upgradeInsecureRequests: [],
      },
      reportOnly: false, // set true first if you want to observe before enforcing
    })
  );
};
