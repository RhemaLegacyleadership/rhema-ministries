import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const programs = [
  {
    title: "Certificate",
    duration: "6 Months",
    credits: "30 credits",
    tuition: "60,000 frs CFA",
    description: "Foundational Bible and ministry training for those beginning their calling.",
    href: "/programs/certificate",
  },
  {
    title: "Diploma",
    duration: "6 Months",
    credits: "60 credits",
    tuition: "180,000 frs CFA",
    description: "Deeper theology and practical ministry skills for growing leaders.",
    href: "/programs/diploma",
  },
  {
    title: "Degree",
    duration: "18 Months",
    credits: "120 credits",
    tuition: "600,000 frs CFA",
    description: "Comprehensive formation for full-time pastoral and mission work.",
    href: "/programs/degree",
  },
  {
    title: "Masters",
    duration: "15 Months",
    credits: "64 credits",
    tuition: "640,000 frs CFA",
    description: "Advanced leadership and theological depth for seasoned ministers.",
    href: "/programs/masters",
  },
];

const ProgramsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-parchment py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-14 lg:mb-16">
          <p className="font-display text-xs tracking-[0.22em] uppercase text-burgundy-500 mb-3">
            Pathways
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-burgundy-900 mb-4">
            Explore our programs
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Four clear pathways built for ministry growth—from first steps to advanced leadership.
          </p>
        </div>

        <div className="border-t border-burgundy-200/80">
          {programs.map((program, index) => (
            <button
              key={program.title}
              type="button"
              onClick={() => navigate(program.href)}
              className="group w-full text-left border-b border-burgundy-200/80 py-7 sm:py-8 lg:py-9 transition-colors hover:bg-burgundy-50/40 focus-visible:outline-none focus-visible:bg-burgundy-50/60 animate-fade-up"
              style={{ animationDelay: `${index * 0.08}s`, opacity: 0, animationFillMode: "forwards" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_auto] gap-3 sm:gap-6 lg:gap-10 items-start sm:items-center">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-burgundy-900 group-hover:text-burgundy-700 transition-colors">
                    {program.title}
                  </h3>
                  <p className="mt-1 text-sm text-gold-700 font-medium">
                    {program.duration} · {program.credits}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed max-w-xl">
                    {program.description}
                  </p>
                  <p className="mt-2 text-sm text-burgundy-800/70">{program.tuition}</p>
                </div>

                <div className="flex items-center gap-2 text-burgundy-800 font-medium pt-1 sm:pt-0 sm:justify-self-end">
                  <span className="text-sm tracking-wide">Learn more</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
