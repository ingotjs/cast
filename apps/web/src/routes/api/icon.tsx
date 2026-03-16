import { createFileRoute } from "@tanstack/react-router";
import { ImageResponse } from "@vercel/og";

// Reference: https://vercel.com/docs/functions/og-image-generation

const ICON_SIZE = 32;
const CACHE_MAX_AGE = 3600;

export const Route = createFileRoute("/api/icon")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const { searchParams } = new URL(request.url);
        const theme = searchParams.get("theme") ?? "light";
        const isDark = theme === "dark";

        return new ImageResponse(
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isDark ? "#145" : "#4fb8b2",
              borderRadius: "7px",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "white",
                fontFamily: "Georgia, serif",
                lineHeight: 1,
              }}
            >
              Ω
            </span>
          </div>,
          {
            width: ICON_SIZE,
            height: ICON_SIZE,
            headers: {
              "Cache-Control": `public, max-age=${CACHE_MAX_AGE}`,
            },
          }
        );
      },
    },
  },
});
