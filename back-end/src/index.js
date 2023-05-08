const forrest = require("@forrestjs/core");

// external library Services
const serviceFetchQ = require("@forrestjs/service-fetchq");
const serviceFastify = require("@forrestjs/service-fastify");
const serviceFastifyHealthz = require("@forrestjs/service-fastify-healthz");
const serviceFastifyCROS = require("@forrestjs/service-fastify-cors");
const serviceHasuraClient = require("@forrestjs/service-hasura-client");

// Validate ENV
const envaild = require("envalid");
const env = envaild.cleanEnv(process.env, {
  LOG_LEVEL: envaild.str({
    desc: "Set the service log level",
    choices: ["error", "info", "verbose", "debug"],
    default: "verbose",
  }),
  HASURA_GRAPHQL_ADMIN_SECRET: envaild.str({
    desc: "Hasura admin secret for SQL queries",
    default: "hasura"
  })
});
/**
 * Import the App's Features
 * =========================
 *
 * A Feature is an isolated portion of business logic that
 * interacts with the App's Services
 */
const worldNewsViewerFeature= require("./features/world-news-viewer")
/**
 * Import Other libraries
 * =========================
 *
 *
 *
 */
const ConsoleLogger = require("./logger");

/**
 * Import the App's Services
 * =========================
 *
 */

/**
 * Configure and Run the App
 * =========================
 *
 * The boot process returns a Promise that you can handle
 * to figure out whether all was good or not.
 */
forrest
  .run({
    trace: "compact",
    LOG_LEVEL: env.LOG_LEVEL,
    settings: {
      fecthq: {
        clientName: "world-news-viewer",
        skipMaintenance: true,
        skipUpsertFetchq: true,
        logger: {
          instance: new ConsoleLogger()
        }
      },
      app: {
        workerSettings: {
            world_news_viewer: {
            rescheduleInterval: "30s",
            dropOnComplete: true
          }
        }
      },
      hasura: {
        endpoint: 'http://localhost:8080',
        secret: 'hasura',
        auth: {
          token: 'token'
        }
      }
    },
    services: [
      serviceFastify,
      serviceFastifyHealthz,
      serviceFastifyCROS,
      serviceHasuraClient,
      serviceFetchQ
    ],
    features: [worldNewsViewerFeature]
  })
  .catch(console.error);

