import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockApi } from '../config/api';
import toast from 'react-hot-toast';
import { PhoneIcon, DocumentIcon } from '@heroicons/react/24/outline';

function RecruiterDashboard({ user, data, setData }) {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all');

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
    try {
      const response = await mockApi.getJobApplications(jobId);
      setData(prev => ({
        ...prev,
        applications: response.data
      }));
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await mockApi.updateApplicationStatus(applicationId, newStatus);
      setData(prev => ({
        ...prev,
        applications: prev.applications.map(app =>
          app.applicationId === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      }));
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
      <div className="w-full md:flex-1 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0">
          <h2 className="text-xl md:text-2xl font-bold">Your Job Postings</h2>
          <Link to="/post-job" className="btn-primary w-full md:w-auto text-sm md:text-base">
            Post New Job
          </Link>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.jobs.map(job => (
            <div key={job._id} className="card relative p-3 md:p-4">
              <div className="absolute top-1 right-1 md:top-2 md:right-2 flex gap-1">
                <button onClick={() => navigate(`/edit-job/${job._id}`)} 
                  className="text-sm md:text-base text-primary-400 px-2 py-1">
                  Edit
                </button>
                <button onClick={() => handleDeleteJob(job._id)}
                  className="text-sm md:text-base text-red-400 px-2 py-1">
                  Delete
                </button>
              </div>
  
              <h3 className="text-lg md:text-xl font-semibold">{job.title}</h3>
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
          <div className="w-full md:w-[500px] sticky top-0 bg-gray-900 p-4 md:p-6 rounded-lg shadow-xl border border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4">
              <h3 className="text-lg md:text-xl font-bold">Applications for {selectedJob.title}</h3>
              <select 
                value={applicationStatusFilter}
                onChange={(e) => setApplicationStatusFilter(e.target.value)}
                className="text-sm md:text-base input-field w-full md:w-48"
              >
                <option value="all">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
  
            <div className="space-y-3 h-[calc(100vh-160px)] md:h-[calc(100vh-200px)] overflow-y-auto">
              {data.applications
                .filter(app => applicationStatusFilter === 'all' || app.status === applicationStatusFilter)
                .map(application => (
                  <div key={application.applicationId} className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="mb-3 border-b border-gray-700 pb-2">
                          <h4 className="font-semibold text-primary-400">
                            {application.jobDetails?.title} @ {application.jobDetails?.company}
                          </h4>
                          <p className="text-xs text-gray-400">{application.jobDetails?.location}</p>
                        </div>
  
                        <p className="font-medium text-base md:text-lg">{application.applicantProfile?.name}</p>
                        <p className="text-gray-400 text-sm">{application.applicantProfile?.contact}</p>
                        
                        <div className="mt-2 space-y-1">
                          {application.applicantProfile?.phone && (
                            <p className="text-sm flex items-center gap-2">
                              <PhoneIcon className="w-4 h-4" />
                              {application.applicantProfile.phone}
                            </p>
                          )}
                          
                          {application.applicantProfile?.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {application.applicantProfile.skills.map((skill, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-700 rounded-full text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
  
                        <div className="mt-3 space-y-2">
                          {application.applicantProfile?.education?.map((edu, index) => (
                            <div key={index} className="text-xs">
                              <p className="font-medium">{edu.degree}</p>
                              <p className="text-gray-400">{edu.institution}</p>
                              <p className="text-gray-400">{edu.startYear}-{edu.endYear || 'Present'}</p>
                            </div>
                          ))}
                        </div>
  
                        {application.applicantProfile?.experience?.map((exp, idx) => (
                          <div key={idx} className="mt-3">
                            <p className="font-medium text-sm">{exp.position}</p>
                            <p className="text-gray-400 text-xs">{exp.company}</p>
                            {exp.description && (
                              <p className="text-gray-400 text-xs mt-1">{exp.description}</p>
                            )}
                          </div>
                        ))}
                        
                        {application.applicantProfile?.resume && (
                          <div className="mt-3">
                            <a href={application.applicantProfile.resume} 
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-2 text-primary-400 text-sm">
                              <DocumentIcon className="w-4 h-4" />
                              View Full Resume/CV
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="w-full md:w-32 mt-2 md:mt-0">
                        <select
                          value={application.status}
                          onChange={(e) => handleStatusUpdate(application.applicationId, e.target.value)}
                          className={`text-sm input-field w-full ${
                            application.status === 'applied' ? 'bg-blue-600/20' :
                            application.status === 'reviewed' ? 'bg-purple-600/20' :
                            application.status === 'shortlisted' ? 'bg-green-600/20' :
                            'bg-red-600/20'
                          } rounded p-1 border border-transparent hover:border-gray-500`}
                        >
                          <option value="applied">Applied</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <span className="text-xs text-gray-400 block mt-1">
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

export default RecruiterDashboard;