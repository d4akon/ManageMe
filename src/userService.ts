import { User } from "./api/usersApi";

export class UserService {
  private static readonly USER_KEY = "loggedInUser";

  private static loggedInUser: User | null = null;

  static loginUser(user: User) {
    this.loggedInUser = user;
    localStorage.setItem(UserService.USER_KEY, JSON.stringify(user));
  }

  static logoutUser() {
    this.loggedInUser = null;
    localStorage.removeItem(UserService.USER_KEY);
  }

  static isLoggedIn(): boolean {
    return localStorage.getItem(UserService.USER_KEY) !== null;
  }

  static getLoggedInUser(): User | null {
    const userJSON = localStorage.getItem(UserService.USER_KEY);
    return userJSON ? JSON.parse(userJSON) : null;
  }

  static registerUser(user: User): boolean {
    const existingUser = UserService.getLoggedInUser();
    if (existingUser) {
      console.error(
        "A user is already logged in. Please log out before registering a new user."
      );
      return false;
    } else {
      localStorage.setItem(UserService.USER_KEY, JSON.stringify(user));
      return true;
    }
  }
}
