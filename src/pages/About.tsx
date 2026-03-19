import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, BookOpen, Users, Globe, Target, Lightbulb } from "lucide-react";
import foundersImage from "@/assets/founders.jpeg";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: BookOpen,
      title: "Biblical Foundation",
      description: "Every teaching is rooted in Scripture, ensuring students receive truth that transforms lives.",
    },
    {
      icon: Heart,
      title: "Compassionate Ministry",
      description: "We nurture hearts to serve with love, reflecting Christ's compassion to a hurting world.",
    },
    {
      icon: Users,
      title: "Community & Fellowship",
      description: "Building lasting relationships that support spiritual growth and mutual encouragement.",
    },
    {
      icon: Globe,
      title: "Global Vision",
      description: "Equipping believers to carry the Gospel to every nation, tribe, and tongue.",
    },
    {
      icon: Target,
      title: "Purpose-Driven",
      description: "Helping each student discover and fulfill their unique calling in God's kingdom.",
    },
    {
      icon: Lightbulb,
      title: "Spirit-Led Learning",
      description: "Combining academic excellence with the guidance of the Holy Spirit.",
    },
  ];

  const milestones = [
    { year: "2014", title: "The Beginning", description: "Rhema Fits Ministries was founded by Columbus Awung with a vision to raise kingdom leaders." },
    { year: "2016", title: "First Graduates", description: "Our inaugural class of certificate students completed their training and entered ministry." },
    { year: "2018", title: "Expanded Programs", description: "Launched diploma and degree programs to provide deeper theological education." },
    { year: "2021", title: "Online Learning", description: "Introduced distance learning to reach students across Africa and beyond." },
    { year: "2024", title: "Masters Program", description: "Established our Masters program for advanced ministry preparation." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-20 bg-gradient-hero overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-wine-400 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gold-400 font-medium tracking-wider uppercase mb-4 animate-fade-up">Our Story</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gold-50 mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Taking You From Where You Are{" "}
              <span className="text-gradient-gold">To Where You Should Be</span>
            </h1>
            <p className="text-lg md:text-xl text-gold-100/80 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
              For over a decade, Rhema Fits Bible College has been transforming lives through 
              sound biblical teaching, preparing men and women to impact their world for Christ.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-burgundy-200 bg-gradient-to-br from-burgundy-50 to-rose-50 shadow-soft">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-burgundy flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-gold-400" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-burgundy-800 mb-4">Our Mission</h3>
                <p className="text-burgundy-700/80 leading-relaxed">
                  To equip believers with a solid foundation in the Word of God, developing their 
                  spiritual gifts and preparing them for effective ministry in their communities, 
                  churches, and nations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-gold-200 bg-gradient-to-br from-gold-50 to-amber-50 shadow-soft">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-6">
                  <Lightbulb className="w-7 h-7 text-burgundy-800" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-burgundy-800 mb-4">Our Vision</h3>
                <p className="text-burgundy-700/80 leading-relaxed">
                  To see a generation of Spirit-filled leaders rising across Africa and beyond, 
                  transforming communities through the power of the Gospel and establishing 
                  thriving ministries that glorify God.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 bg-gradient-to-b from-burgundy-50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold-600 font-medium tracking-wider uppercase mb-3">Our Founders</p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-burgundy-800">
                Meet the Visionaries
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-burgundy-800 mb-2">
                  Rev. Prof. Columbus Awung
                </h3>
                <p className="text-gold-600 font-medium mb-4">President, Rhema Fits Bible College</p>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-burgundy-800 mb-2 mt-6">
Rev. Mrs. Delphine Awung
                </h3>
                <p className="text-gold-600 font-medium mb-6">Co-Founder, Rhema Fits Ministries</p>
                
                <div className="space-y-4 text-burgundy-700/80 leading-relaxed">
                  <p>
                    In 2014, with a burning passion to see believers grounded in the Word of God, 
                    <strong className="text-burgundy-800"> Rev. Prof. Columbus Awung</strong> and 
                    <strong className="text-burgundy-800"> Rev. Mrs. Delphine Awung</strong> founded Rhema Fits Ministries 
                    in Cameroon. What began as a small gathering of hungry hearts seeking biblical truth 
                    has grown into a thriving Bible college impacting lives across Central Africa.
                  </p>
                  <p>
                    Together, they recognized a critical need: many believers had zeal for God but lacked 
                    the biblical knowledge and practical training to fulfill their calling. They envisioned 
                    a place where ordinary people could be transformed into extraordinary ministers of 
                    the Gospel—equipped, empowered, and sent out to change their world.
                  </p>
                  <p>
                    Under their leadership, Rhema Fits has remained committed to its founding principle: 
                    taking people from where they are to where they should be in Christ. Their dedication 
                    to excellence in biblical education continues to inspire students and faculty alike.
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-burgundy-200 to-gold-200 rounded-2xl blur-xl opacity-40" />
                  <div className="relative rounded-2xl overflow-hidden shadow-medium">
                    <img 
                      src={foundersImage} 
                      alt="Rev. Prof. Columbus Awung and Rev. Mrs. Delphine Awung - Founders of Rhema Fits Ministries" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-burgundy-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold-400 font-medium tracking-wider uppercase mb-3">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold-50">Our Core Values</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="bg-burgundy-700/50 border-burgundy-600 backdrop-blur-sm hover:bg-burgundy-700/70 transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-gold-500/20 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-gold-50 mb-2">{value.title}</h3>
                  <p className="text-gold-100/70 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / Milestones */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-gold-600 font-medium tracking-wider uppercase mb-3">Our Journey</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-burgundy-800">A Decade of Impact</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-burgundy-300 via-gold-400 to-burgundy-300 transform md:-translate-x-1/2" />
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-12 last:mb-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-gold-500 border-4 border-background transform md:-translate-x-1/2 z-10" />
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <Card className="border-burgundy-100 shadow-soft hover:shadow-medium transition-shadow">
                      <CardContent className="p-6">
                        <span className="inline-block px-3 py-1 rounded-full bg-gold-100 text-gold-700 text-sm font-semibold mb-3">
                          {milestone.year}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-burgundy-800 mb-2">{milestone.title}</h3>
                        <p className="text-burgundy-600/80 text-sm">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-wine">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold-50 mb-6">
            Begin Your Journey Today
          </h2>
          <p className="text-gold-100/80 text-lg max-w-2xl mx-auto mb-8">
            Join hundreds of students who have discovered their purpose and are now 
            making an impact for God's kingdom around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => navigate("/register")}>
              Apply Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-burgundy-800"
              onClick={() => navigate("/programs/certificate")}
            >
              Explore Programs
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
