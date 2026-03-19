import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import rhemaLogo from "@/assets/rhema-logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const programs = [
    { name: "Certificate Programs", href: "/programs/certificate" },
    { name: "Diploma Programs", href: "/programs/diploma" },
    { name: "Degree Programs", href: "/programs/degree" },
    { name: "Masters Programs", href: "/programs/masters" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-burgundy-800 shadow-lg border-b border-burgundy-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={rhemaLogo} 
              alt="Rhema Fits Bible College" 
              className="w-12 h-12 lg:w-14 lg:h-14 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-display font-bold tracking-wider text-gold-400 drop-shadow-sm uppercase">
                Rhema Fits
              </h1>
              <p className="text-xs font-display font-bold text-gold-200 tracking-[0.35em] uppercase ml-1">Bible College</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-gold-50/90 hover:text-gold-400 transition-colors font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gold-50/90 hover:text-gold-400 transition-colors font-medium">
              About
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-gold-50/90 hover:text-gold-400 transition-colors font-medium">
                Programs <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-burgundy-700 border-burgundy-600">
                {programs.map((program) => (
                  <DropdownMenuItem key={program.name} asChild>
                    <Link to={program.href} className="text-gold-50/90 hover:text-gold-400 hover:bg-burgundy-600 cursor-pointer">
                      {program.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/faq" className="text-gold-50/90 hover:text-gold-400 transition-colors font-medium">
              FAQs
            </Link>
            <Link to="/contact" className="text-gold-50/90 hover:text-gold-400 transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" className="text-gold-50/90 hover:text-gold-400 hover:bg-burgundy-600" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button variant="hero" onClick={() => navigate("/register")}>
              Apply Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gold-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-6 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-gold-50/90 hover:text-gold-400 py-2" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link to="/about" className="text-gold-50/90 hover:text-gold-400 py-2" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <div className="py-2">
                <p className="text-gold-400 font-medium mb-2">Programs</p>
                <div className="pl-4 flex flex-col gap-2">
                  {programs.map((program) => (
                    <Link key={program.name} to={program.href} className="text-gold-50/70 hover:text-gold-400" onClick={() => setIsOpen(false)}>
                      {program.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/faq" className="text-gold-50/90 hover:text-gold-400 py-2" onClick={() => setIsOpen(false)}>
                FAQs
              </Link>
              <Link to="/contact" className="text-gold-50/90 hover:text-gold-400 py-2" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
              <div className="flex flex-col gap-3 pt-4 border-t border-burgundy-600">
                <Button variant="ghost" className="text-gold-50 hover:bg-burgundy-600 justify-center" onClick={() => { navigate("/login"); setIsOpen(false); }}>
                  Login
                </Button>
                <Button variant="hero" className="justify-center" onClick={() => { navigate("/register"); setIsOpen(false); }}>
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
