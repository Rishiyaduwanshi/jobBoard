import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import JobListings from './pages/JobListings';
import ProfileForm from './pages/ProfileForm';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PostJob from './pages/PostJob';
import JobDetail from './pages/JobDetail';
import NotFound from './pages/NotFound';
import EditJob from './pages/EditJob';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/edit-job/:jobId" element={<EditJob />} />
                <Route path="/profile" element={<ProfileForm />} />
              </Route>
              <Route path="/jobs" element={<JobListings />} />
              {/* <Route path="/profile" element={<ProtectedRoute><ProfileForm /></ProtectedRoute>} /> */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;