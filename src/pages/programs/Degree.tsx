import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Clock, 
  MapPin, 
  BookOpen, 
  DollarSign, 
  FileCheck,
  ArrowRight
} from "lucide-react";

const DegreeProgram = () => {
  const navigate = useNavigate();

  const programDetails = [
    {
      icon: FileCheck,
      title: "Admission Requirements",
      content: [
        "Must be born again",
        "Diploma in Theology or A-Level GCE",
        "Provide recommendation from a pastor or someone who knows you for at least 2 years"
      ]
    },
    {
      icon: DollarSign,
      title: "Registration Fees",
      content: ["10,000 frs CFA (≈ $17.6 USD)"]
    },
    {
      icon: Clock,
      title: "Duration of Program",
      content: ["18 Months"]
    },
    {
      icon: MapPin,
      title: "Location of Studies",
      content: ["Online (available worldwide)", "On Campus (Kumba, Cameroon)"]
    },
    {
      icon: BookOpen,
      title: "Credits Required",
      content: ["120 Credits to complete the program"]
    },
    {
      icon: DollarSign,
      title: "Cost per Credit",
      content: ["5,000 frs CFA per credit (≈ $9 USD)"]
    },
    {
      icon: GraduationCap,
      title: "Tuition Fees",
      content: ["Total: 600,000 frs CFA (≈ $1,080 USD)"]
    }
  ];

  const specializations = [
    "Mission/Evangelism",
    "Christian Education",
    "Pastoral Care and Counselling",
    "Biblical Studies and Theology"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/10 border border-gold-400/20 mb-6">
                <span className="text-gold-300 text-sm font-medium">18 Months Program</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gold-50 mb-6">
                Bachelor's Degree Program
              </h1>
              <p className="text-lg text-gold-100/70 mb-8">
                A comprehensive undergraduate program for serious students pursuing full-time ministry careers. 
                Gain in-depth knowledge and practical skills for effective church leadership.
              </p>
              <Button variant="hero" size="xl" onClick={() => navigate("/register")}>
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Specializations */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                Available <span className="text-gradient-gold">Specializations</span>
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {specializations.map((spec) => (
                <span 
                  key={spec} 
                  className="px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-foreground text-sm font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Program Details */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">
                Program <span className="text-gradient-gold">Details</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about the Bachelor's Degree program
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programDetails.map((detail, index) => (
                <Card 
                  key={detail.title} 
                  className="border-border hover:shadow-lg transition-shadow animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-4">
                      <detail.icon className="w-6 h-6 text-burgundy-800" />
                    </div>
                    <CardTitle className="text-xl font-serif">{detail.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {detail.content.map((item, i) => (
                        <li key={i} className="text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-foreground mb-4">
              Ready for Full-Time Ministry Training?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Commit to comprehensive theological education. Apply today and prepare for impactful ministry leadership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => navigate("/register")}>
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/contact")}>
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DegreeProgram;
