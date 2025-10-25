import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("profile", "routes/profile.tsx"),
  route("task", "routes/task.tsx"),
  route("login", "routes/login.tsx"),
] satisfies RouteConfig;