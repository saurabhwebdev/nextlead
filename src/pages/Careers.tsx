import { useEffect, useState } from 'react';

const Careers = () => {
  useEffect(() => {
    document.title = 'Careers | NextLead';
  }, []);

  const [department, setDepartment] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      department: 'engineering',
      location: 'Remote (US)',
      type: 'Full-time',
      description: 'We\'re looking for an experienced Full Stack Developer to join our engineering team. You\'ll be responsible for developing and maintaining our core platform features.',
      requirements: [
        'At least 5 years of experience in full stack development',
        'Experience with React, TypeScript, and Node.js',
        'Experience with databases (PostgreSQL preferred)',
        'Strong problem-solving skills and attention to detail',
        'Good communication skills and ability to work in a team'
      ]
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      department: 'design',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'We\'re seeking a talented UX/UI Designer to create intuitive and engaging user experiences for our platform. You\'ll work closely with our product and engineering teams.',
      requirements: [
        '3+ years of experience in UX/UI design',
        'Proficiency in design tools (Figma, Adobe XD)',
        'Strong portfolio demonstrating UX process and solutions',
        'Experience designing for SaaS platforms',
        'Understanding of web accessibility standards'
      ]
    },
    {
      id: 3,
      title: 'Content Marketing Specialist',
      department: 'marketing',
      location: 'Remote (Worldwide)',
      type: 'Full-time',
      description: 'We\'re looking for a Content Marketing Specialist to create compelling content that drives lead generation and customer engagement.',
      requirements: [
        '2+ years of experience in content marketing',
        'Excellent writing and editing skills',
        'Experience with SEO and content strategy',
        'Familiarity with marketing automation tools',
        'Ability to translate technical concepts into clear, engaging content'
      ]
    },
    {
      id: 4,
      title: 'Customer Success Manager',
      department: 'customer_success',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'We\'re seeking a Customer Success Manager to ensure our customers get maximum value from our platform. You\'ll be their advocate and trusted advisor.',
      requirements: [
        '3+ years of experience in customer success or account management',
        'Experience with SaaS products',
        'Strong communication and relationship-building skills',
        'Problem-solving abilities and patience',
        'Data-driven approach to measuring customer health'
      ]
    },
    {
      id: 5,
      title: 'Data Scientist',
      department: 'engineering',
      location: 'Remote (US)',
      type: 'Full-time',
      description: 'We\'re looking for a Data Scientist to help us extract valuable insights from our data and improve our lead generation algorithms.',
      requirements: [
        'MS or PhD in Computer Science, Statistics, or related field',
        'Experience with machine learning and statistical modeling',
        'Proficiency in Python and data analysis libraries',
        'Experience with large datasets and data visualization',
        'Strong problem-solving and analytical skills'
      ]
    }
  ];

  const filteredJobs = department === 'all' 
    ? jobs 
    : jobs.filter(job => job.department === department);

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100" />
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80"
                alt="People working at desks"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-700 mix-blend-multiply" />
            </div>
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-white">Join Our Team</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-100 sm:max-w-3xl">
                Help us transform lead generation for businesses worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Culture section */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Culture</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why You'll Love Working Here
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              At NextLead, we believe in creating an environment where talented individuals can thrive, innovate, and grow.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Flexible Work Environment</h3>
                  <p className="mt-2 text-base text-gray-500">
                    We offer remote work opportunities and flexible schedules. We trust our team to work where and when they're most productive.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Competitive Benefits</h3>
                  <p className="mt-2 text-base text-gray-500">
                    We offer comprehensive health insurance, 401(k) matching, generous PTO, parental leave, and continuing education benefits.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Growth Opportunities</h3>
                  <p className="mt-2 text-base text-gray-500">
                    We're committed to helping our team members develop their skills and advance their careers through mentorship and learning resources.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Diverse & Inclusive Culture</h3>
                  <p className="mt-2 text-base text-gray-500">
                    We believe that diverse perspectives lead to better solutions. We're committed to creating an inclusive environment for all team members.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Open Positions</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Join Our Growing Team
            </p>
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setDepartment('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                department === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Departments
            </button>
            <button
              onClick={() => setDepartment('engineering')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                department === 'engineering'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Engineering
            </button>
            <button
              onClick={() => setDepartment('design')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                department === 'design'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Design
            </button>
            <button
              onClick={() => setDepartment('marketing')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                department === 'marketing'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Marketing
            </button>
            <button
              onClick={() => setDepartment('customer_success')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                department === 'customer_success'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Customer Success
            </button>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{job.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job.location}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job.type}
                    </span>
                  </div>
                  <p className="mt-3 text-base text-gray-500">{job.description}</p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-500">
                      {job.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6">
                    <a
                      href={`/apply/${job.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers; 