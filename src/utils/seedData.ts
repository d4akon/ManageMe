import { StoriesApi, Story, Priority, Status } from "../api/storiesApi";
import { UsersApi, User, Role } from "../api/usersApi";
import { ProjectsApi, Project } from "../api/projectsApi";

export function seedData() {
  const storiesApi = new StoriesApi();
  const usersApi = new UsersApi();
  const projectsApi = new ProjectsApi();

  const sampleProjectsData = [
    new Project("Project 1", "Desc pro1", true),
    new Project("Project 2", "Desc pro2"),
  ];

  sampleProjectsData.forEach((project) => {
    projectsApi.create(project);
  });

  const exampleUsers = [
    new User("John", "Doe", "password123", Role.Developer),
    new User("Jane", "Smith", "password456", Role.Devops),
    new User("Alice", "Johnson", "password789", Role.Admin),
  ];

  exampleUsers.forEach((user) => {
    usersApi.create(user);
  });

  const exampleStories = [
    new Story(
      "Implement feature X",
      "Description of feature X",
      Priority.High,
      Status.ToDo,
      sampleProjectsData[0].uuid,
      exampleUsers[0].uuid
    ),
    new Story(
      "Fix bug Y",
      "Description of bug Y",
      Priority.Medium,
      Status.Doing,
      sampleProjectsData[0].uuid,
      exampleUsers[0].uuid
    ),
    new Story(
      "Refactor module Z",
      "Description of module Z",
      Priority.Low,
      Status.Done,
      sampleProjectsData[0].uuid,
      exampleUsers[0].uuid
    ),
  ];

  exampleStories.forEach((story) => {
    storiesApi.create(story);
  });
}
