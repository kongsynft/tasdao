import "@/app/globals.css";
import { META_THEME_COLORS } from "@/config/site";
import { ThemeProvider } from "@/components/theme-providers";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              if (
                localStorage.theme === 'dark' || 
                ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)
              ) {
                document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}');
              } else {
                document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.light}');
              }
            } catch (_) {}
          `,
          }}
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
