import "./globals.css"; // if you have global styles
import Navigation from "@/components/navigation";
import SessionProviderWrapper from "@/components/sessionProviderWrapper";

export const metadata = {
  title: "Shuttle Management",
  description: "Multi-route management system",
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper session={session}>
          <Navigation />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
