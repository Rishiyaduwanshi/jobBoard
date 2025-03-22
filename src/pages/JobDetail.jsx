import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockApi } from '../config/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await mockApi.getJob(id);
        setJob(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load job details');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id, navigate]);

  const handleApply = async () => {
    try {
      const response = await mockApi.applyJob(id);
      if (response.success) {
        toast.success(response.message);
        setJob(prev => ({ ...prev, isApplied: true }));
      } else {
        toast.error(response.message || 'Application failed');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
    }
  };


  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await mockApi.updateApplicationStatus(applicationId, newStatus);
      if (response.success) {
        toast.success(`Status updated to ${newStatus}`);
        setJob(prev => ({
          ...prev,
          applications: prev.applications.map(app => 
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        }));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card p-6">
        <button onClick={() => navigate(-1)} className="mb-6 text-primary-500 hover:underline">
          &larr; Back to Jobs
        </button>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className="text-xl text-gray-400 mt-2">{job.company}</p>
          </div>
          <span className="text-primary-400 font-semibold text-xl">{job.salary}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-gray-700 rounded-full">{job.location}</span>
          <span className="px-3 py-1 bg-gray-700 rounded-full">{job.type}</span>
          <span className="px-3 py-1 bg-gray-700 rounded-full">{job.experience}</span>
        </div>

        <div className="prose max-w-none mb-8">
          <h3 className="text-xl font-bold mb-4">Job Description</h3>
          <p className="text-gray-300">{job.description}</p>
        </div>

        {/* Requirements section - updated styling */}
        {job.requirements?.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Requirements</h3>
            <ul className="space-y-3 list-disc list-outside ml-6 text-gray-300">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="pl-2 text-primary-400/90">
                  <span className="text-gray-300">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {user?.role === 'applicant' && (
          <div className="mt-8">
            <button
              onClick={handleApply}
              className="btn-primary px-8 py-3 text-lg"
              disabled={job.isApplied}
            >
              {job.isApplied ? 'Applied ✓' : 'Apply Now'}
            </button>
          </div>
        )}

        
        {user?.role === 'recruiter' && job.applications?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Applications ({job.applications.length})</h3>
            <div className="space-y-4">
              {job.applications.map(application => (
                <div key={application._id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{application.applicant?.name}</p>
                      <p className="text-gray-400 text-sm">{application.applicant?.email}</p>
                      {/* <p className="text-sm mt-2">Applied: {new Date(application.createdAt).toLocaleDateString()}</p> */}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusChange(application._id, e.target.value)}
                   
                        className={`badge-${application.status ? application.status.toLowerCase() : 'applied'} px-3 py-1 rounded-md bg-gray-700 border border-gray-600`}
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <span className="text-xs text-gray-400">
                        Last updated: {new Date(application.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDetail;