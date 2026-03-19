import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 lg:py-20 bg-gradient-burgundy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-400/10 mb-8">
            <GraduationCap className="w-10 h-10 text-gold-400" />
          </div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-gold-50 mb-6">
            Begin Your Transformation Today
          </h2>
          
          <p className="text-lg lg:text-xl text-gold-100/70 max-w-2xl mx-auto mb-10">
            Join hundreds of students who are being equipped for effective ministry. 
            Apply now and take the first step towards your calling.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" onClick={() => navigate("/register")}>
              Apply for Admission
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => navigate("/contact")}>
              Speak with Admissions
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-10 border-t border-gold-400/20">
            <p className="text-gold-200/60 text-sm mb-6">Trusted by ministries across Africa</p>
            <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-50">15+</p>
                <p className="text-gold-200/60 text-sm">Years of Excellence</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-50">1,000+</p>
                <p className="text-gold-200/60 text-sm">Graduates</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-50">20+</p>
                <p className="text-gold-200/60 text-sm">Countries Represented</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gold-50">95%</p>
                <p className="text-gold-200/60 text-sm">Student Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
