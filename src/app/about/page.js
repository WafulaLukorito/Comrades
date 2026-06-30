export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      <section className="hero-section">
        <div className="container">
          <div className="hero-badge">Behind the Pen</div>
          <h1 className="hero-title">About Wafula Lukorito</h1>
          <p className="hero-subtitle">
            The writer, thinker, and curator behind Comrades and Snippets of my Mind.
          </p>
        </div>
      </section>

      <section className="container" style={{ maxWidth: "800px", paddingBottom: "6rem" }}>
        <div className="glass-panel" style={{ padding: "3rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "var(--accent-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "2rem",
                fontWeight: "800",
                fontFamily: "var(--font-heading)"
              }}
            >
              WL
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Wafula Lukorito (Jones)</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Blogger & Creative Thinker</p>
            </div>
          </div>

          <div className="blog-content" style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
            <p>
              Welcome to <strong>Comrades</strong> (originally hosted as <em>Snippets of my Mind</em>). 
              This blog is a collection of thoughts, reflections, creative writing, and observations on life, 
              relationships, and the affairs of the heart.
            </p>
            
            <p>
              Writing has always been my way of processing the world. Each article published here represents a 
              moment in time—a snapshot of a growing mind trying to decode the complexities of love, friendship, 
              personal growth, and societal changes.
            </p>
            
            <blockquote>
              "Absence extinguishes small loves and increases great ones, as the wind blows out a candle and blows up a bonfire."
            </blockquote>

            <p>
              This digital space has been preserved and migrated from cPanel archives to a modern Next.js 
              framework to ensure that these stories and the active discussions within the comments continue to 
              live on in a clean, high-performance, and beautifully styled format.
            </p>

            <p>
              Thank you for reading, sharing, and being part of this journey. Feel free to connect with me 
              on my socials below, or join the discussions in the comment threads of individual articles.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              borderTop: "1px solid var(--border-color)",
              paddingTop: "1.5rem",
              marginTop: "1rem"
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>Connect with me:</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <strong>Facebook:</strong>{" "}
                <a
                  href="https://www.facebook.com/jlukorides"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent-primary)", textDecoration: "underline" }}
                >
                  Wafula Lukorito
                </a>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <strong>Instagram:</strong>{" "}
                <a
                  href="https://www.instagram.com/JowalJones/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent-primary)", textDecoration: "underline" }}
                >
                  @JowalJones
                </a>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <strong>X (Twitter):</strong>{" "}
                <a
                  href="https://x.com/Lukorito_"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent-primary)", textDecoration: "underline" }}
                >
                  @Lukorito_
                </a>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href="https://www.linkedin.com/in/wafulalukorito/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent-primary)", textDecoration: "underline" }}
                >
                  Wafula Lukorito
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
