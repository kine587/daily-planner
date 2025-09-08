import "./style.css";
import { format, isBefore } from "date-fns";

const todayEl = document.getElementById("today");
const form = document.getElementById("planner-form");
const plannerInput = document.getElementById("planner-input");
const dateInput = document.getElementById("date-input");
const plannerList = document.getElementById("planner-list");

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

    div.textContent = text;

    if (!plan.completed) {
      const btn = document.createElement("button");
      btn.textContent = " done";
      btn.addEventListener("click", () => completePlan(plan.id));
      div.appendChild(btn);
    }

    plannerList.appendChild(div);
  });
}

// mark complete
function completePlan(id) {
  plans = plans.map((p) => (p.id === id ? { ...p, completed: true } : p));
}
