import '../styles/globals.css'
import * as React from "react";
import NavBar from "../Components/NavBar.jsx";
import {Link} from "react-router-dom";
import useAxios from "../Hooks/useAxios/IndexAx.js";
import {useEffect, useState} from "react";
import DropDown from "../Components/DropDown.jsx";
import LoadingButton from "../Components/LoadingButton.jsx";
import Avatar from "@mui/material/Avatar";

export default function CreateUbic() {
    const [NumPP, setNumPP] = useState(" ");
    const [NumOpc, setNumOpc] = useState(" ");

    //---------------Fetch data from endpoint ---------------------------
    const {response, error, loading, fetchData} = useAxios();
    const urls = [
        "/api/maquinas/",
        "/api/actividades/",
        "/api/estanterias/",
        "/api/pisos/",
        "api/estado_herramental/"
    ];
    useEffect(() => {
        fetchData({
            url: urls,
            method: "GET",
        });
    }, []);
    const [maquinas,actividades, estanterias,pisos, estado_herramental] = response || [[],[],[],[],[]];
    const Estanteria = [...Array(23).keys()].map(e =>e+1);

    //--------------------Debugging from console-------------------------------------

    console.log("RESPONSE", response);

    console.log("RESPONSE TYPE", typeof response);
    console.log("IS ARRAY?", Array.isArray(response));

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
                                <option hidden>N° máquina PP</option>
                                {maquinas?.map((maquina) => (
                                    <option value={maquina.id} key={maquina.id}>{maquina.numero}</option>
                                ))}
                            </select>
                        </div>

                        <div className=" col-start-2 row-start-1">
                            <label className=" block p-2">N° máquina Opc</label>
                            <select className="">
                                <option hidden> N° máquina Opc</option>
                                {maquinas?.map((maquina) => (
                                    <option value={maquina.id} key={maquina.id}>{maquina.numero}</option>
                                ))}
                            </select>
                        </div>
                    </div>


                    <div
                        className="grid p-2 col-span-3 row-start-2 card-form">
                        <div className="col-start-1 row-start-2  ">
                            <label className=" block p-2">Piso</label>
                            <select className="">
                                <option hidden> Piso</option>
                                {pisos?.map((piso) => (
                                    <option value={piso.pi_NumeroPiso}
                                            key={piso.pi_NumeroPiso}>{piso.pi_DescripcionPiso}</option>
                                ))}
                            </select>
                        </div>
                        <div className=" col-start-2 row-start-2">
                            <label className=" block p-2">Estante</label>
                            <select className="">
                                <option hidden> Estante</option>
                                {estanterias?.map((estante) => (
                                    <option value={estante.es_NombreEstanteria}
                                            key={estante.es_NombreEstanteria}>{estante.es_NombreEstanteria}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-start-3 row-start-2  ">
                            <label className=" block p-2">Columna</label>
                            <DropDown length={31} start={0}/>
                        </div>

                        <div className="col-start-4 row-start-2  ">
                            <label className=" block p-2">Fila</label>
                            <DropDown length={8} start={0}/>
                        </div>

                        <div className="col-start-5 row-start-2  ">
                            <label className=" block p-2">Posición</label>
                            <DropDown length={22} start={0}/>
                        </div>


                        <div className="col-start-1 row-start-3  ">
                            <label className=" block p-2">DieSet</label>
                            <select className="">
                                <option option value="" disabled selected> DieSet</option>
                            </select>
                        </div>

                        <div className="col-start-2 row-start-3  ">
                            <label className=" block p-2">Piso</label>
                            <select className="">
                                <option hidden> Piso</option>
                                {pisos?.map((piso) => (
                                    <option value={piso.pi_NumeroPiso}
                                            key={piso.pi_NumeroPiso}>{piso.pi_DescripcionPiso}</option>
                                ))}
                            </select>
                        </div>
                        <div className=" col-start-3 row-start-3">
                            <label className=" block p-2">Estante</label>
                            <select className="">
                                <option hidden> Estante</option>
                                {estanterias?.map((estante) => (
                                    <option value={estante.es_NombreEstanteria}
                                            key={estante.es_NombreEstanteria}>{estante.es_NombreEstanteria}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-start-4 row-start-3  ">
                            <label className=" block p-2">Columna</label>
                                <DropDown length={31} start={0}/>


                        </div>

                        <div className="col-start-5 row-start-3  ">
                            <label className=" block p-2">Fila</label>
                            <DropDown length={8} start={0}/>
                        </div>

                        <div className="col-start-6 row-start-3  ">
                            <label className=" block p-2">Posición</label>
                            <DropDown length={22} start={0}/>
                        </div>
                    </div>

                    <div
                        className="grid p-2 col-span-2 row-start-3 card-form">
                        <div className="col-start-1  row-start-4">
                            <label className=" block p-2">Disponibilidad</label>
                            <select className="">
                                <option hidden> Disponibilidad</option>
                                {estado_herramental?.map((estado) => (
                                    <option value={estado.id} key={estado.id}>{estado.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-start-2 row-start-4">
                            <label className=" block p-2">Actividad Pendiente</label>
                            <select className="">
                                <option hidden> Actividad Pendiente</option>
                                {actividades?.map((actividad) => (
                                    <option value={actividad.id} key={actividad.id}>{actividad.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-start-3 row-start-4">
                            <label className=" block p-2">Existencia</label>
                            <input className="" type="number" placeholder="Existencia"/>
                        </div>
                    </div>

                    <loadingButton/>

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
