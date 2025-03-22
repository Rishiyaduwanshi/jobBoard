import { useState } from 'react';
import { mockApi } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
    location: '',
    salary: '',
    type: 'Full-time',
    experience: '',
    description: '',
    requirements: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await mockApi.createJob({
        ...formData,
        requirements: formData.requirements.split(',').map(r => r.trim())
      });
      
      if (response.success) {
        toast.success('Job posted successfully!');
        navigate('/dashboard');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to post job');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Post New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="input-field w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="input-field w-full"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="input-field w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Salary Range</label>
            <input
              type="text"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
              className="input-field w-full"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Job Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="input-field w-full"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Experience Level</label>
            <input
              type="text"
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
              className="input-field w-full"
              placeholder="e.g., 4+ years"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Job Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="input-field w-full h-32"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Requirements (comma separated)
          </label>
          <textarea
            value={formData.requirements}
            onChange={(e) => setFormData({...formData, requirements: e.target.value})}
            className="input-field w-full h-24"
            placeholder="e.g., Java, Flutter, DSA"
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Post Job
        </button>
      </form>
    </div>
  );
}

export default PostJob;