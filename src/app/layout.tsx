import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AppFooter from "@/layout/AppFooter";
import RouteChangeBar from "@/utils/routeChangeBar";

export const metadata = {
  title: 'SIMPEG - Sistem Informasi Kepegawaian',
  description: 'Sistem Informasi Manajemen Kepegawaian untuk pengelolaan data pegawai',
  keywords: ['simpeg', 'kepegawaian', 'management', 'pegawai', 'sistem informasi'],
  authors: [{ name: 'Admin SIMPEG' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={` min-h-screen min-w-full`}
      >
        <div className="fixed inset-0 bg-gradient-to-t from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-900 -z-10" />
        <RouteChangeBar />
        <ThemeProvider>
          <SidebarProvider>
            <main className="relative min-h-screen">
              {children}
              <AppFooter />
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
