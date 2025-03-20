import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { mockApi } from '../config/api';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'applicant',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call the backend API for signup
      const result = await mockApi.signup(formData);
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/login');
      } else {
        toast.error(result.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field w-full"
            >
              <option value="applicant">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;