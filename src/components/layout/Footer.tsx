import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import rhemaLogo from "@/assets/rhema-logo.png";

const Footer = () => {
  return (
    <footer className="bg-burgundy-800 text-gold-50">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={rhemaLogo} 
                alt="Rhema Fits Bible College" 
                className="w-14 h-14 object-contain"
              />
              <div>
                <h3 className="text-xl font-display font-bold tracking-wider text-gold-400 uppercase">Rhema Fits</h3>
                <p className="text-xs font-display font-bold text-gold-200 tracking-[0.35em] uppercase ml-1">Bible College</p>
              </div>
            </div>
            <p className="text-gold-100/70 text-sm leading-relaxed mb-6">
              "Taking you from where you are to where you should be"
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-burgundy-700 hover:bg-gold-500 hover:text-burgundy-800 flex items-center justify-center transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-burgundy-700 hover:bg-gold-500 hover:text-burgundy-800 flex items-center justify-center transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-burgundy-700 hover:bg-gold-500 hover:text-burgundy-800 flex items-center justify-center transition-all">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-burgundy-700 hover:bg-gold-500 hover:text-burgundy-800 flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-6 text-gold-400">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gold-100/70 hover:text-gold-400 transition-colors">About Us</Link></li>
              <li><Link to="/programs/certificate" className="text-gold-100/70 hover:text-gold-400 transition-colors">Programs</Link></li>
              <li><Link to="/faq" className="text-gold-100/70 hover:text-gold-400 transition-colors">FAQs</Link></li>
              <li><Link to="/register" className="text-gold-100/70 hover:text-gold-400 transition-colors">Admissions</Link></li>
              <li><Link to="/contact" className="text-gold-100/70 hover:text-gold-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-6 text-gold-400">Programs</h4>
            <ul className="space-y-3">
              <li><Link to="/programs/certificate" className="text-gold-100/70 hover:text-gold-400 transition-colors">Certificate</Link></li>
              <li><Link to="/programs/diploma" className="text-gold-100/70 hover:text-gold-400 transition-colors">Diploma</Link></li>
              <li><Link to="/programs/degree" className="text-gold-100/70 hover:text-gold-400 transition-colors">Degree</Link></li>
              <li><Link to="/programs/masters" className="text-gold-100/70 hover:text-gold-400 transition-colors">Masters</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-6 text-gold-400">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-gold-100/70 text-sm">Cameroon, Central Africa</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span className="text-gold-100/70 text-sm">+237 679 286 428</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-400 flex-shrink-0" />
                <span className="text-gold-100/70 text-sm break-all">support@rhemafitsministries.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-burgundy-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gold-100/50 text-sm">
              © {new Date().getFullYear()} Rhema Fits Ministries. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-gold-100/50 hover:text-gold-400 text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gold-100/50 hover:text-gold-400 text-sm transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
