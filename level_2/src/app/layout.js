import "./globals.css";

export default function RootLayout({ children, team, analytics }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <div className="w-full h-full flex flex-col">
          <div className="bg-blue-50 h-screen w-full">{children}</div>
          <div className="bg-blue-400 h-screen w-full">{team}</div>
          <div className="bg-blue-900 h-screen w-full">{analytics}</div>
        </div>

      </body>
    </html>
  );
}
