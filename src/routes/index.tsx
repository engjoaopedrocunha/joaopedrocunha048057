import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
// Mapa de navegação do app. Se criar uma página nova, tem que registrar o caminho aqui.
const Home = lazy(() => import("../pages/Home"));
const PetDetail = lazy(() => import("../pages/PetDetail"));
const TutorDetail = lazy(() => import("../pages/TutorDetail"));
const PetForm = lazy(() => import("../pages/PetForm"));
const TutorForm = lazy(() => import("../pages/TutorForm"));

export const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/pet/:id", element: <PetDetail /> },
  { path: "/tutor/:id", element: <TutorDetail /> },
  { path: "/pet-form/:id?", element: <PetForm /> },
  { path: "/tutor-form/:id?", element: <TutorForm /> },
];
