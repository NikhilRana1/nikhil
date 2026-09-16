import { Sora, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import ChatWidget from "@/components/ChatWidget";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "Nikhil Rana — Full Stack Developer",
  description: "Personal portfolio showcasing my projects and skills",
};

// Runs before first paint so a dark-mode visitor never sees a white flash.
// A saved choice wins; otherwise the OS preference decides.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    // The script above edits <html>'s class before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${sora.variable} ${jakarta.variable} ${jetbrainsMono.variable} antialiased bg-ground text-ink cursor-none`}
      >
        <SmoothScroll>
          <CustomCursor />
          {children}
          <ChatWidget />
        </SmoothScroll>
      </body>
    </html>
  );
}
