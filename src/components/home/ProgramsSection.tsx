import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

const programs = [
  {
    title: "Certificate",
    duration: "6 Months",
    credits: 30,
    tuition: "60,000 frs CFA",
    description: "Foundational Bible and ministry training.",
    highlights: ["Bible basics", "Leadership essentials"],
    href: "/programs/certificate",
    color: "from-emerald-500 to-teal-600"
  },
  {
    title: "Diploma",
    duration: "6 Months",
    credits: 60,
    tuition: "180,000 frs CFA",
    description: "Deeper theology and practical ministry skills.",
    highlights: ["Pastoral care", "Church systems"],
    href: "/programs/diploma",
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Degree",
    duration: "18 Months",
    credits: 120,
    tuition: "600,000 frs CFA",
    description: "Comprehensive training for full-time ministry.",
    highlights: ["Mission focus", "Biblical depth"],
    href: "/programs/degree",
    color: "from-purple-500 to-violet-600"
  },
  {
    title: "Masters",
    duration: "15 Months",
    credits: 64,
    tuition: "640,000 frs CFA",
    description: "Advanced leadership and ministry formation.",
    highlights: ["Strategic leadership", "Advanced theology"],
    href: "/programs/masters",
    color: "from-gold-500 to-amber-600"
  }
];

const ProgramsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-foreground mb-4">
            Explore our <span className="text-gradient-gold">Programs</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Four clear pathways built for ministry growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {programs.map((program, index) => (
            <div 
              key={program.title}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header with gradient */}
              <div className={`h-3 bg-gradient-to-r ${program.color}`} />
              
              <div className="p-5 sm:p-6 lg:p-7">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground">{program.title}</h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    {program.tuition}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 text-gold-500" />
                    <span className="text-sm">{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="w-4 h-4 text-gold-500" />
                    <span className="text-sm">{program.credits} Credits</span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6">{program.description}</p>

                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">Highlights</p>
                  <div className="flex flex-wrap gap-2">
                    {program.highlights.map((feature) => (
                      <span key={feature} className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  onClick={() => navigate(program.href)}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
