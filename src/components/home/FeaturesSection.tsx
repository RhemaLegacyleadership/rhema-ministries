import { BookOpen, Video, Users, Award, Clock, Shield } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum",
    description: "Carefully designed courses covering theology, ministry, and practical leadership skills."
  },
  {
    icon: Video,
    title: "Online Classes",
    description: "Attend live classes from anywhere in the world with our modern virtual classroom."
  },
  {
    icon: Users,
    title: "Expert Faculty",
    description: "Learn from experienced ministers and educators with decades of ministry experience."
  },
  {
    icon: Award,
    title: "Accredited Programs",
    description: "Earn recognized certificates, diplomas, degrees, and masters credentials."
  },
  {
    icon: Clock,
    title: "Flexible Learning",
    description: "Study at your own pace with recorded lectures and downloadable resources."
  },
  {
    icon: Shield,
    title: "Student Support",
    description: "Dedicated support team to help you throughout your educational journey."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-12 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-foreground mb-6">
            Why Choose <span className="text-gradient-gold">Rhema Fits</span>?
          </h2>
          <p className="text-lg text-muted-foreground">
            We provide a transformative educational experience that prepares you for effective ministry and leadership.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-gold-400/50 hover:shadow-lg transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-burgundy-600 to-burgundy-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-gold-400" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
