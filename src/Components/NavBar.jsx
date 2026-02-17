import '../styles/globals.css'
import React from "react";
import {Link} from "react-router-dom";

import logo from "../assets/Icons/FBIcon.png"
import Avatar from "@mui/material/Avatar";


export default function NavBar() {
    return (
        <nav className="flex justify-between w-full h-[10%] drop-shadow-md shadow-[4px] bg-[var(--color-blueFB)]">
            <ul className="flex items-center gap-6 text-white drop-shadow-md shadow-[4px] pl-1 m-1.5;">
                <Link to={"/VisualGnrl"}>
                    <img className="max-w-1/30 mx-4  transition-all hidden sm:flex" src={logo} alt="logo"/>
                </Link>

                <Link
                    to={"/UnderConstruction"}>
                    <li className="border-t-2 border-white py-0.5 hover:border-orangeFB"> Home</li>
                </Link>
                <Link to={"/UnderConstruction"}>
                    <li className="border-t-2 border-white py-0.5 hover:border-orangeFB">Moldes</li>
                </Link>
                <Link to={"/OrdAPiMold"}>
                    <li className="border-t-2 border-white py-0.5 hover:border-orangeFB">Ordenes</li>
                </Link>
            </ul>
            <ul className="flex justify-end p-1 gap-6 bg-blueFB hover:border-orangeFB text-white mr-6">
                <Link to={"/VisualGnrl"}>
                    <li className=" border-t-blueFB ">
                        <Avatar sx={{width: 24, height: 24}}>K</Avatar>
                    </li>
                </Link>
                <Link to={"/Login"}>
                    <li className="border-t-2 border-white py-0.5 hover:border-orangeFB">Log out</li>
                </Link>
            </ul>
        </nav>


    )
}