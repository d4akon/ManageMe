import { StoriesApi, Story } from "./api/storiesApi";
import { Status, TasksApi, Task, Priority } from "./api/tasksApi";
import { UsersApi, User, Role } from "./api/usersApi";
import { ProjectsApi, Project } from "./api/projectsApi";
import { seedData } from "./utils/seedData";

const tasksApi = new TasksApi();
const storiesApi = new StoriesApi();
const usersApi = new UsersApi();
const projectsApi = new ProjectsApi();

seedData();

async function renderTasks() {
  const tasks = tasksApi.getAll();
  const stories = storiesApi.getAll();
  const users = usersApi.getAll();

  const todoTasks = tasks.filter((task) => task.status === Status.ToDo);
  const doingTasks = tasks.filter((task) => task.status === Status.Doing);
  const doneTasks = tasks.filter((task) => task.status === Status.Done);

  renderTaskList(todoTasks, "todo-tasks");
  renderTaskList(doingTasks, "doing-tasks");
  renderTaskList(doneTasks, "done-tasks");

  renderDropdownOptions(stories, "storyUuid");
  renderDropdownOptions(users, "assignedUserUuid");
}

function renderTaskList(tasks: Task[], containerId: string) {
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

function renderDropdownOptions(items: any[], selectId: string) {
  const select = document.getElementById(selectId) as HTMLSelectElement;
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.uuid;
    option.textContent = item instanceof Story ? item.name : `${item.name}`;
    select.appendChild(option);
  });
}

document
  .getElementById("add-task-btn")
  ?.addEventListener("click", openTaskFormModal);
document
  .getElementById("task-form-modal")
  ?.addEventListener("submit", handleTaskFormSubmit);
document
  .getElementById("todo-tasks")
  ?.addEventListener("click", handleTaskAction);
document
  .getElementById("doing-tasks")
  ?.addEventListener("click", handleTaskAction);
document
  .getElementById("done-tasks")
  ?.addEventListener("click", handleTaskAction);

async function openTaskFormModal() {
  const modal = document.getElementById("task-form-modal");
  if (!modal) return;

  const form = modal.querySelector("#task-form") as HTMLFormElement;
  form.reset();

  const formTitle = modal.querySelector("#form-title");
  if (formTitle) formTitle.textContent = "Add New Task";

  modal.style.display = "block";

  modal.querySelector(".close")?.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

async function handleTaskFormSubmit(event: Event) {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const priority = parseInt(formData.get("priority") as string);
  const storyUuid = formData.get("storyUuid") as string;
  const assignedUserUuid = formData.get("assignedUserUuid") as string;

  const dateOfStart = new Date();
  const dateOfFinish = null;
  const status = Status.ToDo;

  const newTask = new Task(
    name,
    description,
    priority,
    storyUuid,
    status,
    dateOfStart,
    dateOfFinish,
    assignedUserUuid
  );
  tasksApi.create(newTask);

  const modal = document.getElementById("task-form-modal");
  if (modal) modal.style.display = "none";

  renderTasks();
}

async function handleTaskAction(event: Event) {
  const target = event.target as HTMLElement;
  const viewDetailsBtn = target.closest(".view-details-btn");
  if (!viewDetailsBtn) return;

  const taskId = viewDetailsBtn.getAttribute("data-task-id");
  if (!taskId) return;

  const task = tasksApi.get(taskId);
  if (!task) return;

  const modal = document.getElementById("task-details-modal");
  if (!modal) return;

  const modalContent = modal.querySelector(".modal-content");
  if (!modalContent) return;

  const story = storiesApi.get(task.storyUuid);
  const user = usersApi.get(task.assignedUserUuid);

  const taskDetails = `
    <h3>${task.name}</h3>
    <p><strong>Description:</strong> ${task.description}</p>
    <p><strong>Priority:</strong> ${Priority[task.priority]}</p>
    <p><strong>Status:</strong> ${Status[task.status]}</p>
    <p><strong>Story:</strong> ${story ? story.name : "Unknown"}</p>
    <p><strong>Assigned User:</strong> ${
      user ? `${user.name} ${user.surname}` : "Unknown"
    }</p>
    <p><strong>Date of Start:</strong> ${
      task.dateOfStart
        ? new Date(task.dateOfStart).toDateString()
        : "Not started"
    }</p>
    <p><strong>Date of Finish:</strong> ${
      task.dateOfFinish
        ? new Date(task.dateOfFinish).toDateString()
        : "Not finished"
    }</p>
    <button id="edit-task-btn" data-task-id="${task.uuid}">Edit Task</button>
    <button id="close-modal-btn">Close</button>
  `;

  modalContent.innerHTML = taskDetails;

  modal.style.display = "block";

  modal.querySelector("#close-modal-btn")?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.querySelector("#edit-task-btn")?.addEventListener("click", () => {
    handleEditTask(taskId);
  });
}

async function handleEditTask(taskId: string | null) {
  if (!taskId) return;

  const task = tasksApi.get(taskId);
  if (!task) return;

  const users = await usersApi.getAll();
  const userMap: Record<string, string> = {};
  users.forEach(
    (user) => (userMap[user.uuid] = `${user.name} ${user.surname}`)
  );

  const stories = await storiesApi.getAll();
  const storyMap: Record<string, string> = {};
  stories.forEach((story) => (storyMap[story.uuid] = story.name));

  const editForm = getEditTaskForm(task, userMap, storyMap);
  const modalContent = document.querySelector(".modal-content");
  if (!modalContent) return;

  modalContent.innerHTML = editForm;

  const form = document.getElementById("edit-task-form") as HTMLFormElement;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    handleEditTaskFormSubmit(taskId);
  });
}

