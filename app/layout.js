import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import "./_styles/main.scss";

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
