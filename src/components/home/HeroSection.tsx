import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpeg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-burgundy-900">
      {/* Full-bleed visual plane */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Rhema Fits Bible College — ministry training in Cameroon"
          className="h-full w-full object-cover object-[68%_center] md:object-[72%_center] scale-105 animate-ken-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-burgundy-950/95 via-burgundy-900/78 to-burgundy-900/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-transparent to-burgundy-950/45" />
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-[100svh] items-end md:items-center">
        <div className="container mx-auto px-4 sm:px-6 pb-16 pt-28 sm:pb-20 md:py-32 lg:py-40">
          <div className="max-w-2xl animate-fade-up">
            <p className="font-display text-sm sm:text-base font-semibold tracking-[0.28em] uppercase text-gold-400 mb-5 sm:mb-6">
              Rhema Fits Bible College
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-semibold text-gold-50 leading-[1.08] mb-5 sm:mb-6">
              Train for effective{" "}
              <span className="italic text-gradient-gold">ministry</span>
            </h1>

            <p className="text-base sm:text-lg text-gold-100/75 max-w-lg leading-relaxed mb-8 sm:mb-10">
              Practical Bible training in flexible programs built for your calling.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-up"
              style={{ animationDelay: "0.15s", opacity: 0, animationFillMode: "forwards" }}
            >
              <Button variant="hero" size="xl" onClick={() => navigate("/register")}>
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="xl" onClick={() => navigate("/programs/certificate")}>
                View Programs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Soft edge into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(28,28%,97%)] to-transparent" />
    </section>
  );
};

export default HeroSection;
