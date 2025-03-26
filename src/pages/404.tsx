import { Link } from "react-router-dom";

function NotFound() {
  return (
    <>
      <article>
        <title>404 | IT Tools</title>
        <meta
          name="description"
          content="The page you are looking for doesn't exist or has been moved."
        />
      </article>
      <div className="w-full max-w-4xl mx-auto text-center pt-24 px-6 pb-12">
        <div className="py-16">
          <h1 className="text-9xl font-bold text-black mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-lg mx-auto">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors inline-block"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </>
  );
}

export default NotFound;
