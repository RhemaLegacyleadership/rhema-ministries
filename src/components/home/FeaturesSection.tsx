import { BookOpen, Video, Users, Shield } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Clear Curriculum",
    description: "Bible, theology, and leadership in one structured path."
  },
  {
    icon: Video,
    title: "Online Friendly",
    description: "Learn live or catch up with recordings from anywhere."
  },
  {
    icon: Users,
    title: "Experienced Mentors",
    description: "Be guided by trusted pastors and ministry leaders."
  },
  {
    icon: Shield,
    title: "Supportive Community",
    description: "Admissions and student support from start to graduation."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-foreground mb-4">
            Why students choose <span className="text-gradient-gold">Rhema Fits</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Simple, focused formation for real ministry impact.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-5 sm:p-6 lg:p-7 rounded-2xl bg-card border border-border hover:border-gold-400/50 hover:shadow-lg transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-burgundy-600 to-burgundy-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <feature.icon className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
