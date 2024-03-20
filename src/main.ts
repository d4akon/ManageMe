import { Project, ProjectsApi } from "./api/projectsApi";
import { Priority, Status, Story, StoriesApi } from "./api/storiesApi";
import { User, UsersApi } from "./api/usersApi";

const projectApi = new ProjectsApi();
const storiesApi = new StoriesApi();
const usersApi = new UsersApi();
const project = new Project("Test project", "Description for new project");
const user = new User("Szymon", "Test");
const story = new Story(
  "Add new feature",
  "New feature desc",
  Priority.High,
  Status.ToDo,
  project.uuid,
  user.uuid
);

projectApi.create(project);
usersApi.create(user);
storiesApi.create(story);

const allStories = storiesApi.getAll();

console.table(allStories);
