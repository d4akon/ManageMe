import { Api } from "./api.ts";

export class Project {
  public readonly uuid: string;
  public name: string;
  public description: string;
  public isActive: boolean;

  constructor(name: string, description: string, isActive: boolean = false) {
    this.uuid = crypto.randomUUID();
    this.name = name;
    this.description = description;
    this.isActive = isActive;
  }
}

export class ProjectsApi implements Api<Project> {
  private readonly STORAGE_KEY = "Projects";

  private getProjectsFromLocalStorage(): Project[] {
    const projectsJSON = localStorage.getItem(this.STORAGE_KEY);
    if (projectsJSON) {
      try {
        return JSON.parse(projectsJSON);
      } catch (error) {
        console.error("Error parsing projects from local storage:", error);
        return [];
      }
    } else {
      return [];
    }
  }

  get(uuid: string): Project | undefined {
    const projects: Project[] = this.getProjectsFromLocalStorage();
    return projects.find((x) => x.uuid == uuid);
  }

  getAll(): Project[] {
    return this.getProjectsFromLocalStorage();
  }

  create(data: Project) {
    const projects: Project[] = this.getProjectsFromLocalStorage();
    projects.push(data);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }

  update(data: Project) {
    const projects: Project[] = this.getProjectsFromLocalStorage();
    const index = projects.findIndex((x) => x.uuid == data.uuid);
    if (index !== -1) {
      projects[index] = data;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    } else {
      console.error("Project not found for update:", data.uuid);
    }
  }

  delete(uuid: string): void {
    const projects: Project[] = this.getProjectsFromLocalStorage();
    const index = projects.findIndex((x) => x.uuid == uuid);
    if (index !== -1) {
      projects.splice(index, 1);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    } else {
      console.error("Project not found for deletion:", uuid);
    }
  }
}
