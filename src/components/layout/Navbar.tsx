import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const programs = [
    { name: "Certificate Programs", href: "/programs/certificate" },
    { name: "Diploma Programs", href: "/programs/diploma" },
    { name: "Degree Programs", href: "/programs/degree" },
    { name: "Masters Programs", href: "/programs/masters" },
  ];

  const linkClass =
    "text-gold-50/85 hover:text-gold-300 transition-colors font-medium text-sm tracking-wide";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "bg-burgundy-950/95 backdrop-blur-md border-b border-burgundy-700/60 shadow-soft"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-[72px] lg:h-20">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <img
              src={rhemaLogo}
              alt="Rhema Fits Bible College"
              className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div>
              <p className="font-display text-sm sm:text-base lg:text-lg font-semibold tracking-[0.12em] text-gold-400 uppercase leading-none">
                Rhema Fits
              </p>
              <p className="font-display text-[9px] sm:text-[10px] font-medium text-gold-200/80 tracking-[0.28em] sm:tracking-[0.32em] uppercase mt-1">
                Bible College
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            <Link to="/" className={linkClass}>
              Home
            </Link>
            <Link to="/about" className={linkClass}>
              About
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 ${linkClass}`}>
                Programs <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-burgundy-900 border-burgundy-700 min-w-[12rem]">
                {programs.map((program) => (
                  <DropdownMenuItem key={program.name} asChild>
                    <Link
                      to={program.href}
                      className="text-gold-50/90 hover:text-gold-300 focus:text-gold-300 hover:bg-burgundy-800 cursor-pointer"
                    >
                      {program.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/faq" className={linkClass}>
              FAQs
            </Link>
            <Link to="/contact" className={linkClass}>
              Contact
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-gold-50/90 hover:text-gold-300 hover:bg-white/5"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button variant="hero" onClick={() => navigate("/register")}>
              Apply Now
            </Button>
          </div>

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="lg:hidden p-2 rounded-md text-gold-50 hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden pb-6 animate-fade-in">
            <div className="flex flex-col gap-1 pt-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-gold-50/90 hover:text-gold-300 py-2.5 px-2 rounded-md hover:bg-white/5"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="py-3 px-2">
                <p className="text-gold-400 font-display text-xs tracking-[0.2em] uppercase mb-2">
                  Programs
                </p>
                <div className="flex flex-col gap-1 pl-1 border-l border-gold-500/30">
                  {programs.map((program) => (
                    <Link
                      key={program.name}
                      to={program.href}
                      className="text-gold-50/80 hover:text-gold-300 py-1.5 pl-3"
                      onClick={() => setIsOpen(false)}
                    >
                      {program.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/faq"
                className="text-gold-50/90 hover:text-gold-300 py-2.5 px-2 rounded-md hover:bg-white/5"
                onClick={() => setIsOpen(false)}
              >
                FAQs
              </Link>
              <Link
                to="/contact"
                className="text-gold-50/90 hover:text-gold-300 py-2.5 px-2 rounded-md hover:bg-white/5"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-burgundy-700/80">
                <Button
                  variant="ghost"
                  className="text-gold-50 hover:bg-white/5 justify-center"
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="hero"
                  className="justify-center"
                  onClick={() => {
                    navigate("/register");
                    setIsOpen(false);
                  }}
                >
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
