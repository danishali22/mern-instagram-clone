import './App.css'
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from './components/Signup';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Chat from './components/Chat';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';

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
  const {user} = useSelector((store) => store.auth);
  const {socket} = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  useEffect(()=> {
    if(user){
      const socketio = io("http:localhost:4000", {
        query : {
          userId: user?._id
        },
        transports: ["websocket"]
      });
      dispatch(setSocket(socketio));

      //listen all the events
      socketio.on("getOnlineUsers", (onlineUser) => {
        dispatch(setOnlineUsers(onlineUser));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    }
    else if(socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch, socket]);
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App
