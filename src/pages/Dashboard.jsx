import { useAuth } from '../context/AuthContext';
import { mockApi } from '../config/api';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all');

  const [data, setData] = useState({
    jobs: [],
    applications: [],
    savedJobs: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const jobs = await mockApi.getJobs();
      setData(prev => ({
        ...prev,
        jobs: jobs.filter(job =>
          user.role === 'recruiter'
            ? job.recruiterId === user.id
            : true
        )
      }));
    };
    fetchData();
  }, [user]);


  useEffect(() => {
    if (selectedJob) {
      loadApplications(selectedJob._id);
    }
  }, [applicationStatusFilter]);

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await mockApi.deleteJob(jobId);
      if (response.success) {
        toast.success('Job deleted successfully');
        setData(prev => ({
          ...prev,
          jobs: prev.jobs.filter(job => job._id !== jobId)
        }));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete job');
    }
  };

  const loadApplications = async (jobId) => {
    const applications = await mockApi.getApplications(jobId, applicationStatusFilter);
    setSelectedJob(prev => ({ ...prev, applications }));
  };

  // Add this status change handler
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await mockApi.updateApplicationStatus(applicationId, newStatus);
      if (response.success) {
        toast.success(`Status updated to ${newStatus}`);
        setSelectedJob(prev => ({
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

  const RecruiterDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Job Postings</h2>
        <Link to="/post-job" className="btn-primary">
          Post New Job
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.jobs.map(job => (
          <div key={job._id} className="card relative">
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => navigate(`/post-job/${job._id}`)}
                className="text-primary-400 hover:text-primary-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteJob(job._id)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>

            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-400">{job.company}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge">{job.location}</span>
              <span className="badge">{job.type}</span>
              <span className="badge">{job.experience}</span>
            </div>

            <button
              onClick={() => {
                setSelectedJob(job);
                loadApplications(job._id);
              }}
              className="btn-secondary mt-4 w-full"
            >
              View Applications ({job.applications?.length || 0})
            </button>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="mt-8 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              Applications for {selectedJob.title}
            </h3>
            <select
              value={applicationStatusFilter}
              onChange={(e) => setApplicationStatusFilter(e.target.value)}
            className='input-field' 
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-4">
            {selectedJob.applications?.map(application => (
              <div key={application._id} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{application.applicant?.name}</p>
                    <p className="text-gray-400 text-sm">{application.applicant?.email}</p>
                    <p className="text-sm mt-2">
                      Applied: {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusChange(application._id, e.target.value)}
                      className={`badge-${application.status.toLowerCase()} input-field`}
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
  );

  const ApplicantDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Applications</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {data.applications.map(application => (
            <div key={application.id} className="card">
              <h3 className="text-xl font-semibold">{application.jobTitle}</h3>
              <p className="text-gray-400">{application.company}</p>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded text-sm ${application.status === 'pending' ? 'bg-yellow-600' :
                    application.status === 'accepted' ? 'bg-green-600' :
                      'bg-red-600'
                  }`}>
                  {application.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {data.savedJobs.map(job => (
            <div key={job.id} className="card">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-400">{job.company}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-primary-400">{job.salary}</span>
                <Link to={`/jobs/${job.id}`} className="btn-primary">
                  View Job
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}!</h1>
      {user?.role === 'recruiter' ? <RecruiterDashboard /> : <ApplicantDashboard />}
    </div>
  );
}

export default Dashboard;