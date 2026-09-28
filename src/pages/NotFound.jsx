import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <p className="font-display text-6xl font-extrabold text-violet-200">404</p>
        <p className="mt-2 font-display text-xl font-bold text-ink-900">Page not found</p>
        <p className="mt-1 text-sm text-ink-400">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    </Layout>
  );
}
