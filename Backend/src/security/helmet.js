// src/security/helmet.js
const helmet = require('helmet');
const crypto = require('crypto');

module.exports = function configureSecurity(app) {

  // if you deploy behind a proxy (nginx/render/heroku), keep this:
  app.set('trust proxy', 1);

  // nonce = number onse used is generated for every request
  // allows <script nonce="..."> in HTML templates
  // Prevents attackers from injecting unauthorized inline scripts - xss
  app.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
    next();
  });

  // base helmet hardening
  app.use(
    helmet({
      //Only force HTTPS in production, not in development
      hsts: process.env.NODE_ENV === 'production' ? undefined : false, // enable HSTS only in prod/HTTPS
      //Removes the X-Powered-By header so attackers can’t see you’re running Express
      hidePoweredBy: true,
      //Stops sending referrer data to other sites
      referrerPolicy: { policy: 'no-referrer' },
      //Protects against cross-origin attacks
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
