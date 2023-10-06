import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from './App.jsx';
import Home from './pages/Home';
// import Signup from './pages/Signup';
// import Login from './pages/Login';
// import SingleStar from './pages/SingleStar';
// import Profile from './pages/Profile';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />  // Where the star list go - conditionally 
      }, 
      // {
      //   path: '/login',
      //   element: <Login />
      // }, {
      //   path: '/signup',
      //   element: <Signup />
      // }, 
      // {
      //   path: '/profiles/:username',
      //   element: <Profile />
      // },
      // {
      //   path: '/me',
      //   element: <Profile />   // TODO - might not need this
      // },
      // {
      //   path: '/stars/:starId',  // TODO - not sure this is necessary
      //   element: <SingleStar />
      // }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
