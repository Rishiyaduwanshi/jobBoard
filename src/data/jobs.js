export const jobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp",
    location: "Remote",
    salary: "$120,000 - $150,000",
    type: "Full-time",
    experience: "5+ years",
    description: "We are looking for a Senior React Developer to join our team...",
    requirements: [
      "5+ years of experience with React.js",
      "Strong understanding of state management",
      "Experience with modern JavaScript features",
    ],
    postedDate: "2024-03-15",
    recruiterId: "rec123"
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "InnovateSoft",
    location: "New York, NY",
    salary: "$100,000 - $130,000",
    type: "Full-time",
    experience: "3+ years",
    description: "Looking for a Full Stack Developer with experience in React and Node.js...",
    requirements: [
      "3+ years of full stack development",
      "Experience with React.js and Node.js",
      "Database design and optimization",
    ],
    postedDate: "2024-03-14",
    recruiterId: "rec124"
  }
];

export const users = [
  {
    id: "user123",
    name: "John Doe",
    email: "john@example.com",
    password: "hashedPassword123",
    role: "applicant",
    applications: [1],
    savedJobs: [2],
    resume: "path/to/resume.pdf",
    experience: "5 years",
    skills: ["React", "JavaScript", "Node.js"]
  },
  {
    id: "rec123",
    name: "Jane Smith",
    email: "jane@techcorp.com",
    password: "hashedPassword456",
    role: "recruiter",
    company: "TechCorp",
    postedJobs: [1],
    companyInfo: {
      name: "TechCorp",
      description: "Leading technology solutions provider",
      website: "https://techcorp.com"
    }
  }
];