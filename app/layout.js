import Header from "@/components/Header";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Alegreya_Sans_SC } from "next/font/google";

const alegreyaSansSC = Alegreya_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "700"], // Choose the font weights you need
  display: "swap",
});

export const metadata = {
  title: "Reflect",
  description: "A Journaling App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${alegreyaSansSC.className} md:px-10 px-2`}>
          <div
            className="bg-noise bg-overlay opacity-35
           fixed -z-10 inset-0 "
          />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          <footer className="bg-blue-300 py-12 bg-opacity-10 ">
            <div className="mx-auto px-4 text-center text-gray-900">
              <p>Made With ❤️ Rajesh</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
