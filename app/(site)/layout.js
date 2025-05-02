import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../_styles/main.scss";
import Header from "../components/layout/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body>
        <div className="site-container">
          <header>
            <Header />
          </header>
          <nav>
            <Navbar />
          </nav>

          <main className="site-wrap">{children}</main>

          <footer>
            <Footer />
          </footer>
        </div>
      </body>
    </html>
  );
}
