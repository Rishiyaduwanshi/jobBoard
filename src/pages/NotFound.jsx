import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
      <p className="text-2xl text-gray-300 mb-8">Page Not Found</p>
      <Link
        to="/"
        className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        Return to Homepage
      </Link>
    </div>
  );
}

export default NotFound;