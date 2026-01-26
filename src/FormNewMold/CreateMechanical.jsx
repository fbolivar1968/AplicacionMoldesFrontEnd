import * as React from "react";
import NavBar from "../Components/NavBar.jsx";
import {Link} from "react-router-dom";
import '../styles/globals.css'


export default function CreateMechanical() {
    return (

        <>
            <NavBar/>
            <h1>Propiedades mecánicas</h1>
            <form className="grid grid-cols-1 md: grid-cols-2 grid-rows-2 gap-6 max-w-full m-5">
                <div className="space-y-8">

                    <div className="col-start-1 row-start-1">
                        <div>
                            <label className=" block p-2">Acero</label>
                            <select className="">
                                <option value="" disabled selected> Acero</option>
                            </select>
                        </div>
                        <div>
                            <label className=" block p-2">Tto Térmico</label>
                            <select className="">
                                <option value="" disabled selected> Tto Térmico</option>
                            </select>
                        </div>

                        <div>
                            <label className=" block p-2">Dureza RC</label>
                            <select className="">
                                <option value="" disabled selected> HRC</option>
                            </select>
                        </div>
                        <div>
                            <label className=" block p-2">Proveedor</label>
                            <select className="">
                                <option value="" disabled selected> Proveedor</option>
                            </select>
                        </div>
                    </div>
                </div>
                {/*------------------------------*/}
                <div>
                    <div className="col-start-2 row-start-1">

                        <label className="block p-1">Precio</label>
                        <input type="number" inputMode="numeric" placeholder="$Precio"/>
                        <label className=" block p-1">Fecha de creación</label>
                        <input type="date" inputMode="date" placeholder="Create Date "/>
                        <label className=" block">Observaciones</label>
                        <textarea name="txt" id="" className="h-30 w-[100%]" rows={10}></textarea>

                    </div>
                </div>

                {/*-----------------Buttons---------------------------------------- */}

                <Link to="/Createubic" className="col-start-3 row-start-2">
                    <button className="btn btn-orange">Continuar</button>
                </Link>

                <Link to="/CreateMeasures" className="col-start-1 row-start-2">
                    <button className="btn btn-orange justify-self-end">Atrás</button>
                </Link>
            </form>
        </>
    )
}
