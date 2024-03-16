import { Api } from "./api.ts";

export class Project {
  constructor(
    public uuid: string = crypto.randomUUID(),
    public name: string,
    public description: string,
    public isActive: boolean = false
  ) {}
}

export class ProjectApi implements Api<Project> {
  get(uuid: string): Project {
    const response: Project = JSON.parse(localStorage.getItem(uuid) || "");
    return response;
  }
  getAll(): Project[] {
    throw new Error("Method not implemented.");
  }
  create(data: Project) {
    localStorage.setItem(data.uuid, JSON.stringify(data));
  }
  update(data: Project) {
    localStorage.setItem(data.uuid, JSON.stringify(data));
  }
  delete(uuid: string): void {
    localStorage.removeItem(uuid);
  }
}
