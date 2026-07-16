import { createBrowserRouter } from "react-router";
import StartGame from "./pages/start-Game";
import Lobby from "./pages/Lobby";
import ViewResponses from "./pages/view-responses";
import Win from "./pages/Win";
import Lose from "./pages/lose";

export const router = createBrowserRouter([
    { path: "/", element: <StartGame />},
    { path: "/lobby", element: <Lobby />},
    { path: "/lobby/view-responses", element: <ViewResponses />},
    { path: "/you-win", element: <Win />},
    { path: "/you-lose", element: <Lose />},
]);