import { useAuth } from '../context/AuthContext';
import { mockApi } from '../config/api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();
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
          <div key={job._id} className="card">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-gray-400">{job.company}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-primary-400">{job.applications?.length || 0} applications</span>
              <button className="btn-primary">View Applications</button>
            </div>
          </div>
        ))}
      </div>
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
                <span className={`px-2 py-1 rounded text-sm ${
                  application.status === 'pending' ? 'bg-yellow-600' :
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