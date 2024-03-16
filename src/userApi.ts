import { Api } from "./api";

export class User {
  constructor(
    public uuid: string = crypto.randomUUID(),
    public name: string,
    public surname: string
  ) {}
}

export class UserApi implements Api<User> {
  get(uuid: string): User {
    const response: User = JSON.parse(localStorage.getItem(uuid) || "");
    return response;
  }
  getAll(): User[] {
    throw new Error("Method not implemented.");
  }
  create(data: User) {
    localStorage.setItem(data.uuid, JSON.stringify(data));
  }
  update(data: User) {
    localStorage.setItem(data.uuid, JSON.stringify(data));
  }
  delete(uuid: string): void {
    localStorage.removeItem(uuid);
  }
}
