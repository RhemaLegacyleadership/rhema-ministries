const features = [
  {
    title: "Clear Curriculum",
    description: "Bible, theology, and leadership woven into one structured path.",
  },
  {
    title: "Online Friendly",
    description: "Learn live or catch up with recordings from anywhere you serve.",
  },
  {
    title: "Experienced Mentors",
    description: "Guided by pastors and ministry leaders who know the field.",
  },
  {
    title: "Supportive Community",
    description: "Admissions and student care from your first inquiry to graduation.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="section-atmosphere py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-12 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="font-display text-xs tracking-[0.22em] uppercase text-burgundy-500 mb-3">
              Why Rhema Fits
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-burgundy-900 mb-4 leading-tight">
              Formation that serves real ministry
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
              Simple, focused training designed for lasting impact in the church and the nations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s`, opacity: 0, animationFillMode: "forwards" }}
              >
                <span className="font-display text-xs tracking-[0.2em] text-gold-600 mb-3 block">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-burgundy-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
