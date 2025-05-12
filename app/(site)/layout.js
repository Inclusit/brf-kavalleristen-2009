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
        <UserProvider>
          <div className="site-container">
            <header>
              <AdminNavWrapper />
              <Header />
            </header>
            <nav>
              <Navbar />
            </nav>

            <main className="site-wrap">
              <div>{children}</div>
            </main>

            <footer>
              <Footer />
            </footer>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
