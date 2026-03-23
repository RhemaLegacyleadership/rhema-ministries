import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BookOpen, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-image.jpeg";

const HeroSection = () => {
  const navigate = useNavigate();
  const admissionsYear = new Date().getFullYear();

  return (
    <section className="relative min-h-[100svh] md:min-h-screen bg-gradient-hero overflow-hidden">
      {/* Hero background image for desktop */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={heroImage}
          alt="Columbus Awung speaking"
          className="md:hidden absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 w-[120%] h-auto object-cover -scale-x-100 opacity-85"
          style={{
            maskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, black 42%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, black 42%, transparent 80%)",
          }}
        />
        <img 
          src={heroImage} 
          alt="Columbus Awung speaking" 
          className="hidden md:block absolute right-0 top-[42%] -translate-y-1/2 w-[78%] h-auto object-contain -scale-x-100 opacity-90"
          style={{
            maskImage: 'radial-gradient(ellipse 90% 80% at 60% 50%, black 40%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 60% 50%, black 40%, transparent 75%)',
          }}
        />
        {/* Gradient overlays for fade effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-burgundy-800 via-burgundy-800/82 md:via-burgundy-800/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-800 via-transparent to-burgundy-800/50" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-l from-burgundy-800/40 to-transparent" />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Decorative elements */}
      <div className="hidden md:block absolute top-20 right-10 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl" />
      <div className="hidden md:block absolute bottom-20 left-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 pt-24 pb-14 sm:pt-28 sm:pb-16 md:pt-32 md:pb-48 lg:pt-40 lg:pb-56 relative z-10">
        {/* Main Content - Centered */}
        <div className="max-w-3xl mx-auto lg:mx-0 text-left animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/10 border border-gold-400/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-gold-300 text-sm font-medium">{`Admissions Open for ${admissionsYear}`}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-gold-50 leading-tight mb-5 sm:mb-6">
            Train for{" "}
            <span className="text-gradient-gold">effective ministry</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gold-100/75 max-w-xl mb-7 sm:mb-8 leading-relaxed">
            Practical Bible training in flexible programs built for your calling.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start mb-8 sm:mb-10 md:mb-12">
            <Button variant="hero" size="xl" onClick={() => navigate("/register")}>
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => navigate("/programs/certificate")}>
              <Play className="w-5 h-5" />
              View Programs
            </Button>
          </div>

        </div>
      </div>

      {/* Program cards */}
      <div className="relative mt-2 md:mt-0 md:absolute md:bottom-20 md:left-0 md:right-0 z-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
            <ProgramCard 
              title="Certificate" 
              duration="6 Months"
              description="Ministry foundations"
              icon={BookOpen}
              delay="0s"
              href="/programs/certificate"
            />
            <ProgramCard 
              title="Diploma" 
              duration="1 Year"
              description="Advanced training"
              icon={Award}
              delay="0.1s"
              href="/programs/diploma"
            />
            <ProgramCard 
              title="Degree" 
              duration="4 Years"
              description="Full theological study"
              icon={Users}
              delay="0.2s"
              href="/programs/degree"
            />
            <ProgramCard 
              title="Masters" 
              duration="2 Years"
              description="Leadership excellence"
              icon={Award}
              delay="0.3s"
              href="/programs/masters"
            />
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(350, 30%, 98%)"/>
        </svg>
      </div>
    </section>
  );
};

const ProgramCard = ({ 
  title, 
  duration, 
  description,
  icon: Icon,
  delay, 
  href 
}: { 
  title: string; 
  duration: string; 
  description: string;
  icon: React.ElementType;
  delay: string; 
  href: string;
}) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-5 hover:from-white/25 hover:to-white/10 hover:border-gold-400/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-up shadow-lg hover:shadow-gold-500/20"
      style={{ animationDelay: delay }}
      onClick={() => navigate(href)}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-400/0 to-gold-600/0 group-hover:from-gold-400/10 group-hover:to-gold-600/5 transition-all duration-300" />
      
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
          <Icon className="w-5 h-5 text-burgundy-800" />
        </div>
        <h3 className="text-base md:text-lg font-serif font-bold text-gold-50 mb-1">{title}</h3>
        <p className="text-gold-400 text-xs font-semibold mb-1">{duration}</p>
        <p className="text-gold-100/60 text-xs">{description}</p>
      </div>
      
      {/* Arrow indicator */}
      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowRight className="w-3 h-3 text-gold-400" />
      </div>
    </div>
  );
};

export default HeroSection;
