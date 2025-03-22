import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">JobBoard</Link>

        <div className="space-x-4">
          <Link to="/jobs" className="hover:text-primary-500">Jobs</Link>

          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-primary-500">Dashboard</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button onClick={logout} className="hover:text-primary-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary-500">Login</Link>
              <Link to="/signup" className="hover:text-primary-500">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;