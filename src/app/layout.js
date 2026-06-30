import "./globals.css";
import Navbar from "src/components/Navbar";
import Footer from "src/components/Footer";

export const metadata = {
  title: "Comrades | Snippets of my Mind",
  description: "Personal blog of Wafula Lukorito (Jones) containing stories, thoughts, and affairs of the heart.",
};

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
      } else {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        if (mq.matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Navbar />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
