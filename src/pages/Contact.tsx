import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject is too long"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message is too long"),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    // Build WhatsApp message with encoded params
    const whatsappMessage = encodeURIComponent(
      `Hello Rhema Fits Bible College,\n\nName: ${result.data.name}\nEmail: ${result.data.email}\nSubject: ${result.data.subject}\n\nMessage:\n${result.data.message}`
    );
    const whatsappUrl = `https://wa.me/237679286428?text=${whatsappMessage}`;

    window.open(whatsappUrl, "_blank");

    toast({
      title: "Message Ready!",
      description: "You've been redirected to WhatsApp to send your message.",
    });

    setForm({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      title: "Our Location",
      details: ["Cameroon, Central Africa"],
    },
    {
      title: "Phone / WhatsApp",
      details: ["+237 679 286 428 (MTN MoMo)"],
    },
    {
      title: "Email Address",
      details: ["support@rhemafitsministries.com"],
    },
    {
      title: "Office Hours",
      details: ["Mon – Fri: 8:00 AM – 5:00 PM", "Sat: 9:00 AM – 1:00 PM"],
    },
  ];

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
            <p className="font-display text-xs tracking-[0.22em] uppercase text-gold-400 mb-4 animate-fade-up">Get In Touch</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-gold-50 mb-6 leading-tight animate-fade-up" style={{ animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards" }}>
              We'd love to <span className="italic text-gradient-gold">hear from you</span>
            </h1>
            <p className="text-lg text-gold-100/75 leading-relaxed max-w-2xl animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}>
              Have questions about our programs, admissions, or anything else? Reach out and we'll be happy to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-atmosphere py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 max-w-6xl">
            {contactInfo.map((item, i) => (
              <div key={i}>
                <p className="font-display text-xs tracking-[0.18em] uppercase text-gold-600 mb-2">{item.title}</p>
                {item.details.map((detail, j) => (
                  <p key={j} className="text-burgundy-900/80 text-sm leading-relaxed">{detail}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-16 bg-gradient-to-b from-burgundy-50 to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-burgundy-800 mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and you'll be redirected to WhatsApp to complete sending your message.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is this about?"
                    value={form.subject}
                    onChange={handleChange}
                    className={errors.subject ? "border-destructive" : ""}
                  />
                  {errors.subject && <p className="text-destructive text-xs">{errors.subject}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Write your message here..."
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    className={errors.message ? "border-destructive" : ""}
                  />
                  {errors.message && <p className="text-destructive text-xs">{errors.message}</p>}
                </div>

                <Button type="submit" variant="hero" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Sending..." : "Send via WhatsApp"}
                </Button>
              </form>
            </div>

            {/* Map / Info Side */}
            <div className="flex flex-col gap-8">
              <Card className="border-burgundy-100 shadow-soft flex-1">
                <CardContent className="p-0 h-full min-h-[300px]">
                  <iframe
                    title="Rhema Fits Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4078050.2641603653!2d9.7!3d5.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10610d30867e8cb9%3A0xb4a32c00e3a06cb6!2sCameroon!5e0!3m2!1sen!2s!4v1700000000000"
                    className="w-full h-full min-h-[300px] rounded-xl"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </CardContent>
              </Card>

              <Card className="border-gold-200 bg-gradient-to-br from-gold-50 to-amber-50 shadow-soft">
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-bold text-burgundy-800 mb-3">Quick Connect</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    For faster responses, reach us directly on WhatsApp or call during office hours.
                  </p>
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={() => window.open("https://wa.me/237679286428", "_blank")}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
