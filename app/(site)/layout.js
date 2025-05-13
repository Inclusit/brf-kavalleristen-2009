import Navbar from "../components/layout/Navbar";
import AdminNavWrapper from "../components/admin/AdminNavWrapper";
import Footer from "../components/layout/Footer";
import "../_styles/main.scss";
import Header from "../components/layout/Header";
import { UserProvider } from "../context/user";

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body>
        <a href="#main-content" className="skip-link">
          Hoppa till huvudinnehåll
        </a>

        <UserProvider>
          <div className="site-container">
            <header>
              <AdminNavWrapper />
              <Header />
            </header>
            <nav>
              <h2 id="mainnav-heading" className="sr-only">
                Webbplatsnavigation
              </h2>
              <Navbar />
            </nav>

            <main id="main-content" className="site-wrap" role="main">
              <div>{children}</div>
            </main>

            <footer aria-labelledby="footer-heading">
              <h2 id="footer-heading" className="sr-only">
                Sidfotsinformation
              </h2>
              <Footer />
            </footer>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
