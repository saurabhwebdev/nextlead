import { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    document.title = 'Terms of Service | NextLead';
  }, []);

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
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
                alt="Contract document with signature"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 to-indigo-700 mix-blend-multiply" />
            </div>
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-white">Terms of Service</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-100 sm:max-w-3xl">
                Guidelines for using our services
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-indigo max-w-none">
          <p className="text-lg text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to NextLead. By accessing our website at nextlead.com, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>
          <p className="mt-2">
            If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on NextLead's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-5 mt-2 mb-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial)</li>
            <li>Attempt to decompile or reverse engineer any software contained on NextLead's website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">3. Disclaimer</h2>
          <p>
            The materials on NextLead's website are provided on an 'as is' basis. NextLead makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p className="mt-2">
            Further, NextLead does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">4. Limitations</h2>
          <p>
            In no event shall NextLead or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NextLead's website, even if NextLead or a NextLead authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">5. Accuracy of Materials</h2>
          <p>
            The materials appearing on NextLead's website could include technical, typographical, or photographic errors. NextLead does not warrant that any of the materials on its website are accurate, complete or current. NextLead may make changes to the materials contained on its website at any time without notice. However NextLead does not make any commitment to update the materials.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">6. Links</h2>
          <p>
            NextLead has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by NextLead of the site. Use of any such linked website is at the user's own risk.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">7. Modifications</h2>
          <p>
            NextLead may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms; 