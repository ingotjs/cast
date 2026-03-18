import { createFileRoute } from "@tanstack/react-router";
import { ImageResponse } from "workers-og";

// Reference: https://github.com/kvnang/workers-og

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const CACHE_MAX_AGE = 3600;

export const Route = createFileRoute("/api/og")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const { searchParams } = new URL(request.url);
        const title = searchParams.get("title") ?? "OmegaStart";
        const description = searchParams.get("description") ?? "The modern full-stack starter";

        return new ImageResponse(
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #0a1418, #173a40)",
              fontFamily: "Georgia, serif",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "120px",
                height: "120px",
                background: "#4fb8b2",
                borderRadius: "26px",
                marginBottom: "32px",
              }}
            >
              <span
                style={{
                  fontSize: "88px",
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1,
                }}
              >
                Ω
              </span>
            </div>
            <span
              style={{
                fontSize: "56px",
                fontWeight: 700,
                color: "#d7ece8",
                letterSpacing: "-1px",
              }}
            >
              {title}
            </span>
            {description && (
              <span
                style={{
                  fontSize: "24px",
                  color: "#afcdc8",
                  marginTop: "12px",
                }}
              >
                {description}
              </span>
            )}
          </div>,
          {
            width: OG_WIDTH,
            height: OG_HEIGHT,
            headers: {
              "Cache-Control": `public, max-age=${CACHE_MAX_AGE}`,
            },
          }
        );
      },
    },
  },
});
