import { Project, ProjectsApi } from "./api/projectsApi";
import { Priority, Status, Story, StoriesApi } from "./api/storiesApi";
import { User, Role, UsersApi } from "./api/usersApi";
import { UserService } from "./userService";

const projectApi = new ProjectsApi();
const storiesApi = new StoriesApi();
const usersApi = new UsersApi();
const project = new Project("Test project", "Description for new project");
const userAdmin = new User("Szymon", "Kowalski", "Test password", Role.Admin);
const userDevops = new User("Tadeusz", "Nowak", "Test password", Role.Devops);
const userDev = new User("Kacper", "Testowy", "Test password", Role.Developer);
const story = new Story(
  "Add new feature",
  "New feature desc",
  Priority.High,
  Status.ToDo,
  project.uuid,
  userDev.uuid
);

projectApi.create(project);
usersApi.create(userAdmin);
usersApi.create(userDevops);
usersApi.create(userDev);
storiesApi.create(story);

const allStories = storiesApi.getAll();

console.table(allStories);

UserService.loginUser(userAdmin);
