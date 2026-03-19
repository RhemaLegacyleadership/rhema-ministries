import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

const programs = [
  {
    title: "Certificate in Theology",
    duration: "6 Months",
    credits: 30,
    tuition: "60,000 frs CFA",
    description: "A foundational program for those beginning their ministry journey. Perfect for church workers and aspiring ministers.",
    features: ["Introduction to Theology", "Bible Study Methods", "Christian Leadership Basics", "Ministry Ethics"],
    href: "/programs/certificate",
    color: "from-emerald-500 to-teal-600"
  },
  {
    title: "Diploma in Theology and Ministry",
    duration: "6 Months",
    credits: 60,
    tuition: "180,000 frs CFA",
    description: "An intermediate program providing deeper theological understanding and practical ministry skills.",
    features: ["Advanced Biblical Studies", "Pastoral Care", "Church Administration", "Homiletics"],
    href: "/programs/diploma",
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Bachelor's Degree Program",
    duration: "18 Months",
    credits: 120,
    tuition: "600,000 frs CFA",
    description: "A comprehensive undergraduate program for serious students pursuing full-time ministry careers.",
    features: ["Mission/Evangelism", "Christian Education", "Pastoral Care", "Biblical Studies"],
    href: "/programs/degree",
    color: "from-purple-500 to-violet-600"
  },
  {
    title: "Master's Degree Program",
    duration: "15 Months",
    credits: 64,
    tuition: "640,000 frs CFA",
    description: "An advanced program for ministry leaders seeking expert-level knowledge and leadership skills.",
    features: ["Mission/Evangelism", "Christian Education", "Pastoral Care", "Biblical Studies"],
    href: "/programs/masters",
    color: "from-gold-500 to-amber-600"
  }
];

const ProgramsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-foreground mb-6">
            Our <span className="text-gradient-gold">Programs</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the program that best fits your calling and schedule. Each program is designed to transform your ministry potential.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {programs.map((program, index) => (
            <div 
              key={program.title}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header with gradient */}
              <div className={`h-3 bg-gradient-to-r ${program.color}`} />
              
              <div className="p-8">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-3">{program.title}</h3>
                
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
                  <p className="text-sm font-medium text-foreground mb-3">Key Courses:</p>
                  <div className="flex flex-wrap gap-2">
                    {program.features.map((feature) => (
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
