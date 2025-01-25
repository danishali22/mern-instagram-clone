import './App.css'
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from './components/Signup';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Chat from './components/Chat';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/profile/:id",
        element: <Profile />
      },
      {
        path: "/account/edit",
        element: <EditProfile />
      },
      {
        path: "/chat",
        element: <Chat />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  }
]);

function App() {

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App
