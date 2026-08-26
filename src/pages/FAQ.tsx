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
      <section className="relative pt-28 lg:pt-36 pb-20 lg:pb-24 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-0 w-72 h-72 bg-gold-400/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-wine-400/30 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <p className="font-display text-xs tracking-[0.22em] uppercase text-gold-400 mb-4 animate-fade-up">
              Common Questions
            </p>
            <h1
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-gold-50 mb-6 leading-tight animate-fade-up"
              style={{ animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards" }}
            >
              Frequently asked <span className="italic text-gradient-gold">questions</span>
            </h1>
            <p
              className="text-lg text-gold-100/75 leading-relaxed max-w-2xl animate-fade-up"
              style={{ animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}
            >
              Find answers about our programs, admissions, tuition, and student life.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section-atmosphere py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          {faqs.map((section, i) => (
            <div key={i} className="mb-12 last:mb-0">
              <h2 className="font-display text-xs tracking-[0.2em] uppercase text-burgundy-500 mb-5">
                {section.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {section.items.map((faq, j) => (
                  <AccordionItem
                    key={j}
                    value={`${i}-${j}`}
                    className="border-b border-burgundy-200/80 px-0 data-[state=open]:border-gold-400/40"
                  >
                    <AccordionTrigger className="text-left font-serif text-lg font-semibold text-burgundy-900 hover:text-burgundy-700 py-5 hover:no-underline">
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
