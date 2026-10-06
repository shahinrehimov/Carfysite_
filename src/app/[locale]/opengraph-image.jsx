import { ImageResponse } from "next/og";

export const alt = "Carfy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#00569C",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -2 }}>
          Carfy
        </div>
        <div style={{ fontSize: 32, marginTop: 18, opacity: 0.9 }}>
          Auto parts
        </div>
      </div>
    ),
    { ...size },
  );
}
