import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);
const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;