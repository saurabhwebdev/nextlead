import { useEffect } from 'react';

const About = () => {
  useEffect(() => {
    document.title = 'About Us | NextLead';
  }, []);

  const team = [
    {
      name: 'Jane Smith',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      bio: 'Jane has over 15 years of experience in lead generation and digital marketing. She founded NextLead to help businesses grow through smarter lead generation.'
    },
    {
      name: 'Michael Johnson',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      bio: 'Michael brings 12 years of software engineering experience to the team, with a focus on AI and machine learning applications for marketing technology.'
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      bio: 'Sarah has led product teams at several successful SaaS companies. She\'s passionate about building tools that make complex tasks simple and accessible.'
    },
    {
      name: 'David Kim',
      role: 'Head of Customer Success',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      bio: 'David ensures our customers get the most value from our platform. With a background in sales and customer success, he\'s dedicated to customer satisfaction.'
    }
  ];

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
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
                alt="People working on laptops"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-700 mix-blend-multiply" />
            </div>
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-white">About NextLead</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-100 sm:max-w-3xl">
                We're on a mission to transform lead generation for businesses of all sizes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission section */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Mission
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                At NextLead, we believe that lead generation shouldn't be a mystery. Our mission is to make high-quality lead generation accessible to businesses of all sizes by leveraging the latest in AI technology and advanced data analytics.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                We're committed to transparency, quality, and delivering exceptional value to our customers. Our platform is designed to save you time and resources while connecting you with leads that truly matter to your business.
              </p>
            </div>
            <div className="mt-12 lg:mt-0">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Story
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Founded in 2020, NextLead was born out of frustration with the status quo in lead generation. Our founder, Jane Smith, experienced firsthand the challenges of finding quality leads while running her previous business.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                After trying numerous solutions that promised the world but delivered poor results, Jane assembled a team of marketing and technology experts to build the tool she wished she had. Today, NextLead helps thousands of businesses around the world connect with their ideal customers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
              These core principles guide everything we do at NextLead
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Quality Over Quantity</h3>
                <p className="mt-2 text-base text-gray-500">
                  We believe that one qualified lead is worth more than a hundred unqualified contacts. Our algorithms are designed to prioritize quality matches for your business.
                </p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Transparency</h3>
                <p className="mt-2 text-base text-gray-500">
                  We're open about how our platform works, where our data comes from, and how we measure success. No black boxes or hidden methodologies.
                </p>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Continuous Innovation</h3>
                <p className="mt-2 text-base text-gray-500">
                  The digital landscape never stops evolving, and neither do we. We're constantly improving our technology to stay ahead of the curve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 text-center sm:px-6 lg:px-8 lg:py-24">
          <div className="space-y-12">
            <div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Meet Our Team</h2>
              <p className="text-xl text-gray-500">
                The talented people behind NextLead who are passionate about helping your business grow
              </p>
            </div>
            <ul
              className="mx-auto space-y-16 sm:grid sm:grid-cols-2 sm:gap-16 sm:space-y-0 lg:grid-cols-4 lg:max-w-5xl"
            >
              {team.map((person) => (
                <li key={person.name}>
                  <div className="space-y-6">
                    <img className="mx-auto h-40 w-40 rounded-full xl:w-56 xl:h-56" src={person.image} alt="" />
                    <div className="space-y-2">
                      <div className="text-lg leading-6 font-medium space-y-1">
                        <h3>{person.name}</h3>
                        <p className="text-indigo-600">{person.role}</p>
                      </div>
                      <div className="text-lg">
                        <p className="text-gray-500">{person.bio}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 