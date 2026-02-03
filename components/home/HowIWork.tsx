export default function HowIWork() {
  const steps = [
    {
      title: "Understand the Problem",
      description:
        'I start by diving deep into the "why" before looking at the "how". Understanding the business goals and user needs is critical.',
    },
    {
      title: "Clean Architecture",
      description:
        "I write code that is modular, testable, and documented. Technical debt is a choice, and I choose to avoid it.",
    },
    {
      title: "Iterative Development",
      description:
        "I prefer building MVPs quickly and iterating based on real feedback rather than aiming for theoretical perfection.",
    },
    {
      title: "Honest Communication",
      description:
        "Transparent updates and realistic timelines. I value trust over over-promising.",
    },
  ];

  return (
    <section className="py-20 border-t border-border">
      <div className="container-custom">
        <h2 className="text-2xl font-bold text-white mb-4">How I Work</h2>
        <p className="text-muted-foreground mb-12 max-w-xl">
          My approach to professional engineering and collaboration.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 bg-card border border-border rounded-xl"
            >
              <div className="text-primary font-mono mb-2">0{index + 1}.</div>
              <h3 className="text-lg font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
