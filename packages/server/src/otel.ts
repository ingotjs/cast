// Reference: https://posthog.com/docs/logs/installation/nodejs
// Reference: https://www.npmjs.com/package/@opentelemetry/instrumentation-pino

import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { consts } from "@packages/shared/consts";

import { serverEnv } from "./env";

/**
 * Initialize OpenTelemetry SDK with Pino instrumentation.
 * All Pino log calls automatically flow to PostHog Logs via OTLP.
 * Pino still outputs to stdout — this adds PostHog as a parallel destination.
 */
if (serverEnv.posthog) {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      "service.name": consts.appName,
    }),
    logRecordProcessor: new BatchLogRecordProcessor(
      new OTLPLogExporter({
        url: `${serverEnv.posthog.VITE_PUBLIC_POSTHOG_HOST}/v1/logs`,
        headers: {
          Authorization: `Bearer ${serverEnv.posthog.VITE_PUBLIC_POSTHOG_KEY}`,
        },
      })
    ),
    instrumentations: [new PinoInstrumentation()],
  });

  sdk.start();
}
