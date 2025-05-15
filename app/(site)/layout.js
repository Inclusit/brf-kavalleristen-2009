"use client";
import Navbar from "../components/layout/Navbar";
import AdminNavWrapper from "../components/admin/AdminNavWrapper";
import Footer from "../components/layout/Footer";
import "../_styles/main.scss";
import Header from "../components/layout/Header";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import { UserProvider } from "../context/user";
import { HeaderRefreshProvider } from "../context/headerRefres";

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body>
        <a href="#main-content" className="skip-link">
          Hoppa till huvudinnehåll
        </a>

        <UserProvider>
          <HeaderRefreshProvider>
            <div className="site-container">
              <header>
                <AdminNavWrapper />
                <Header />
              </header>
              <nav aria-label="Huvudmeny" >
                <h2 id="mainnav-heading" className="sr-only">
                  Webbplatsnavigation
                </h2>
                <Navbar />
              </nav>

              <main id="main-content" className="site-wrap" role="main">
                <div className="breadcrumbs" aria-labelledby="breadcrumbs-heading">
                  <h2 id="breadcrumbs-heading" className="sr-only">
                    Webbplatsens navigering
                  </h2>
                  <Breadcrumbs />
                </div>
                <div>{children}</div>
              </main>

              <footer aria-labelledby="footer-heading">
                <h2 id="footer-heading" className="sr-only">
                  Sidfotsinformation
                </h2>
                <Footer />
              </footer>
            </div>
          </HeaderRefreshProvider>
        </UserProvider>
      </body>
    </html>
  );
}
