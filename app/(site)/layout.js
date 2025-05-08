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
              <Header />
            </header>
            <nav>
              <Navbar />
            </nav>
            <AdminNavWrapper />

            <main className="site-wrap">{children}</main>

            <footer>
              <Footer />
            </footer>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
