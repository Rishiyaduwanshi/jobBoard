import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-600 text-transparent bg-clip-text">
        Find Your Dream Job Today
      </h1>
      <p className="text-xl text-gray-400 mb-8 max-w-2xl">
        Connect with top companies and opportunities. Whether you're looking for your next career move or searching for talent, we've got you covered.
      </p>
      <div className="flex gap-4">
        {user ? (
          <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/signup" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-colors text-lg"
            >
              Login
            </Link>
          </>
        )}
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <div className="card">
          <h3 className="text-xl font-bold mb-2">For Job Seekers</h3>
          <p className="text-gray-400">
            Browse thousands of job opportunities and apply with just one click.
          </p>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-2">For Recruiters</h3>
          <p className="text-gray-400">
            Post jobs and find the perfect candidates for your company.
          </p>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold mb-2">Easy Application</h3>
          <p className="text-gray-400">
            Simple and streamlined application process for both parties.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;