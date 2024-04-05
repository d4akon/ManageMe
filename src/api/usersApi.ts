import { Api } from "./api";

export class User {
  public readonly uuid: string;
  public name: string;
  public surname: string;
  public password: string;

  constructor(name: string, surname: string, password: string) {
    this.uuid = crypto.randomUUID();
    this.name = name;
    this.surname = surname;
    this.password = password;
  }
}

export class UsersApi implements Api<User> {
  private readonly STORAGE_KEY = "Users";

  private getUsersFromLocalStorage(): User[] {
    const usersJSON = localStorage.getItem(this.STORAGE_KEY);
    if (usersJSON) {
      try {
        return JSON.parse(usersJSON);
      } catch (error) {
        console.error("Error parsing users from local storage:", error);
        return [];
      }
    } else {
      return [];
    }
  }

  get(uuid: string): User | undefined {
    const users: User[] = this.getUsersFromLocalStorage();
    return users.find((x) => x.uuid == uuid);
  }

  getAll(): User[] {
    return this.getUsersFromLocalStorage();
  }

  create(data: User) {
    const users: User[] = this.getUsersFromLocalStorage();
    users.push(data);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }

  update(data: User) {
    const users: User[] = this.getUsersFromLocalStorage();
    const index = users.findIndex((x) => x.uuid == data.uuid);
    if (index !== -1) {
      users[index] = data;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    } else {
      console.error("User not found for update:", data.uuid);
    }
  }

  delete(uuid: string): void {
    const users: User[] = this.getUsersFromLocalStorage();
    const index = users.findIndex((x) => x.uuid == uuid);
    if (index !== -1) {
      users.splice(index, 1);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    } else {
      console.error("User not found for deletion:", uuid);
    }
  }
}
