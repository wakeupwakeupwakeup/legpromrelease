import React from 'react'
import ReactDOM from 'react-dom/client'
import '@styles/globals.scss'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Root from "./components/routing/root.jsx";
import {Provider} from "react-redux";
import { store } from "@store/store.js"
import HomeProfile from "@/pages/profile/home.jsx";
import NoLayout from "@/pages/nolayout.jsx";
import VKIDtokenpage from "@/pages/VKIDtokenpage.jsx";
import PrivateRoute from "@components/routing/privateRoute.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
    },
    {
        path: "/nolayout",
        element: <NoLayout />
    },
    {
        path: "/profile",
        element: <PrivateRoute><HomeProfile /></PrivateRoute>,
        children: [
            {
                path: "home",
                element: <HomeProfile/>
            }

        ]
    },
    {
        path: "/VKIDtokenpage",
        element: <VKIDtokenpage />
    },
    // {
    //     path: "/yatokenpage",
    //     element: <Yatokenpage />
    // }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Provider store={store}>
          <RouterProvider router={router} />
      </Provider>
            </React.StrictMode>,
)
