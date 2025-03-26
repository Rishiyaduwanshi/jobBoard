import { useAuth } from '../context/AuthContext';
import { mockApi } from '../config/api';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ApplicantDashboard from '../components/ApplicantDashboard';
import RecruiterDashboard from '../components/RecruiterDashboard';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}!</h1>
      {user?.role === 'recruiter' ? 
        <RecruiterDashboard user={user} data={data} setData={setData} /> : 
        <ApplicantDashboard user={user} />
      }
    </div>
  );
}

export default Dashboard;

