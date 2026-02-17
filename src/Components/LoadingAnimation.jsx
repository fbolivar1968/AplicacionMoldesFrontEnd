import * as React from "react";
import FBIcon from "../assets/Icons/FBIcon.png";
import '../styles/globals.css'

export default function LoadingAnimation({message = ""}) {
    return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-white fixed top-0 left-0 z-50">
        <div className="relative">
            <img
                src={FBIcon}
                className="animate-pulse h-24 w-24 object-contain"
                alt="Loading..."
            />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-blueFB animate-pulse">
            Cargando {message}...
        </h2>
    </div>
);

}