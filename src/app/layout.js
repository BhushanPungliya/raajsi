import { Geist } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "./components/Header";
import Footer from "./components/footer/Footer";
import { ToastContainer } from "react-toastify";


const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Raajsi",
  description: "GenWelcome to Raajsi, where ancient Ayurveda meets modern care.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Header />
        <ToastContainer position="top-right" reverseOrder={false} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
