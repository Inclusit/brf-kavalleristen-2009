
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


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
