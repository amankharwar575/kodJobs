import { Link } from 'react-router-dom';
import { FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full">
      {/* Main footer with blue background */}
      <div className="bg-blue-500 py-16 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and social media section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-white text-2xl font-bold">KodnextJob</h2>
              </div>
              
              <div className="pt-4">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-white font-medium mb-2">Follow us</h3>
                  <div className="flex space-x-4">
                    <a href="https://www.linkedin.com/company/kodnestoffice/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200">
                      <FaLinkedin size={24} />
                    </a>
                    <a href="https://www.instagram.com/kodnest/?hl=en" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200">
                      <FaInstagram size={24} />
                    </a>
                    <a href="https://www.facebook.com/kodnest/photos/?_rdr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200">
                      <FaFacebook size={24} />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Certification badge */}
              <div className="pt-4">
                <div className="text-white text-sm">Certified</div>
                <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">B</span>
                </div>
                <div className="text-white text-sm">Corporation</div>
              </div>
            </div>

            {/* Why KodnextJob */}
            <div>
              <h3 className="text-white font-medium mb-4">Why KodnextJob</h3>
              <ul className="space-y-2">
                <li><Link to="/time" className="text-white hover:text-blue-200">Time</Link></li>
                <li><Link to="/compliance" className="text-white hover:text-blue-200">Compliance</Link></li>
                <li><Link to="/diversity" className="text-white hover:text-blue-200">Diversity & inclusion</Link></li>
                <li><Link to="/features" className="text-white hover:text-blue-200">All features</Link></li>
              </ul>
            </div>

            {/* Built for */}
            <div>
              <h3 className="text-white font-medium mb-4">Built for</h3>
              <ul className="space-y-2">
                <li><Link to="/startups" className="text-white hover:text-blue-200">Start-ups</Link></li>
                <li><Link to="/growing-businesses" className="text-white hover:text-blue-200">Growing businesses</Link></li>
                <li><Link to="/established-businesses" className="text-white hover:text-blue-200">Established businesses</Link></li>
              </ul>
            </div>

            {/* Solution and Company */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-white font-medium mb-4">Solution</h3>
                <ul className="space-y-2">
                  <li><Link to="/attract-talent" className="text-white hover:text-blue-200">Attract talent</Link></li>
                  <li><Link to="/assess-talent" className="text-white hover:text-blue-200">Assess talent</Link></li>
                  <li><Link to="/simplify-hiring" className="text-white hover:text-blue-200">Simplify hiring</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="/pricing" className="text-white hover:text-blue-200">Pricing</Link></li>
                  <li><Link to="/learning" className="text-white hover:text-blue-200">Learning</Link></li>
                  <li><Link to="/careers" className="text-white hover:text-blue-200">Careers</Link></li>
                  <li><Link to="/about" className="text-white hover:text-blue-200">About</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark blue bottom footer */}
      <div className="bg-blue-900 py-8 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Contact information */}
            <div>
              <h3 className="text-white font-medium mb-4">Phone us</h3>
              <p className="text-white">08095000123</p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Email us</h3>
              <p className="text-white">hello@kodnextjob.com</p>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Find us</h3>
              <p className="text-white">4th & 5th Floor, CPR Tower, above Reliance Fresh, Vysya Bank Colony, Stage 2, BTM Layout, Bengaluru, Karnataka 560076</p>
            </div>
            
            <div className="flex items-end justify-end">
              <p className="text-white">KodnextJob 2025</p>
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-blue-800 my-8"></div>
          
          {/* Footer links */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-8">
              <Link to="/terms" className="text-white hover:text-blue-200">Terms & conditions</Link>
              <Link to="/privacy" className="text-white hover:text-blue-200">Privacy</Link>
              <Link to="/cookies" className="text-white hover:text-blue-200">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 