import '../styles/globals.css'

import * as React from "react";
import NavBar from "../Components/NavBar.jsx";
import {Link} from "react-router-dom";
import Avatar from "@mui/material/Avatar";

export default function VisualMold() {
    const moldeID = "MES-RE19";
    return (
        <>
        <NavBar/>


        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-auto grid-rows-[2,auto]  gap-5 w-scree h-screen m-15 font-[Poppins]">

            <div className="col-start-1 row-start-1 font-bold ">
                <h1>Hoja de vida molde {moldeID}</h1>
                <Avatar
                    alt={moldeID}
                    src="src/assets/MoldesImg/420.jpg"
                    sx={{width: 300, height: 500}}
                    variant="rounded"
                    className="col-start-1 row-start-1"

                />
            </div>

            <div className="col-start-1 row-start-2 ">
                <h2>Estilo de Molde:</h2>
                <h2>Tipo Molde Interior:</h2>
                <h2>Forma Exterior Molde:</h2>
                <h2>Semi-Elaborado:</h2>
                <h2>Caraterísticas:</h2>
                <h2>Copas:</h2>
                <h2>Naríz : </h2>
                <h2> Die-Set: 1005</h2>
                <h2>Tipo de máquina:</h2>
                <h2> Maq. Principal: </h2>
                <h2> N° Maq. Opcional: 26 </h2>


                <Link to="/Orders" className="col-start-1 row-start-5">
                    <button className="btn btn-orange ">Historial producción</button>
                </Link>
            </div>

            <div className="col-start-2 row-start-1 gap-6 ">
            <div className="grid grid-cols-2 grid-rows-[1/2fr,auto,auto] ">
                <div className="col-span-2 row-start-1 flex flex-row items-center self-center">
                    <Avatar
                        alt={moldeID}
                        src="src/assets/MoldesImg/QR420.png"
                        sx={{width: 80, height: 80}}
                        variant="rounded"
                        className=""
                    />
                    <h1 className="text-orangeFB pl-2"> {moldeID}</h1>
                </div>

                    <div className="col-start-1 row-start-2">
                        <h2> Ubicación Molde: </h2>
                        <h2> Piso: 1</h2>
                        <h2> Fila: 2</h2>
                        <h2> Celda: 5</h2>
                        <h2> Posición: 3</h2>
                        <h2> Existencia: 1</h2>
                    </div>
                    <div className="col-start-2 row-start-2">
                        <h2> Ubicación Die-Set: </h2>
                        <h2> Piso: 1</h2>
                        <h2> Fila: 2</h2>
                        <h2> Celda: 5</h2>
                        <h2> Posición: 3</h2>
                        <h2> Existencia: 1</h2>
                    </div>
                </div>
                <div className=" col-span-2 row-start-3 pt-2">
                    <h2>Estado Actual Molde: </h2>
                    <h2>Actividad pendiente: </h2>
                    <ol className="list-decimal list-inside p-2">
                        <li>Actividad 1</li>
                    </ol>
                </div>
            </div>




        <div className="col-start-2 row-start-2 justify-items-center">
            <h3>Esquema Familia Hex</h3>
            <img className="col-start-1 row-start-2" alt="esquema" src="../assets/Schemas/SquemaBristol.png"/>



            <h2>Dimensiones</h2>
            <div className="flex justify-around  space-x-8 p-2">
                <span className="dimensions-card">A:</span>
                <span className="dimensions-card">B:</span>
                <span className="dimensions-card">C:</span>
                <span className="dimensions-card">D:</span>
                <span className="dimensions-card">H-Cono:</span>
                <span className="dimensions-card">H-Pestaña:</span>
                <span className="dimensions-card">Nariz:</span>
                <div/>


            </div>
        </div>

        <div className="col-start-3 row-start-1">
            <Link to="/CreateGnrl" className="justify-self-end">
                <button className="btn btn-orange ">Editar</button>
            </Link>

            <div className="card-Mechanics ">
                <h3>Características Mecánicas</h3>
                <span>Fecha de elaboración: </span>
                <span>Material: </span>
                <span>Tratamiento térmico: </span>
                <p >Lorem ipsum dolor sit amet consectetur adipiscing elit suscipit eget, neque vulputate laoreet
                    hac proin vestibulum duis dictumst scelerisque lacinia, conubia sociis est bibendum
                    imperdiet massa dis fames. .</p>

            </div>
        </div>

        <div className="col-start-3 row-start-2">

            <h3>Observaciones:</h3>
            <p className="w-100 h-auto">Lorem ipsum dolor sit amet consectetur adipiscing elit suscipit eget, neque vulputate laoreet
                hac proin vestibulum duis dictumst scelerisque lacinia, conubia sociis est bibendum
                imperdiet massa dis fames. Platea varius aptent a nisl, suspendisse cum phasellus fringilla
                at, senectus ultricies fusce.</p>

            <Link to="/VisualGnrl" className="">
                <button className="btn btn-orange">Ver Plano</button>
            </Link>
        </div>


        </div>


</>
)
}