import { createFileRoute } from "@tanstack/react-router";

// Reference: https://posthog.com/docs/advanced/proxy

// oxlint-disable-next-line node/no-process-env -- proxy needs PostHog host at request time
const phRegion = (process.env.VITE_PUBLIC_POSTHOG_HOST ?? "").includes("eu") ? "eu" : "us";

const PH_API_HOST = `https://${phRegion}.i.posthog.com`;
const PH_ASSET_HOST = `https://${phRegion}-assets.i.posthog.com`;

const handler = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);

  const hostname = url.pathname.startsWith("/api/ph/static/") ? PH_ASSET_HOST : PH_API_HOST;

  const targetPath = url.pathname.replace(/^\/api\/ph/, "");
  const targetUrl = `${hostname}${targetPath}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set("host", new URL(hostname).host);
  headers.delete("cookie");

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method === "POST") {
    fetchOptions.body = request.body;
    // @ts-expect-error -- duplex is required for streaming body but not in all TS types
    fetchOptions.duplex = "half";
  }

  const response = await fetch(targetUrl, fetchOptions);

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
};

export const Route = createFileRoute("/api/ph/$")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
