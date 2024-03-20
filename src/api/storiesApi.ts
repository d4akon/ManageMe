import { Api } from "./api";

export class Story {
  public readonly uuid: string;
  public name: string;
  public description: string;
  public priority: Priority;
  public status: Status;
  public readonly dateOfCreation: Date;
  public projectUuid: string;
  public ownerUuid: string;

  constructor(
    name: string,
    description: string,
    priority: Priority,
    status: Status,
    projectUuid: string,
    ownerUuid: string
  ) {
    this.uuid = crypto.randomUUID();
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.dateOfCreation = new Date();
    this.projectUuid = projectUuid;
    this.ownerUuid = ownerUuid;
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

export class StoriesApi implements Api<Story> {
  private readonly STORAGE_KEY = "Stories";

  private getStoriesFromLocalStorage(): Story[] {
    const storiesJSON = localStorage.getItem(this.STORAGE_KEY);
    if (storiesJSON) {
      try {
        return JSON.parse(storiesJSON);
      } catch (error) {
        console.error("Error parsing stories from local storage:", error);
        return [];
      }
    } else {
      return [];
    }
  }

  get(uuid: string): Story | undefined {
    const stories: Story[] = this.getStoriesFromLocalStorage();
    return stories.find((x) => x.uuid == uuid);
  }

  getAll(): Story[] {
    return this.getStoriesFromLocalStorage();
  }

  create(data: Story) {
    const stories: Story[] = this.getStoriesFromLocalStorage();
    stories.push(data);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
  }

  update(data: Story) {
    const stories: Story[] = this.getStoriesFromLocalStorage();
    const index = stories.findIndex((x) => x.uuid == data.uuid);
    if (index !== -1) {
      stories[index] = data;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    } else {
      console.error("Story not found for update:", data.uuid);
    }
  }

  delete(uuid: string): void {
    const stories: Story[] = this.getStoriesFromLocalStorage();
    const index = stories.findIndex((x) => x.uuid == uuid);
    if (index !== -1) {
      stories.splice(index, 1);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    } else {
      console.error("Story not found for deletion:", uuid);
    }
  }
}
