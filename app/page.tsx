"use client";

import { useMemo, useState } from "react";

type Choice = { label: string; value: number };
type Question = { label: string; shortLabel: string; choices: Choice[] };

const questions: Question[] = [
  {
    shortLabel: "Current state",
    label: "Where is your enterprise on its AI journey today?",
    choices: [
      { label: "Exploring", value: 0 },
      { label: "Running pilots", value: 1 },
      { label: "Scaling use cases", value: 2 },
      { label: "Deploying securely", value: 3 },
    ],
  },
  {
    shortLabel: "Data",
    label: "How prepared is your data foundation for enterprise AI?",
    choices: [
      { label: "Still fragmented", value: 0 },
      { label: "Ready by use case", value: 1 },
      { label: "Governed platform", value: 2 },
      { label: "Enterprise-wide", value: 3 },
    ],
  },
  {
    shortLabel: "Security",
    label: "How consistently are AI security and governance applied?",
    choices: [
      { label: "Policies forming", value: 0 },
      { label: "Controls by pilot", value: 1 },
      { label: "Central governance", value: 2 },
      { label: "Regulated by design", value: 3 },
    ],
  },
];

const interestMailto = `mailto:marketing@nxtgen.com?subject=${encodeURIComponent(
  "AI@Work Edition 01 — Register interest",
)}&body=${encodeURIComponent(
  "I read the 1st editorial on the Financial Express, “India’s AI Inflection Point”, and found it insightful.",
)}`;

function getPathResult(score: number) {
  if (score <= 2) {
    return {
      eyebrow: "FOUNDATION PATH",
      title: "Build the conditions for a focused AI start.",
      body: "Prioritise one valuable use case, establish accountable data ownership and define the security requirements before selecting the deployment model.",
    };
  }
  if (score <= 5) {
    return {
      eyebrow: "GOVERNED PILOT PATH",
      title: "Turn experimentation into a governed pilot.",
      body: "Choose a priority workload, connect it to a controlled data foundation and agree the operational guardrails that will carry forward into production.",
    };
  }
  if (score <= 7) {
    return {
      eyebrow: "SCALE PATH",
      title: "Standardise the path from pilots to production.",
      body: "Create repeatable controls for data, security, infrastructure and operations so successful use cases can scale without creating fragmented AI estates.",
    };
  }
  return {
    eyebrow: "SECURE DEPLOYMENT PATH",
    title: "Shape a private AI platform for enterprise scale.",
    body: "Translate mature AI capabilities into a governed private AI environment designed around workload performance, data control and operational resilience.",
  };
}

function Pathfinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const isResult = step === questions.length;
  const currentQuestion = questions[step];
  const score = useMemo(
    () => Object.values(answers).reduce((total, value) => total + value, 0),
    [answers],
  );
  const result = getPathResult(score);

  function continueAssessment() {
    if (answers[step] === undefined) return;
    setStep((current) => Math.min(current + 1, questions.length));
  }

  function restartAssessment() {
    setAnswers({});
    setStep(0);
  }

  return (
    <section className="pathfinder-wrap" id="assessment" aria-labelledby="pathfinder-title">
      <div className="container">
        <div className="pathfinder-card">
          <div className="pathfinder-top">
            <div className="pathfinder-title">
              <span className="section-kicker">AI READINESS ASSESSMENT</span>
              <h2 id="pathfinder-title">NxtGen Private AI Deployment Path Finder</h2>
              <p>Answer three focused questions to identify a practical starting point for your enterprise.</p>
            </div>
            <div className="progress-label" aria-live="polite">
              <strong>Step {Math.min(step + 1, 4)} of 4</strong>
              <span>About two minutes</span>
            </div>
          </div>

          <div className="path-rail" aria-label="Assessment progress">
            {[...questions.map((question) => question.shortLabel), "Your path"].map((label, index) => (
              <div
                className={`rail-step ${index <= step ? "active" : ""}`}
                aria-current={index === step ? "step" : undefined}
                key={label}
              >
                <span className="rail-dot" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {!isResult && currentQuestion ? (
            <div className="question-panel">
              <p className="question-label" id={`question-${step}`}>{currentQuestion.label}</p>
              <div className="options" role="radiogroup" aria-labelledby={`question-${step}`}>
                {currentQuestion.choices.map((choice) => (
                  <label className="option" key={choice.label}>
                    <input
                      type="radio"
                      name={`question-${step}`}
                      value={choice.value}
                      checked={answers[step] === choice.value}
                      onChange={() => setAnswers((current) => ({ ...current, [step]: choice.value }))}
                    />
                    <span className="option-indicator" aria-hidden="true" />
                    <span className="option-text">{choice.label}</span>
                  </label>
                ))}
              </div>
              <div className="assessment-actions">
                {step > 0 ? (
                  <button className="button button-tertiary" type="button" onClick={() => setStep(step - 1)}>
                    Back
                  </button>
                ) : <span />}
                <button
                  className="button button-dark"
                  type="button"
                  disabled={answers[step] === undefined}
                  onClick={continueAssessment}
                >
                  Continue <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="result-panel" aria-live="polite">
              <div>
                <span className="result-eyebrow">{result.eyebrow}</span>
                <h3>{result.title}</h3>
                <p>{result.body}</p>
                <small>This directional check is a conversation starter, not a formal readiness audit.</small>
              </div>
              <div className="result-actions">
                <a className="button button-primary" href="https://nxtgen.com/contact-us">
                  Speak to an Expert <span aria-hidden="true">→</span>
                </a>
                <button className="button button-tertiary" type="button" onClick={restartAssessment}>
                  Retake assessment
                </button>
              </div>
            </div>
          )}

          <div className="pathfinder-foot">
            <span>No technical preparation needed.</span>
            <strong>Private AI Deployment Path Finder</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="NxtGen AI at Work home">
            <img src="/nxtgen-logo-blue.png" alt="NxtGen" width="138" height="30" />
            <span className="brand-series">AI@Work</span>
          </a>
          <nav className="nav" aria-label="Primary navigation">
            <a href="#assessment">Path Finder</a>
            <a href="#next-edition">Next edition</a>
            <a className="nav-cta" href="https://nxtgen.com/contact-us">Speak to an Expert</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true">
            <span className="grid-node node-one" />
            <span className="grid-node node-two" />
            <span className="grid-node node-three" />
            <span className="grid-caption">AI@WORK / 01</span>
          </div>
          <div className="container hero-inner">
            <div className="hero-copy">
              <div className="edition-pill"><span /> Edition 01 companion page</div>
              <h1 id="hero-title">India’s AI<br />Inflection<span className="mobile-title-break"><br /></span> Point</h1>
              <p>Move from AI ambition to a clear, secure deployment path.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#assessment">
                  Assess Your AI Readiness <span aria-hidden="true">→</span>
                </a>
                <a className="button button-secondary" href="https://nxtgen.com/contact-us">Speak to an Expert</a>
              </div>
            </div>
            <figure className="ai-creative">
              <img
                src="/ai-private-creative.png"
                alt="Abstract private AI infrastructure connecting governed data, compute and analytics"
                width="883"
                height="909"
              />
              <figcaption>
                <span>PRIVATE AI</span>
                <strong>Data control · Secure infrastructure · Enterprise scale</strong>
              </figcaption>
            </figure>
          </div>
        </section>

        <Pathfinder />

        <section className="edition" id="next-edition" aria-labelledby="edition-title">
          <div className="container edition-grid">
            <div>
              <span className="section-kicker section-kicker-light">AI@WORK / EDITION 02</span>
              <h2 id="edition-title">Continue the AI@Work conversation.</h2>
              <p>Receive the next edition and stay connected to NxtGen’s enterprise AI perspective.</p>
            </div>
            <div className="signup static-signup">
              <span className="signup-title">Receive the next edition</span>
              <p>Open a pre-addressed email to NxtGen Marketing to register your interest in AI@Work Edition 02.</p>
              <a className="button button-light" href={interestMailto}>
                Register interest <span aria-hidden="true">→</span>
              </a>
              <small>Your email app will open with the message already prepared.</small>
            </div>
          </div>
        </section>

        <section className="expert" id="expert" aria-labelledby="expert-title">
          <div className="container expert-inner">
            <div>
              <span className="section-kicker">A CONVERSATION GROUNDED IN YOUR PRIORITIES</span>
              <h2 id="expert-title">Ready to discuss your private AI deployment path?</h2>
              <p>Explore the priorities, constraints and next steps most relevant to your enterprise.</p>
            </div>
            <a className="button button-primary" href="https://nxtgen.com/contact-us">
              Speak to an Expert <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <img src="/nxtgen-logo-white.png" alt="NxtGen" width="138" height="30" />
          <p>Any App, Any Data, Any Scale.</p>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 NxtGen AI@Work</span>
          <span>India’s AI Inflection Point</span>
        </div>
      </footer>
    </div>
  );
}
