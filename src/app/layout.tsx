import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import ChatWidget from "@/components/ai/ChatWidget";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Last Penny | Jazz • Culture • Community",
  description:
    "Ankara Kavaklıdere'nin kalbinde jazz, kültür ve topluluk buluşma noktası. Canlı müzik, özel kokteyller ve unutulmaz atmosfer.",
  keywords: "last penny, ankara bar, kavaklıdere, jazz bar, canlı müzik, kokteyl",
  openGraph: {
    title: "Last Penny | Jazz • Culture • Community",
    description:
      "Ankara Kavaklıdere'nin kalbinde jazz, kültür ve topluluk buluşma noktası.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="noise">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <ChatWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}