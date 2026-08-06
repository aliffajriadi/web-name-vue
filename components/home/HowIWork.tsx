const steps = [
  {
    num: "01",
    title: "Understand the Problem",
    description:
      'I start by diving deep into the "why" before looking at the "how". Understanding the business goals and user needs is the foundation.',
  },
  {
    num: "02",
    title: "Clean Architecture",
    description:
      "I write code that is modular, testable, and well-documented. Technical debt is a choice — I choose to avoid it.",
  },
  {
    num: "03",
    title: "Iterative Development",
    description:
      "I prefer building MVPs quickly and iterating based on real feedback rather than chasing theoretical perfection.",
  },
  {
    num: "04",
    title: "Honest Communication",
    description:
      "Transparent updates and realistic timelines. I value trust and clarity over over-promising.",
  },
];

export default function HowIWork() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ borderTop: "1px solid var(--border-outline)" }}
    >
      <div className="container-custom">
        {/* Eyebrow + heading */}
        <div className="eyebrow-label mb-5" style={{ justifyContent: "flex-start" }}>
          My Process
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            color: "var(--color-primary-dark)",
          }}
        >
          How I
          <br />
          <em style={{ color: "var(--color-accent-italic)" }}>Work</em>
        </h2>
        <p
          className="mb-14 max-w-md text-base leading-relaxed"
          style={{ color: "var(--color-text-body)" }}
        >
          My approach to professional engineering and thoughtful collaboration.
        </p>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-7 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border-outline)",
              }}
            >
              <div
                className="text-xs font-semibold tracking-[0.2em] mb-4"
                style={{ color: "var(--color-primary)", fontFamily: "var(--font-jakarta), monospace" }}
              >
                {step.num}
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  color: "var(--color-primary-dark)",
                }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-body)" }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