document
  .getElementById("task-details-modal")
  ?.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    if (target.id !== "edit-task-btn") return;

    const taskId = target.getAttribute("data-task-id");
    if (!taskId) return;

    const task = tasksApi.get(taskId);
    if (!task) return;

    const users = await usersApi.getAll();
    const userMap: Record<string, string> = {};
    users.forEach(
      (user) => (userMap[user.uuid] = `${user.name} ${user.surname}`)
    );

    const stories = await storiesApi.getAll();
    const storyMap: Record<string, string> = {};
    stories.forEach((story) => (storyMap[story.uuid] = story.name));

    const editForm = getEditTaskForm(task, userMap, storyMap);
    const modalContent = document.querySelector(".modal-content");
    if (!modalContent) return;

    modalContent.innerHTML = editForm;

    const form = document.getElementById("edit-task-form") as HTMLFormElement;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      handleEditTaskFormSubmit(taskId);
    });
  });

function getEditTaskForm(
  task: Task,
  users: Record<string, string>,
  stories: Record<string, string>
): string {
  return `
      <h2>Edit Task</h2>
      <form id="edit-task-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" value="${
          task.name
        }" required />
  
        <label for="description">Description:</label>
        <textarea id="description" name="description" required>${
          task.description
        }</textarea>
  
        <label for="priority">Priority:</label>
        <select id="priority" name="priority" required>
          <option value="0" ${
            task.priority === Priority.Low ? "selected" : ""
          }>Low</option>
          <option value="1" ${
            task.priority === Priority.Medium ? "selected" : ""
          }>Medium</option>
          <option value="2" ${
            task.priority === Priority.High ? "selected" : ""
          }>High</option>
        </select>
  
        <label for="storyUuid">Story:</label>
        <select id="storyUuid" name="storyUuid" required>
          ${Object.entries(stories)
            .map(
              ([uuid, name]) => `
            <option value="${uuid}" ${
                uuid === task.storyUuid ? "selected" : ""
              }>${name}</option>
          `
            )
            .join("")}
        </select>
  
        <label for="status">Status:</label>
        <select id="status" name="status" required>
          <option value="0" ${
            task.status === Status.ToDo ? "selected" : ""
          }>To Do</option>
          <option value="1" ${
            task.status === Status.Doing ? "selected" : ""
          }>Doing</option>
          <option value="2" ${
            task.status === Status.Done ? "selected" : ""
          }>Done</option>
        </select>
  
        <label for="assignedUserUuid">Assigned User:</label>
        <select id="assignedUserUuid" name="assignedUserUuid" required>
          ${Object.entries(users)
            .map(
              ([uuid, name]) => `
            <option value="${uuid}" ${
                uuid === task.assignedUserUuid ? "selected" : ""
              }>${name}</option>
          `
            )
            .join("")}
        </select>
  
        <button type="submit">Save</button>
      </form>
    `;
}

async function handleEditTaskFormSubmit(taskId: string | null) {
  if (!taskId) return;

  const task = tasksApi.get(taskId);
  if (!task) return;

  const form = document.getElementById("edit-task-form") as HTMLFormElement;
  const formData = new FormData(form);

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const priority = parseInt(formData.get("priority") as string);
  const storyUuid = formData.get("storyUuid") as string;
  const status = parseInt(formData.get("status") as string);
  const assignedUserUuid = formData.get("assignedUserUuid") as string;

  task.name = name;
  task.description = description;
  task.priority = priority;
  task.storyUuid = storyUuid;
  task.status = status;
  task.assignedUserUuid = assignedUserUuid;

  if (task.status === Status.Doing) {
    task.dateOfStart = new Date();
  }

  if (task.status === Status.Done) {
    task.dateOfFinish = new Date();
  }

  tasksApi.update(task);

  renderTasks();

  const modal = document.getElementById("task-details-modal");
  if (modal) modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
});
