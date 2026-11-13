const methodologySteps = [
  {
    number: "01",
    title: "Understand the problem",
    description:
      "Identify the inputs, expected output, constraints and edge cases. Make sure the problem is understood before thinking about implementation.",
  },
  {
    number: "02",
    title: "Explore possible approaches",
    description:
      "Break the problem into smaller parts, look for patterns and consider different approaches, starting with a straightforward solution when useful.",
  },
  {
    number: "03",
    title: "Choose the right approach",
    description:
      "Identify the data structures and algorithms that fit the problem. Consider correctness and the trade-offs between possible solutions.",
  },
  {
    number: "04",
    title: "Optimize the solution",
    description:
      "Analyze time and space complexity, identify potential bottlenecks and improve the approach when a more efficient solution is justified.",
  },
  {
    number: "05",
    title: "Validate and reason",
    description:
      "Walk through examples, check boundary cases and verify the solution's behavior. Revisit its complexity and understand why the approach works.",
  },
];

export function ProblemSolvingMethodology() {
  return (
    <section
      className="site-container cp-methodology-section"
      aria-labelledby="cp-methodology-title"
    >
      <div className="cp-methodology-layout">
        <div className="cp-methodology-heading">
          <p className="cp-statistics-eyebrow">MY APPROACH</p>

          <h2 id="cp-methodology-title">
            From problem to <em>solution.</em>
          </h2>

          <p>
            Writing code is only one part of solving a problem. I focus on
            understanding the underlying idea, choosing a suitable approach and
            reasoning about its correctness and efficiency.
          </p>
        </div>

        <ol className="cp-methodology-list">
          {methodologySteps.map((step) => (
            <li className="cp-methodology-step" key={step.number}>
              <span className="cp-methodology-number" aria-hidden="true">
                {step.number}
              </span>

              <div className="cp-methodology-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
