import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "Admissions",
    items: [
      {
        q: "What are the admission requirements?",
        a: "Requirements vary by program. Certificate programs require a high school diploma or equivalent, while Degree and Masters programs require prior academic qualifications. All applicants should have a genuine desire to serve in ministry.",
      },
      {
        q: "How do I apply to Rhema Fits Bible College?",
        a: "Click the 'Apply Now' button on our website, fill out the registration form, and submit the required documents. Our admissions team will review your application and contact you within 5–7 business days.",
      },
      {
        q: "Is there an application fee?",
        a: "Please contact our admissions office at support@rhemafitsministries.com or via WhatsApp at +237 679 286 428 for details on application fees and payment methods.",
      },
      {
        q: "Can international students apply?",
        a: "Absolutely! We welcome students from all nations. We also offer distance-learning options for those who cannot attend in person.",
      },
    ],
  },
  {
    category: "Programs & Curriculum",
    items: [
      {
        q: "What programs do you offer?",
        a: "We offer Certificate, Diploma, Degree, and Masters programs in Biblical Studies, Theology, and Ministry Leadership.",
      },
      {
        q: "How long do the programs take to complete?",
        a: "Certificate programs take approximately 1 year, Diploma programs 2 years, Degree programs 3–4 years, and Masters programs 1–2 years depending on course load.",
      },
      {
        q: "Is online / distance learning available?",
        a: "Yes! Since 2021, we have offered online learning options so students across Africa and beyond can access our courses remotely.",
      },
      {
        q: "What subjects are covered?",
        a: "Our curriculum includes Systematic Theology, Old & New Testament Studies, Church History, Pastoral Ministry, Leadership, Missions, Homiletics, and more.",
      },
    ],
  },
  {
    category: "Tuition & Payments",
    items: [
      {
        q: "How much is tuition?",
        a: "Tuition varies by program. Contact our office for the current fee schedule. We strive to keep our programs affordable and accessible.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept MTN Mobile Money (+237 679 286 428), bank transfers, and international payment arrangements for online students. Contact the admin office for details based on your country.",
      },
      {
        q: "Are scholarships or financial aid available?",
        a: "We offer limited scholarships for qualifying students. Please reach out to the admissions office to inquire about financial assistance opportunities.",
      },
    ],
  },
  {
    category: "Student Life",
    items: [
      {
        q: "What support do students receive?",
        a: "Students benefit from mentorship, pastoral care, academic advising, and a close-knit community of fellow believers committed to spiritual growth.",
      },
      {
        q: "Are there ministry practicum opportunities?",
        a: "Yes, all programs include practical ministry components where students gain hands-on experience in preaching, teaching, counseling, and outreach.",
      },
      {
        q: "Can I study part-time?",
        a: "Yes, we offer flexible scheduling options including part-time study for students who are working or engaged in ministry.",
      },
    ],
  },
];

const FAQ = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 lg:pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-wine-400 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <p className="text-gold-400 font-medium tracking-wider uppercase mb-4 animate-fade-up">
            Common Questions
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gold-50 mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h1>
          <p
            className="text-lg md:text-xl text-gold-100/80 leading-relaxed max-w-2xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Find answers to the most common questions about our programs, admissions, and student life.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {faqs.map((section, i) => (
            <div key={i} className="mb-12 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-burgundy flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-gold-400" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-burgundy-800">{section.category}</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-3">
                {section.items.map((faq, j) => (
                  <AccordionItem
                    key={j}
                    value={`${i}-${j}`}
                    className="border border-burgundy-100 rounded-xl px-6 shadow-soft data-[state=open]:shadow-medium transition-shadow"
                  >
                    <AccordionTrigger className="text-left font-medium text-burgundy-800 hover:text-burgundy-600 py-5">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-wine">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold-50 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gold-100/80 text-lg max-w-xl mx-auto mb-8">
            Our team is happy to help. Reach out to us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => navigate("/contact")}>
              Contact Us
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-burgundy-800"
              onClick={() => window.open("https://wa.me/237679286428", "_blank")}
            >
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
