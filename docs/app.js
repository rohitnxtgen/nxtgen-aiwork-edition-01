const questions = [
  {
    shortLabel: "Current state",
    label: "Where is your enterprise on its AI journey today?",
    choices: [
      ["Exploring", 0],
      ["Running pilots", 1],
      ["Scaling use cases", 2],
      ["Deploying securely", 3],
    ],
  },
  {
    shortLabel: "Data",
    label: "How prepared is your data foundation for enterprise AI?",
    choices: [
      ["Still fragmented", 0],
      ["Ready by use case", 1],
      ["Governed platform", 2],
      ["Enterprise-wide", 3],
    ],
  },
  {
    shortLabel: "Security",
    label: "How consistently are AI security and governance applied?",
    choices: [
      ["Policies forming", 0],
      ["Controls by pilot", 1],
      ["Central governance", 2],
      ["Regulated by design", 3],
    ],
  },
];

const results = [
  {
    max: 2,
    eyebrow: "FOUNDATION PATH",
    title: "Build the conditions for a focused AI start.",
    body: "Prioritise one valuable use case, establish accountable data ownership and define the security requirements before selecting the deployment model.",
  },
  {
    max: 5,
    eyebrow: "GOVERNED PILOT PATH",
    title: "Turn experimentation into a governed pilot.",
    body: "Choose a priority workload, connect it to a controlled data foundation and agree the operational guardrails that will carry forward into production.",
  },
  {
    max: 7,
    eyebrow: "SCALE PATH",
    title: "Standardise the path from pilots to production.",
    body: "Create repeatable controls for data, security, infrastructure and operations so successful use cases can scale without creating fragmented AI estates.",
  },
  {
    max: 9,
    eyebrow: "SECURE DEPLOYMENT PATH",
    title: "Shape a private AI platform for enterprise scale.",
    body: "Translate mature AI capabilities into a governed private AI environment designed around workload performance, data control and operational resilience.",
  },
];

let step = 0;
let answers = {};

const panel = document.querySelector("#assessment-panel");
const rail = document.querySelector("#path-rail");
const progress = document.querySelector("#progress-step");

function renderRail() {
  const labels = [...questions.map((question) => question.shortLabel), "Your path"];
  rail.innerHTML = labels
    .map(
      (label, index) => `
        <div class="rail-step ${index <= step ? "active" : ""}" ${index === step ? 'aria-current="step"' : ""}>
          <span class="rail-dot" aria-hidden="true"></span>
          <span>${label}</span>
        </div>`,
    )
    .join("");
}

function selectAnswer(value) {
  answers[step] = Number(value);
  renderQuestion();
}

function renderQuestion() {
  const question = questions[step];
  const selected = answers[step];
  panel.innerHTML = `
    <div class="question-panel">
      <p class="question-label" id="question-${step}">${question.label}</p>
      <div class="options" role="radiogroup" aria-labelledby="question-${step}">
        ${question.choices
          .map(
            ([label, value]) => `
              <label class="option">
                <input type="radio" name="question-${step}" value="${value}" ${selected === value ? "checked" : ""} />
                <span class="option-indicator" aria-hidden="true"></span>
                <span class="option-text">${label}</span>
              </label>`,
          )
          .join("")}
      </div>
      <div class="assessment-actions">
        ${step > 0 ? '<button class="button button-tertiary" type="button" data-action="back">Back</button>' : "<span></span>"}
        <button class="button button-dark" type="button" data-action="continue" ${selected === undefined ? "disabled" : ""}>
          Continue <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>`;

  panel.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", (event) => selectAnswer(event.target.value));
  });
  panel.querySelector('[data-action="continue"]')?.addEventListener("click", () => {
    if (answers[step] === undefined) return;
    step += 1;
    render();
  });
  panel.querySelector('[data-action="back"]')?.addEventListener("click", () => {
    step -= 1;
    render();
  });
}

function renderResult() {
  const score = Object.values(answers).reduce((total, value) => total + value, 0);
  const result = results.find((candidate) => score <= candidate.max) || results[results.length - 1];
  panel.innerHTML = `
    <div class="result-panel" aria-live="polite">
      <div>
        <span class="result-eyebrow">${result.eyebrow}</span>
        <h3>${result.title}</h3>
        <p>${result.body}</p>
        <small>This directional check is a conversation starter, not a formal readiness audit.</small>
      </div>
      <div class="result-actions">
        <a class="button button-primary" href="https://nxtgen.com/contact-us">Speak to an Expert <span aria-hidden="true">→</span></a>
        <button class="button button-tertiary" type="button" data-action="restart">Retake assessment</button>
      </div>
    </div>`;
  panel.querySelector('[data-action="restart"]').addEventListener("click", () => {
    step = 0;
    answers = {};
    render();
  });
}

function render() {
  progress.textContent = `Step ${Math.min(step + 1, 4)} of 4`;
  renderRail();
  if (step === questions.length) renderResult();
  else renderQuestion();
}

render();
