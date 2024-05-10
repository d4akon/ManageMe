import { Story } from "../api/storiesApi";
import { Task } from "../api/tasksApi";

export function renderTaskList(tasks: Task[], containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.innerHTML = `
        <h3>${task.name}</h3>
        <p>${task.description}</p>
        <button class="view-details-btn" data-task-id="${task.uuid}">View Details</button>`;
    container.appendChild(taskElement);
  });
}

export function renderDropdownOptions(items: any[], selectId: string) {
  const select = document.getElementById(selectId) as HTMLSelectElement;
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.uuid;
    option.textContent = item instanceof Story ? item.name : `${item.name}`;
    select.appendChild(option);
  });
}
