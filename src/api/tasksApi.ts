import { Api } from "./api";

export class Task {
  public readonly uuid: string;
  public name: string;
  public description: string;
  public priority: Priority;
  public storyUuid: string;
  public status: Status;
  public readonly dateOfCreation: Date;
  public dateOfStart: Date | null;
  public dateOfFinish: Date | null;
  public assignedUserUuid: string;

  constructor(
    name: string,
    description: string,
    priority: Priority,
    storyUuid: string,
    status: Status,
    dateOfStart: Date | null,
    dateOfFinish: Date | null,
    assignedUserUuid: string
  ) {
    this.uuid = crypto.randomUUID();
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.storyUuid = storyUuid;
    this.status = status;
    this.dateOfCreation = new Date();
    this.dateOfStart = null;
    this.dateOfFinish = null;
    this.assignedUserUuid = assignedUserUuid;
  }
}

export enum Priority {
  Low,
  Medium,
  High,
}

export enum Status {
  ToDo,
  Doing,
  Done,
}

export class TasksApi implements Api<Task> {
  private readonly STORAGE_KEY = "Tasks";

  private getTasksFromLocalStorage(): Task[] {
    const tasksJSON = localStorage.getItem(this.STORAGE_KEY);
    if (tasksJSON) {
      try {
        return JSON.parse(tasksJSON);
      } catch (error) {
        console.error("Error parsing tasks from local storage:", error);
        return [];
      }
    } else {
      return [];
    }
  }

  get(uuid: string): Task | undefined {
    const tasks: Task[] = this.getTasksFromLocalStorage();
    return tasks.find((x) => x.uuid == uuid);
  }

  getAll(): Task[] {
    return this.getTasksFromLocalStorage();
  }

  create(data: Task) {
    const tasks: Task[] = this.getTasksFromLocalStorage();
    tasks.push(data);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  update(data: Task) {
    const tasks: Task[] = this.getTasksFromLocalStorage();
    const index = tasks.findIndex((x) => x.uuid == data.uuid);
    if (index !== -1) {
      tasks[index] = data;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } else {
      console.error("Task not found for update:", data.uuid);
    }
  }

  delete(uuid: string): void {
    const tasks: Task[] = this.getTasksFromLocalStorage();
    const index = tasks.findIndex((x) => x.uuid == uuid);
    if (index !== -1) {
      tasks.splice(index, 1);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } else {
      console.error("Task not found for deletion:", uuid);
    }
  }
}
