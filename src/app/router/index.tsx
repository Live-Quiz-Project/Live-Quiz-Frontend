import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const AuthGuard = lazy(() => import("@/features/auth/AuthGuard"));
const Config = lazy(() => import("@/features/config"));
// const Join = lazy(() => import("@/features/participant/Join"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthGuard />,
    children: [
      {
        path: "config/:quizId",
        element: <Config />,
      },
      // {
      //   path: ":code",
      //   children: LiveQuizRoutes,
      // },
    ],
  },
  {
    path: "join",
    // element: <Join />,
  },
]);

export default router;
