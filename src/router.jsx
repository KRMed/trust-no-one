import { createBrowserRouter } from "react-router";
import StartGame from "./pages/start-game";
import Lobby from "./pages/lobby";
import ViewResponses from "./pages/view-responses";
import Win from "./pages/win";
import Lose from "./pages/lose";
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register';

export const router = createBrowserRouter([
    { path: "/", element: <LoginPage />},
    { path: "/lobby", element: <Lobby />},
    { path: "/lobby/view-responses", element: <ViewResponses />},
    { path: "/you-win", element: <Win />},
    { path: "/you-lose", element: <Lose />},
    { path: "/login", element: <LoginPage />},
    { path: "/register", element: <RegisterPage />},
    { path: "/start-game", element: <StartGame /> }
]);