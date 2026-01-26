import { StrictMode } from 'react'
import{createRoot} from 'react-dom/client'
import React from 'react'
import './Main.module.css'
import App from '../App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import VisualGnrl from "../VisualGnrl/VisualGnrl.jsx";
import Login from "../Login/Login.jsx";
import CreateGnrl from "../FormNewMold/CreateGnrl.jsx";
import CreateMeasures from "../FormNewMold/CreateMeasures.jsx";
import CreateUbic from "../FormNewMold/CreateUbic.jsx";
import VisualMold from "../MoldeHV/VisualMold.jsx";
import OrdAPiMold from "../Ordenes/OrdAPiMold.jsx";
import CreateMechanical from "../FormNewMold/CreateMechanical.jsx";



const router = createBrowserRouter([
    {path: '/', element: <App />},

    {path: '/VisualGnrl', element: <VisualGnrl />},

    {path: '/CreateGnrl', element: <CreateGnrl />},
    {path: '/CreateUbic', element: <CreateUbic />},
    {path: '/OrdAPiMold', element: <OrdAPiMold />},

    {path: '/CreateMeasures', element: <CreateMeasures />},
    {path: '/VisualMold', element: <VisualMold />},
    {path: '/CreateMechanical', element: <CreateMechanical />},
    {path: '/Login', element: <Login />},






    // {path: '*', element: <NotFoundPage />},

]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <RouterProvider router={router}/>
  </StrictMode>
);
