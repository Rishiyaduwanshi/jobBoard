import { useAuth } from '../context/AuthContext';

const JobCard = ({ job, showApply }) => {
  const { user } = useAuth();

  const handleApply = async () => {
    try {
      const response = await mockApi.applyJob(job._id);
      alert(response);
    } catch (error) {
      console.error('Application error:', error);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
      <p className="text-gray-400 mb-2">{job.company}</p>
      <div className="space-y-2 mb-4">
        <p>📍 {job.location}</p>
        <p>💰 {job.salary}</p>
        <p>🕒 {job.type}</p>
      </div>
      {showApply && (
        <button 
          onClick={handleApply}
          className="btn-primary w-full"
          disabled={!user}
        >
          Apply Now
        </button>
      )}
    </div>
  );
};

export default JobCard;
