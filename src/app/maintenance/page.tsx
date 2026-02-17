export const metadata = {
  title: "Website Under Maintenance",
};

export default function MaintenancePage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.8; }
            }
          `,
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          zIndex: 99999,
        }}
      >
        {/* Warning Icon */}
        <div
          style={{
            fontSize: "5rem",
            marginBottom: "1.5rem",
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          ⚠️
        </div>

        {/* Main Heading */}
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: "#ff6b6b",
            marginBottom: "1.5rem",
            lineHeight: 1.2,
            textTransform: "uppercase",
            letterSpacing: "2px",
            textShadow: "0 0 20px rgba(255, 107, 107, 0.3)",
          }}
        >
          Website Under Maintenance
        </h1>

        {/* Divider */}
        <div
          style={{
            width: "120px",
            height: "4px",
            background: "linear-gradient(90deg, #ff6b6b, #ffa502)",
            borderRadius: "2px",
            marginBottom: "2rem",
          }}
        />

        {/* Message Box */}
        <div
          style={{
            background: "rgba(255, 107, 107, 0.1)",
            border: "2px solid rgba(255, 107, 107, 0.4)",
            borderRadius: "16px",
            padding: "2.5rem 3rem",
            maxWidth: "700px",
          }}
        >
          <p
            style={{
              fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
              fontWeight: 700,
              color: "#ffa502",
              marginTop: 0,
              marginBottom: "1rem",
              lineHeight: 1.5,
            }}
          >
            Remaining payment has not been received.
          </p>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
              fontWeight: 600,
              color: "#ff6b6b",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Website maintenance is not complete until the outstanding balance is
            cleared.
          </p>
        </div>

        {/* Sub-text */}
        <p
          style={{
            marginTop: "2.5rem",
            fontSize: "1rem",
            color: "rgba(255, 255, 255, 0.4)",
            maxWidth: "500px",
            lineHeight: 1.6,
          }}
        >
          All services, including login, dashboards, and course access, are
          currently unavailable. Please contact the administrator for further
          information.
        </p>
      </div>
    </>
  );
}
