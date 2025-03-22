import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockApi } from '../config/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function ProfileForm() {
    const { user, setUser } = useAuth() || {};
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        bio: '',
        skills: [],
        education: [],
        workExperience: [],
        resume: '',
        companyName: '',
        companyWebsite: '',
        companyDescription: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                let profileData = user;
                
                // First check localStorage before API call
                if (!profileData) {
                    const localUser = localStorage.getItem('user');
                    if (localUser) {
                        profileData = JSON.parse(localUser);
                    } else {
                        const response = await mockApi.getProfile();
                        profileData = response.data.data; // Add .data to match API nesting
                    }
                }

                // Format data for form
                if (profileData) {
                    // In the useEffect's setFormData
                    setFormData({
                        name: profileData.name || '',
                        phone: profileData.phone || '',
                        bio: profileData.bio || '',
                        skills: profileData.skills?.join(', ') || '',  // Convert array to string
                        education: profileData.education?.map(edu => ({
                            institution: edu.institution || '',
                            degree: edu.degree || '',
                            startYear: edu.startYear?.toString() || '',  // Convert numbers to strings
                            endYear: edu.endYear?.toString() || ''
                        })) || [],
                        workExperience: profileData.workExperience?.map(exp => ({
                            company: exp.company || '',
                            position: exp.position || '',
                            startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
                            endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
                            description: exp.description || ''
                        })) || [],
                        resume: profileData.resume || '',
                        companyName: profileData.companyName || '',
                        companyWebsite: profileData.companyWebsite || '',
                        companyDescription: profileData.companyDescription || ''
                    });
                    
                    // Update context if available
                    if (typeof setUser === 'function') {
                        setUser(profileData);
                    }
                }
            } catch (error) {
                toast.error('Failed to load profile data');
                console.error('Profile fetch error:', error);
            }
        };

        fetchProfile();
    }, [user, setUser]);

    const handleArrayUpdate = (field, index, key, value) => {
        const updated = [...formData[field]];
        updated[index][key] = value;
        setFormData(prev => ({ ...prev, [field]: updated }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                education: formData.education.map(edu => ({
                    ...edu,
                    startYear: Number(edu.startYear),
                    endYear: Number(edu.endYear)
                }))
            };

            const updatedUser = await mockApi.updateProfile(payload);
            const freshUserData = updatedUser.data.data; // Access nested data

            // Update both context and localStorage
            if (typeof setUser === 'function') {
                setUser(freshUserData);
            }
            localStorage.setItem('user', JSON.stringify(freshUserData));

            // Temporary solution until AuthContext is fixed
            if (typeof setUser === 'function') {
                setUser(updatedUser);
            } else {
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.location.reload(); // Force refresh to update user state
            }

            toast.success('Profile updated successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
            console.error('Profile Update Error:', {
                error,
                formData,
                userRole: user?.role
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-primary-500">
                Manage Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                {/* Common Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Full Name</label>
                        <input
                            className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-primary-500"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Phone</label>
                        <input
                            className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-primary-500"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            type="tel"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Bio</label>
                    <textarea
                        className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-primary-500 h-32"
                        value={formData.bio}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Describe your professional background..."
                    />
                </div>

                {user?.role === 'applicant' && (
                    <>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Skills (comma separated)</label>
                            <input
                                className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-primary-500"
                                value={formData.skills}
                                onChange={e => setFormData({ ...formData, skills: e.target.value })}
                                placeholder="React, Node.js, Python..."
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-100">Education</h3>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        education: [...prev.education, { institution: '', degree: '', startYear: '', endYear: '' }]
                                    }))}
                                    className="btn-primary py-2 px-4 text-sm"
                                >
                                    Add Education
                                </button>
                            </div>

                            {formData.education.map((edu, index) => (
                                <div key={index} className="space-y-4 p-4 bg-gray-700 rounded-lg">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Institution *</label>
                                            <input
                                                className="w-full px-4 py-2 bg-gray-600 rounded-md text-white focus:ring-primary-500"
                                                value={edu.institution}
                                                onChange={e => handleArrayUpdate('education', index, 'institution', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Degree *</label>
                                            <input
                                                className="w-full px-4 py-2 bg-gray-600 rounded-md text-white focus:ring-primary-500"
                                                value={edu.degree}
                                                onChange={e => handleArrayUpdate('education', index, 'degree', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Start Year</label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2 bg-gray-600 rounded-md text-white focus:ring-primary-500"
                                                value={edu.startYear}
                                                onChange={e => handleArrayUpdate('education', index, 'startYear', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">End Year</label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2 bg-gray-600 rounded-md text-white focus:ring-primary-500"
                                                value={edu.endYear}
                                                onChange={e => handleArrayUpdate('education', index, 'endYear', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Resume URL Field - Moved inside applicant section */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Resume URL</label>
                            <input
                                className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:ring-primary-500"
                                value={formData.resume}
                                onChange={e => setFormData({...formData, resume: e.target.value})}
                                type="url"
                                placeholder="https://drive.google.com/your-resume-link"
                                required
                            />
                        </div>

                        {/* Work Experience Section - Fixed placement */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-100">Work Experience</h3>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        workExperience: [...prev.workExperience, { 
                                            company: '', 
                                            position: '', 
                                            startDate: '', 
                                            endDate: '', 
                                            description: '' 
                                        }]
                                    }))}
                                    className="btn-primary py-2 px-4 text-sm"
                                >
                                    Add Experience
                                </button>
                            </div>
                            
                            {formData.workExperience.map((exp, index) => (
                                <div key={index} className="space-y-4 p-4 bg-gray-700 rounded-lg">  {/* Changed from bg-gray-800 to match education section */}
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Company *</label>
                                            <input
                                                className="w-full px-4 py-2 bg-gray-600 rounded-md text-white focus:ring-primary-500"
                                                value={exp.company}
                                                onChange={e => handleArrayUpdate('workExperience', index, 'company', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Position *</label>
                                            <input
                                                className="w-full px-4 py-2 bg-gray-600 rounded-md text-white focus:ring-primary-500"
                                                value={exp.position}
                                                onChange={e => handleArrayUpdate('workExperience', index, 'position', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Start Date</label>
                                            <input
                                                type="date"
                                                className="w-full px-4 py-2 bg-gray-600 rounded-md text-white focus:ring-primary-500"
                                                value={exp.startDate}
                                                onChange={e => handleArrayUpdate('workExperience', index, 'startDate', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-300">End Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full px-4 py-2 bg-gray-600 rounded-md text-white focus:ring-primary-500"
                                                    value={exp.endDate}
                                                    onChange={e => handleArrayUpdate('workExperience', index, 'endDate', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Description</label>
                                            <textarea
                                                className="w-full px-4 py-2 bg-gray-600 rounded-md text-white focus:ring-primary-500"
                                                value={exp.description}
                                                onChange={e => handleArrayUpdate('workExperience', index, 'description', e.target.value)}
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Recruiter Section - Fixed proper closing */}
                {user?.role === 'recruiter' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-100">Company Information</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Company Name *</label>
                                <input
                                    className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:ring-primary-500"
                                    value={formData.companyName}
                                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Company Website</label>
                                <input
                                    className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:ring-primary-500"
                                    type="url"
                                    value={formData.companyWebsite}
                                    onChange={e => setFormData({ ...formData, companyWebsite: e.target.value })}
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300">Company Description</label>
                            <textarea
                                className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:ring-primary-500 h-32"
                                value={formData.companyDescription}
                                onChange={e => setFormData({ ...formData, companyDescription: e.target.value })}
                                placeholder="Describe your company..."
                            />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 rounded-md transition-all"
                >
                    Save Profile
                </button>
            </form>
        </div>
    );
}

export default ProfileForm;