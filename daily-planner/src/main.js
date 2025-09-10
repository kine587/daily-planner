import "./style.css";
import { format, isBefore } from "date-fns";
import "emoji-picker-element";
import "tsparticles";
import { loadConfettiPreset } from "tsparticles-preset-confetti";

loadConfettiPreset(tsParticles);

const todayEl = document.getElementById("today");
const form = document.getElementById("planner-form");
const plannerInput = document.getElementById("planner-input");
const dateInput = document.getElementById("date-input");
const plannerList = document.getElementById("planner-list");

//emoji picker
const emojiPicker = document.createElement("emoji-picker");
document.body.appendChild(emojiPicker);

emojiPicker.addEventListener("emoji-click", (e) => {
  plannerInput.value += e.detail.unicode;
});

let plans = [];

//show todays date
todayEl.textContent = format(new Date(), "EEEE, MMMM d");

// add plan
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!plannerInput.value) return;

  const newPlan = {
    id: Date.now(),
    text: plannerInput.value,
    dueDate: dateInput.value || null,
    completed: false,
  };

  plans.push(newPlan);
  savePlans();
  renderPlans();

  plannerInput.value = "";
  dateInput.value = "";
});

function clearPlannerList() {
  plannerList.replaceChildren();
}

// render plans
function renderPlans() {
  clearPlannerList();

  plans.forEach((plan) => {
    const div = document.createElement("div");
    div.className = "plans";

    if (plan.completed) {
      div.style.textDecoration = "line-through";
    }

    let text = plan.text;

    if (plan.dueDate) {
      const planDate = new Date(plan.dueDate);
      const overdue = isBefore(planDate, new Date()) && !plan.completed;

      text += `(due ${format(planDate, "MMM d, HH:mm")})`;
      if (overdue) div.style.color = "red";
    }

    const textSpan = document.createElement("span");
    textSpan.textContent = text;
    div.appendChild(textSpan);

    if (!plan.completed) {
      // edit button
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => editPlan(plan.id));
      div.appendChild(editBtn);
    }

    if (!plan.completed) {
      // done button
      const btn = document.createElement("button");
      btn.textContent = "✅ done";
      btn.addEventListener("click", () => completePlan(plan.id));
      div.appendChild(btn);
    }

    plannerList.appendChild(div);
  });
}

function savePlans() {
  localStorage.setItem("plans", JSON.stringify(plans));
}

function loadPlans() {
  const storedPlans = localStorage.getItem("plans");
  if (storedPlans) {
    plans = JSON.parse(storedPlans);
    renderPlans();
  }
}

function editPlan(id) {
  const plan = plans.find((p) => p.id === id);
  if (!plan) return;

  //replace text in dom
  const planDiv = [...plannerList.children].find((el) =>
    el.textContent.includes(plan.text)
  );
  if (!planDiv) return;

  planDiv.textContent = "";
  const input = document.createElement("input");
  input.type = "text";
  input.value = plan.text;
  planDiv.appendChild(input);
  input.focus();

  function saveEdit() {
    plan.text = input.value;
    savePlans();
    renderPlans();
  }

  input.addEventListener("blur", saveEdit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit();
  });

  const emojiPicker = document.createElement("emoji-picker");
  document.body.appendChild(emojiPicker);
  emojiPicker.addEventListener("emoji-click", (e) => {
    plannerInput.value += e.detail.unicode;
  });
}

// mark complete
function completePlan(id) {
  tsParticles.load("confetti-container", {
    preset: "confetti",
    particles: {
      color: {
        value: [
          "#ff0000",
          "#00ff00",
          "#0000ff",
          "#ffff00",
          "#ff00ff",
          "#00ffff",
        ],
      },
      size: {
        value: 5,
        random: true,
      },
      move: {
        enable: true,
        speed: 10,
        direction: "random",
        outModes: {
          default: "out",
        },
      },
    },
    fullScreen: {
      enable: false,
    },
  });

  plans = plans.filter((p) => p.id !== id);
  savePlans();
  renderPlans();
}

loadPlans();
