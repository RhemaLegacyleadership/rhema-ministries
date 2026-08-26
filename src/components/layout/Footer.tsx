import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import rhemaLogo from "@/assets/rhema-logo.png";

const Footer = () => {
  return (
    <footer className="bg-burgundy-950 text-gold-50">
      <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img
                src={rhemaLogo}
                alt="Rhema Fits Bible College"
                className="w-12 h-12 object-contain"
              />
              <div>
                <p className="font-display text-base font-semibold tracking-[0.12em] text-gold-400 uppercase">
                  Rhema Fits
                </p>
                <p className="font-display text-[10px] font-medium text-gold-200/80 tracking-[0.28em] uppercase mt-0.5">
                  Bible College
                </p>
              </div>
            </div>
            <p className="text-gold-100/65 leading-relaxed mb-6 max-w-xs italic font-serif text-lg">
              “Taking you from where you are to where you should be”
            </p>
            <div className="flex gap-2.5">
              {[Facebook, Twitter, Youtube, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-9 h-9 rounded-md bg-burgundy-900 hover:bg-gold-500 hover:text-burgundy-950 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-xs tracking-[0.2em] uppercase text-gold-400 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/about", label: "About Us" },
                { to: "/programs/certificate", label: "Programs" },
                { to: "/faq", label: "FAQs" },
                { to: "/register", label: "Admissions" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gold-100/65 hover:text-gold-300 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs tracking-[0.2em] uppercase text-gold-400 mb-5">
              Programs
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/programs/certificate", label: "Certificate" },
                { to: "/programs/diploma", label: "Diploma" },
                { to: "/programs/degree", label: "Degree" },
                { to: "/programs/masters", label: "Masters" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gold-100/65 hover:text-gold-300 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xs tracking-[0.2em] uppercase text-gold-400 mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
                <span className="text-gold-100/65 text-sm">Cameroon, Central Africa</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="text-gold-100/65 text-sm">+237 679 286 428</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="text-gold-100/65 text-sm break-all">
                  support@rhemafitsministries.com
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-burgundy-800/80">
        <div className="container mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gold-100/40 text-sm">
              © {new Date().getFullYear()} Rhema Fits Ministries. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="text-gold-100/40 hover:text-gold-300 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gold-100/40 hover:text-gold-300 text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
