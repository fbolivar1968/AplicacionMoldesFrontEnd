import '../styles/globals.css'
import * as React from "react";
import NavBar from "../Components/NavBar.jsx";
import {Link} from "react-router-dom";
import Avatar from "@mui/material/Avatar";

export default function CreateUbic() {
    
    return (

        <>
            <NavBar/>
            <h1> Ubicación</h1>
            <form>
                <div className="grid grid-cols-[5, auto] grid-rows-[repeat(6,auto)] gap-4 w-screen h-screen m-5 ">
                        <div className="grid p-2 col-span-3 row-start-1 card-form">
                            <div className=" col-start-1 row-start-1">
                                <label className=" block p-2">N° máquina PP</label>
                                <select>
                                    <option value="" disabled selected>N° máquina PP</option>
                                </select>
                            </div>

                            <div className=" col-start-2 row-start-1">
                                <label className=" block p-2">N° máquina Opc</label>
                                <select className="">
                                    <option value="" disabled selected> N° máquina Opc</option>
                                </select>
                            </div>
                        </div>


                    <div
                        className="grid p-2 col-span-3 row-start-2 card-form">
                        <div className="col-start-1 row-start-2  ">
                            <label className=" block p-2">Piso</label>
                            <select className="">
                                <option option value="" disabled selected> Piso</option>
                            </select>
                        </div>
                        <div className=" col-start-2  row-start-2">
                            <label className=" block p-2">Estante</label>
                            <select className="">
                                <option option value="" disabled selected> Estante</option>
                                <option option value="" disabled selected> Estante</option>
                                <option option value="" disabled selected> Estante</option>
                            </select>
                        </div>
                        <div className="col-start-3 row-start-2  ">
                            <label className=" block p-2">Columna</label>
                            <select className="">
                                <option option value="" disabled selected> Columna</option>
                            </select>
                        </div>

                        <div className="col-start-4 row-start-2  ">
                            <label className=" block p-2">Fila</label>
                            <select className="">
                                <option option value="" disabled selected>Fila</option>
                            </select>
                        </div>

                        <div className="col-start-5 row-start-2  ">
                            <label className=" block p-2">Posición</label>
                            <select name="Posición" id="Position" className="">
                                <option option value="" disabled selected> Posición</option>
                            </select>
                        </div>


                        <div className="col-start-1 row-start-3  ">
                            <label className=" block p-2">DieSet</label>
                            <select className="">
                                <option option value="" disabled selected> DieSet</option>
                            </select>
                        </div>
                    </div>

                    <div
                        className="grid p-2 col-span-2 row-start-3 card-form">
                        <div className="col-start-1  row-start-4">
                            <label className=" block p-2">Disponibilidad</label>
                            <select className="">
                                <option option value="" disabled selected> Disponibilidad</option>
                            </select>
                        </div>

                        <div className="col-start-2 row-start-4">
                            <label className=" block p-2">Actividad Pendiente</label>
                            <select className="">
                                <option option value="" disabled selected> Actividad Pendiente</option>
                            </select>
                        </div>
                        <div className="col-start-3 row-start-4">
                            <label className=" block p-2">Existencia</label>
                            <input className="" type="number" placeholder="Existencia"/>
                        </div>
                    </div>

                    <Link to="/CreateMeasures" className="col-start-1 row-start-4">
                        <button className="btn btn-orange ">Atrás</button>
                    </Link>

                    <Link to="/VisualMold" className="col-start-4 row-start-4">
                        <button className="btn btn-orange">Finalizar</button>
                    </Link>
                </div>
            </form>
        </>
)
}
