import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import foundersImage from "@/assets/founders.jpeg";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      title: "Biblical Foundation",
      description: "Every teaching is rooted in Scripture, ensuring students receive truth that transforms lives.",
    },
    {
      title: "Compassionate Ministry",
      description: "We nurture hearts to serve with love, reflecting Christ's compassion to a hurting world.",
    },
    {
      title: "Community & Fellowship",
      description: "Building lasting relationships that support spiritual growth and mutual encouragement.",
    },
    {
      title: "Global Vision",
      description: "Equipping believers to carry the Gospel to every nation, tribe, and tongue.",
    },
    {
      title: "Purpose-Driven",
      description: "Helping each student discover and fulfill their unique calling in God's kingdom.",
    },
    {
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
      <section className="relative pt-28 lg:pt-36 pb-20 lg:pb-24 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-0 w-72 h-72 bg-gold-400/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-wine-400/30 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <p className="font-display text-xs tracking-[0.22em] uppercase text-gold-400 mb-4 animate-fade-up">
              Our Story
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-gold-50 mb-6 leading-tight animate-fade-up" style={{ animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards" }}>
              Taking you from where you are{" "}
              <span className="italic text-gradient-gold">to where you should be</span>
            </h1>
            <p className="text-lg text-gold-100/75 leading-relaxed max-w-2xl animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}>
              For over a decade, Rhema Fits Bible College has been transforming lives through 
              sound biblical teaching, preparing men and women to impact their world for Christ.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-atmosphere py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
            <div>
              <p className="font-display text-xs tracking-[0.2em] uppercase text-gold-600 mb-3">Mission</p>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-burgundy-900 mb-4">Equip believers for ministry</h3>
              <p className="text-muted-foreground leading-relaxed">
                To equip believers with a solid foundation in the Word of God, developing their 
                spiritual gifts and preparing them for effective ministry in their communities, 
                churches, and nations.
              </p>
            </div>
            
            <div>
              <p className="font-display text-xs tracking-[0.2em] uppercase text-gold-600 mb-3">Vision</p>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-burgundy-900 mb-4">Raise Spirit-filled leaders</h3>
              <p className="text-muted-foreground leading-relaxed">
                To see a generation of Spirit-filled leaders rising across Africa and beyond, 
                transforming communities through the power of the Gospel and establishing 
                thriving ministries that glorify God.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="section-parchment py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 max-w-xl">
              <p className="font-display text-xs tracking-[0.22em] uppercase text-burgundy-500 mb-3">Our Founders</p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-burgundy-900">
                Meet the visionaries
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
      <section className="py-20 lg:py-24 bg-burgundy-950">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-14 max-w-2xl">
            <p className="font-display text-xs tracking-[0.22em] uppercase text-gold-400 mb-3">What We Stand For</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gold-50">Our core values</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 max-w-6xl">
            {values.map((value, index) => (
              <div key={index}>
                <span className="font-display text-xs tracking-[0.2em] text-gold-500 mb-3 block">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-xl font-semibold text-gold-50 mb-2">{value.title}</h3>
                <p className="text-gold-100/65 text-sm leading-relaxed">{value.description}</p>
              </div>
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
