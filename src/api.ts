export class ApiProject {
  constructor() {}

  getProject(key: string): Project {
    const response: Project = JSON.parse(localStorage.getItem(key) || "");
    return response;
  }

  createProject(project: Project): boolean {
    localStorage.setItem(project.uuid, JSON.stringify(project));
    return true;
  }

  removeProject(key: string): boolean {
    localStorage.removeItem(key);
    return true;
  }

  editProject(project: Project): boolean {
    localStorage.setItem(project.uuid, JSON.stringify(project));
    return true;
  }
}

export class Project {
  uuid: string;
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.uuid = self.crypto.randomUUID();
    this.name = name;
    this.description = description;
  }
}
