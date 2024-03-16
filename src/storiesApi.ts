import { Api } from "./api";
import { Project } from "./projectApi";

export class Story {
  constructor(
    public uuid: string = crypto.randomUUID(),
    public name: string,
    public description: string,
    public priority: Priority,
    public project: Project,
    public dateOfCreation: Date,
    public status: Status,
    public ownerUuid: string
  ) {}
}

enum Priority {
  Low,
  Medium,
  High,
}

enum Status {
  ToDo,
  Doing,
  Done,
}

export class StoriesApi implements Api<Story> {
  get(uuid: string): Story {
    const response: Story = JSON.parse(localStorage.getItem(uuid) || "");
    return response;
  }
  getAll(): Story[] {
    throw new Error("Method not implemented.");
  }
  create(data: Story) {
    localStorage.setItem(data.uuid, JSON.stringify(data));
  }
  update(data: Story) {
    localStorage.setItem(data.uuid, JSON.stringify(data));
  }
  delete(uuid: string): void {
    localStorage.removeItem(uuid);
  }
}
