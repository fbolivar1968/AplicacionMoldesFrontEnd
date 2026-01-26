import '../styles/globals.css'
import NavBar from "../Components/NavBar.jsx";
import * as React from "react";
import useAxios from "../Hooks/useAxios/IndexAx.js";
import {useState} from "react";

const headers= [
    {

        id: 1,
        KEY: "MoldName",
        LABEL:"Nombre de molde",
    },
    {
        id: 2,
        KEY: "NumPD",
        LABEL:"Numero de pedido",
    },
    {
        id: 3,
        KEY: "OP",
        LABEL:"Orden de producción",

    },
    {
        id: 4,
        KEY: "InitDate",
        LABEL:"Fecha de inicio",
    },
    {
        id: 5,
        KEY: "MoldState",
        LABEL:"Estado del molde",
    },
    {
        id: 6,
        KEY: "Comment",
        LABEL:"Comentario",
    },
]

const data = [
    {

        id: 3,
        MoldName: "M-HX01",
        NumPD:"32552",
        OP: "87251",
        InitDate: "28/10/2025",
        MoldState:"Disponible",
        Comment: "APLASTAR\n" +
            "DEFORMAR ÚLTIMO FILETE DE LA\n" +
            "ROSCA"
    },
    {
        id: 9,
        MoldName: "M-HX01",
        NumPD:"32054",
        OP: "87245",
        InitDate: "15/10/2025",
        MoldState:"En reparación",
        Comment: "-MONTAR EN EL CENTRO DEL\n" +
            "TROQUEL\n" +
            "-NO SE MARCA EL GDO DE LA\n" +
            "TUERCA PORQUE NO ES VISIBLE\n" +
            "CUANDO SE DEFORMA EL FILETE."
    },
    {
        id: 5,
        MoldName: "M-HX01",
        NumPD:"32105",
        OP: "871654",
        InitDate: "02/05/2025",
        MoldState:"En fabricación",
        Comment: "REVISAR AJUSTE DE LA MAQUINA\n" +
            "CON LA QUE SE VA TROQUELAR LA\n" +
            "TUERCA\n"
    },
    {
        id: 2,
        MoldName: "M-HX01",
        NumPD:"32154",
        OP: "87046",
        InitDate: "07/01/2025",
        MoldState:"Por reparar",
        Comment: "APLASTAR\n" +
            "DEFORMAR ÚLTIMO FILETE DE LA\n" +
            "ROSCA",

    },
]
export default function Orders() {
    return (
        <>
            <NavBar/>

        <table className= "w-full table-fixed border-spacing-2 md:border-spacing-4 border-bg-blueFB bg-bg-blueFB">
            <thead className="bg-white border-b-2 border-light-greyFB">
                <tr>
                    {headers.map((header, index)=>(
                    <th className="p-3 text-sm text-blueFB font-bold tracking-wide text-left" key={index}>
                        <span>{header.LABEL}</span>
                    </th>
                ))}</tr>
            </thead>
            <tbody>
            {data.map((row, index) =>(
            <tr className="bg-white border-2 border-b-dark-greyFB " key={index}>
                {headers.map((header, index)=>{
                    return(
                    <td className="p-5 text-sm text-light-grayFB" key={index}>
                <span>{row[header.KEY]}</span>
                    </td>
                        )
                })}
            </tr>
            ))}
            </tbody>
        </table>
        </>
    )
}