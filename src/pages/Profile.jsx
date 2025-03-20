import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    ...(user?.role === 'applicant' ? {
      resume: '',
      skills: user?.skills?.join(', ') || '',
      experience: user?.experience || ''
    } : {
      company: user?.company || '',
      companyWebsite: user?.companyInfo?.website || '',
      companyDescription: user?.companyInfo?.description || ''
    })
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const ApplicantProfile = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-field w-full"
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
          disabled
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Resume</label>
        <input
          type="file"
          name="resume"
          onChange={handleChange}
          className="input-field w-full"
          accept=".pdf,.doc,.docx"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          className="input-field w-full"
          placeholder="React, JavaScript, Node.js"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Experience</label>
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="input-field w-full h-32"
          placeholder="Describe your work experience..."
        />
      </div>
      <button type="submit" className="btn-primary">
        Update Profile
      </button>
    </form>
  );

  const RecruiterProfile = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-field w-full"
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
          disabled
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Company Name</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="input-field w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Company Website</label>
        <input
          type="url"
          name="companyWebsite"
          value={formData.companyWebsite}
          onChange={handleChange}
          className="input-field w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Company Description</label>
        <textarea
          name="companyDescription"
          value={formData.companyDescription}
          onChange={handleChange}
          className="input-field w-full h-32"
          placeholder="Describe your company..."
        />
      </div>
      <button type="submit" className="btn-primary">
        Update Profile
      </button>
    </form>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        <div className="card">
          {user?.role === 'applicant' ? <ApplicantProfile /> : <RecruiterProfile />}
        </div>
      </div>
    </div>
  );
}

export default Profile;