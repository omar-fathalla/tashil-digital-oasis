
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-50 border-t border-border">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* First column */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">تسهيل Platform</h3>
            <p className="text-gray-600 mb-4">
              Transforming administrative procedures through digital innovation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Second column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-primary">Services</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary">FAQs</Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-600 hover:text-primary">Support Center</Link>
              </li>
            </ul>
          </div>

          {/* Third column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-gray-600 hover:text-primary">Employee Registration</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-primary">Document Management</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-primary">Digital ID Issuance</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-primary">Reporting Tools</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-primary">Technical Support</Link>
              </li>
            </ul>
          </div>

          {/* Fourth column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-600">123 Digital Avenue, Smart City, 54321</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-600">+1 234 567 8900</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-600">support@tashil.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Tashil Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
