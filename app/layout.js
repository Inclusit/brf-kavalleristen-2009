import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
