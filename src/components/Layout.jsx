import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children, noFooter = false }) {
  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}
