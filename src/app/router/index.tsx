import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import LiveQuizRoutes from "@/app/router/LiveRoutes";

const AuthGuard = lazy(() => import("@/features/auth/AuthGuard"));
const Config = lazy(() => import("@/features/config"));
const Join = lazy(() => import("@/features/join"));

const router = createBrowserRouter([
  {
    path: "",
    element: <AuthGuard />,
  },
  {
    path: "config/:quizId",
    element: <Config />,
  },
  {
    path: "join",
    element: <Join />,
  },
  {
    path: ":code",
    children: LiveQuizRoutes,
  },
]);

export default router;
