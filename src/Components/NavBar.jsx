import '../styles/globals.css'
import React from "react";
import { Link } from "react-router-dom";

import logo from "../assets/Icons/FBIcon.png"
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../Context/AuthContext";
const UserAvatar = ({ username }) => {
    // Get the first letter, handle cases where the username might be empty
    const initial = username ? username.charAt(0).toUpperCase() : '?';
    return initial;
}

export default function NavBar() {
    const { user } = useAuth();


    return (
        <nav className="flex justify-between drop-shadow-md shadow-[4px] bg-[var(--color-blueFB)] w-auto h-[40px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center gap-6 text-white drop-shadow-md shadow-[4px] pl-1 m-5;">
                <Link to={"/VisualGnrlv2"}>
                    <img className="max-w-1/30 mx-4  transition-all hidden sm:flex" src={logo} alt="logo" />
                </Link>

                <Link
                    to={"/VisualGnrlv2"}>
                    <li className="border-t-2 border-white py-0.5 hover:border-orangeFB">Inicio</li>
                </Link>
                {user && user.user_type !== 3 && (
                    <Link to={"/CreateGnrlv1"}>
                        <li className="border-t-2 border-white py-0.5 hover:border-orangeFB">Crear Nuevo</li>
                    </Link>
                )}
                <Link to={"/OrdAPiMold"}>
                    <li className="border-t-2 border-white py-0.5 hover:border-orangeFB">Ordenes</li>
                </Link>
            </ul>
            <ul className="flex justify-end p-1 gap-6 bg-blueFB hover:border-orangeFB text-white mr-6">
                <Link to={"/Login"}>
                    <li className=" border-t-blueFB ">
                        <Avatar sx={{ width: 24, height: 24 }}>{<UserAvatar username={user?.username} />}</Avatar>
                    </li>
                </Link>
                <Link to={"/Login"}>
                    <li className="border-t-2 border-white py-0.5 hover:border-orangeFB">Salir</li>
                </Link>
            </ul>
        </nav>


    )
}