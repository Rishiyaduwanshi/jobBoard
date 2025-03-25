import { useState, useEffect } from 'react';
import { mockApi } from '../config/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';

function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    salary: '',
    experience: '',
    type: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadJobs = async () => {
    const data = await mockApi.getJobs(filters);
    setJobs(data);
  };

  const handleApply = async (jobId) => {
    try {
      const response = await mockApi.applyJob(jobId);
      if (response.success) {
        toast.success(response.message);
        setJobs(prev => prev.map(job =>
          job._id === jobId ? { ...job, isApplied: true } : job
        ));
      } else {
        toast.error(response.message || 'Application failed');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Job saved successfully!');
    } catch (error) {
      toast.error('Failed to save job');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <div className="card sticky top-4">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="input-field w-full"
                  placeholder="Any location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salary Range</label>
                <select
                  value={filters.salary}
                  onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="">Any salary</option>
                  <option value="0-50000">₹0 - ₹50,000</option>
                  <option value="50000-100000">₹50,000 - ₹100,000</option>
                  <option value="100000+">₹100,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Experience</label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="">Any experience</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Job Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="">Any type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <h1 className="text-3xl font-bold mb-6">Available Jobs</h1>
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job._id} className="card hover:border-primary-500 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">
                      <Link to={`/jobs/${job._id}`} className="hover:text-primary-400 transition-colors">
                        {job.title}
                      </Link>
                    </h2>
                    <p className="text-gray-400">{job.company}</p>
                  </div>
                  <span className="text-primary-400 font-semibold">{job.salary}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {job.location}
                  </span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {job.type}
                  </span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                    {job.experience}
                  </span>
                </div>

                <p className="mt-4 text-gray-300">{job.description.slice(0, 200) + "..."}</p>

                <div className="mt-6 flex gap-4">
                  {user?.role === 'applicant' && (
                    <>
                      <button
                        onClick={() => handleApply(job._id)}
                        className="btn-primary"
                        disabled={!job._id || job.isApplied}
                      >
                        {job.isApplied ? 'Applied ✓' : 'Apply Now'}
                      </button>
                      {/* <button
                        onClick={() => handleSaveJob(job._id)}
                        className="px-4 py-2 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-colors"
                      >
                        Save Job
                      </button> */}
                    </>
                  )}
                  
                  {/* Added Know More button */}
                  <Link 
                    to={`/jobs/${job._id}`} 
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <span>Know More</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobListings;