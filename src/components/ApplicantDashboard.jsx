import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockApi } from '../config/api';
import toast from 'react-hot-toast';

function ApplicantDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('applications');
  const [applicantData, setApplicantData] = useState({
    applications: [],
    savedJobs: [],
    recommendedJobs: []
  });

  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        let applications = [];
        try {
          const response = await mockApi.getApplicantApplications(user._id);
          console.log("Applications fetched:", response);
          applications = response || [];
        } catch (appError) {
          console.error("Failed to fetch applications:", appError);
          applications = [];
        }
        
        let recommendedJobs = [];
        try {
          const allJobs = await mockApi.getJobs();
          console.log("All jobs fetched for recommendations:", allJobs);
          
          const userSkills = user.skills || [];
          
          recommendedJobs = allJobs
            .filter(job => !applications.some(app => app.jobId === job._id))
            .map(job => {
              const jobSkills = job.skills || [];
              const matchingSkills = userSkills.filter(skill => 
                jobSkills.some(jobSkill => 
                  jobSkill.toLowerCase().includes(skill.toLowerCase()) || 
                  skill.toLowerCase().includes(jobSkill.toLowerCase())
                )
              );
              return { ...job, matchScore: matchingSkills.length };
            })
            .sort((a, b) => b.matchScore - a.matchScore) 
            .slice(0, 4);
        } catch (recError) {
          console.error("Failed to fetch recommended jobs:", recError);
          recommendedJobs = [];
        }
        
        setApplicantData({
          applications,
          savedJobs: [], // Set to empty array
          recommendedJobs
        });
      } catch (error) {
        console.error('Error fetching applicant data:', error);
        toast.error('Failed to load your dashboard data');
      }
    };
    
    if (user && user._id) {
      fetchApplicantData();
    }
  }, [user]);


  return (
    <div className="space-y-6">
      {/* Profile Summary Card */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
            {user?.phone && <p className="text-gray-400">{user?.phone}</p>}
          </div>
          <Link to="/profile" className="btn-secondary">
            Edit Profile
          </Link>
        </div>
        
        {user?.skills && user.skills.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-gray-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-700">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'applications' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('applications')}
        >
          My Applications
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'recommended' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('recommended')}
        >
          Recommended
        </button>
      </div>
      
      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Your Applications</h2>
          {applicantData.applications.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-400">You haven't applied to any jobs yet.</p>
              <Link to="/jobs" className="btn-primary mt-4 inline-block">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {applicantData.applications.map(application => (
                <div key={application._id} className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">
                      {application.job ? application.job.title : 'Job No Longer Available'}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      application.status === 'applied' ? 'bg-blue-600/20 text-blue-400' :
                      application.status === 'reviewed' ? 'bg-purple-600/20 text-purple-400' :
                      application.status === 'shortlisted' ? 'bg-green-600/20 text-green-400' :
                      'bg-red-600/20 text-red-400'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                  
                  {application.job ? (
                    <>
                      <p className="text-gray-400 mt-1">{application.job.company}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="badge px-3 py-1 bg-gray-700 rounded-full">{application.job.location}</span>
                        <span className="badge px-3 py-1 bg-gray-700 rounded-full">{application.job.type}</span>
                        <span className="badge px-3 py-1 bg-gray-700 rounded-full">{application.job.salary}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-400 mt-1">This job posting has been removed</p>
                  )}
                  
                  <p className="text-gray-400 text-sm mt-2">
                    Applied on: {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-300">
                      {application.status === 'applied' && 'Waiting for review'}
                      {application.status === 'reviewed' && 'Your application is being reviewed'}
                      {application.status === 'shortlisted' && 'You\'ve been shortlisted!'}
                      {application.status === 'rejected' && 'Application not selected'}
                    </span>
                    
                    {application.job && (
                      <Link to={`/jobs/${application.job._id}`} >
                        <span className='text-primary-500 text-sm px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors'>
                        View Job
                        </span>
               
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Recommended Jobs Tab */}
      {activeTab === 'recommended' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Recommended for You</h2>
          <p className="text-gray-400">Based on your skills and profile</p>
          
          {applicantData.recommendedJobs.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-400">Complete your profile with skills to get job recommendations.</p>
              <Link to="/profile" className="btn-primary mt-4 inline-block">
                Update Profile
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {applicantData.recommendedJobs.map(job => (
                <div key={job._id} className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-gray-400">{job.company}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="badge">{job.location}</span>
                      <span className="badge">{job.type}</span>
                    </div>
                    
                    {job.matchScore > 0 && (
                      <div className="mt-2">
                        <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
                          {job.matchScore} skill match{job.matchScore > 1 ? 'es' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-primary-400">{job.salary}</span>
                    <div className="space-x-2">
                      <Link to={`/jobs/${job._id}`} className="btn-secondary text-sm py-1 px-3">
                        View Details
                      </Link>
                      <Link to={`/apply/${job._id}`} className="btn-primary text-sm py-1 px-3">
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ApplicantDashboard;