import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 lg:py-24 bg-gradient-burgundy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-gold-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-400/10 mb-6">
            <GraduationCap className="w-8 h-8 text-gold-400" />
          </div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-gold-50 mb-4">
            Ready to begin?
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gold-100/75 max-w-2xl mx-auto mb-8">
            Apply today and start your next step in ministry leadership.
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

          <div className="mt-12 pt-8 border-t border-gold-400/20">
            <div className="flex flex-wrap justify-center gap-8 lg:gap-14">
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-50">15+</p>
                <p className="text-gold-200/60 text-sm">Years</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-50">1,000+</p>
                <p className="text-gold-200/60 text-sm">Graduates</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-50">95%</p>
                <p className="text-gold-200/60 text-sm">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
