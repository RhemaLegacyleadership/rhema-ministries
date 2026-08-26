import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-burgundy py-20 lg:py-28">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-wine-400/25 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-up">
          <p className="font-display text-xs tracking-[0.22em] uppercase text-gold-400 mb-4">
            Admissions
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-gold-50 mb-5">
            Ready to begin?
          </h2>
          <p className="text-base sm:text-lg text-gold-100/75 max-w-xl mx-auto mb-9 leading-relaxed">
            Apply today and take the next step in ministry leadership with Rhema Fits.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button variant="hero" size="xl" onClick={() => navigate("/register")}>
              Apply for Admission
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => navigate("/contact")}>
              Talk to Admissions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
