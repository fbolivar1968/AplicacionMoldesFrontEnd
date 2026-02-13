import '../styles/globals.css'
import Avatar from "@mui/material/Avatar";
import * as React from "react";
import {Link} from "react-router-dom";
import CreateMeasures from "./CreateMeasures.jsx";
import NavBar from "../Components/NavBar.jsx";
import useAxios from "../Hooks/useAxios/IndexAx.js";
import {useEffect, useState} from "react";
import QRCode from "react-qr-code";



export default function CreateGnrl() {

    const [Altern, setAltern] = useState(" ");
    //Handle state for Herramental
    const [Herramental, setHerramental] = useState(" ");
    const [CHerramental, setCHerramental] = useState("");

    const handleHerramentalChange = (e) => {
        const selectedId = e.target.value;

//-----------Description builder---------------------------------------
        const selectedItem = herramentales.find(item => item.id === parseInt(selectedId));

        if (selectedItem) {
            setHerramental(selectedItem.nombre);      // For display in Description
            setCHerramental(selectedItem.codigo); // Store the 'ES', 'RG', etc.
        }
    };
//----------------------------------------------------------------------
    // Handle state for TipoHerramental
    const [TipoHerramental, setTipo] = useState(" ");
    const [CTipoHerramental, setCTipo] = useState("");

    const handleTipoChange = (e) => {
        const selectedId = e.target.value;

        // Find the item in the  tipo_herramental tipo_herramental array that matches the selected ID
        const selectedItem = tipo_herramental.find(item => item.id === parseInt(selectedId));

        if (selectedItem) {
            setTipo(selectedItem.nombre);      // For display in Description
            setCTipo(selectedItem.codigo); // Store the 'ES', 'RG', etc.
        }
    };


    // Handle state for Family
    const [Familia, setFamilia] = useState(" ");
    const [CFamilia, setCFamilia] = useState("");

    const handleFamiliaChange = (e) => {
        const selectedId = e.target.value;

        // Find the item in the  Familia array that matches the selected ID
        const selectedItem = familias.find(item => item.id === parseInt(selectedId));

        if (selectedItem) {
            setFamilia(selectedItem.nombre);      // For display in Description
            setCFamilia(selectedItem.codigo); // Store the 'ES', 'RG', etc.
        }
    };


    //---------------Fetch data from endpoint ---------------------------
    const {response, error, loading, fetchData} = useAxios();
    const urls = [
        "/api/tipo_herramental/",
        "/api/familia/",
        "api/herramental/"
    ];

    useEffect(() => {
        fetchData({
            url: urls,
            method: "GET",
        });
    }, []);
    const [tipo_herramental, familias, herramentales] = response || [[], [], []];

//--------------QR Generation--------------------------------------------------------
    const [Description, setDescription] = useState(" ");

    useEffect(() => {
        const fullDesc = `Herramental ${Herramental} tipo ${TipoHerramental} de la Familia ${Familia} con código alterno ${Altern}`;
        setDescription(fullDesc);
    }, [Herramental, TipoHerramental, Familia, Altern]);

    //--------------------Debugging from console-------------------------------------

    console.log("RESPONSE", response);

    console.log("RESPONSE TYPE", typeof response);
    console.log("IS ARRAY?", Array.isArray(response));
// ----------------------------------------------------------------------------------

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <>
            <NavBar/>
            <h1> Información General</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-full m-5">
                <div>
                    <div>
                        <label className="block p-2">Tipo Herramental</label>
                        <select onChange={handleHerramentalChange}>
                            <option hidden> Seleccione Herramental</option>
                            {herramentales?.map((item) => (
                                <option value={item.id} key={item.id}>{item.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block p-2">Función Molde</label>
                        <select onChange={handleTipoChange}>
                            <option hidden> Seleccione Función Herramental</option>
                            {tipo_herramental?.map((type) => (
                                <option value={type.id} key={type.id}>{type.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block p-2"> Familia Herramental</label>
                        <select onChange={handleFamiliaChange}>
                            <option hidden> Seleccione familia Herramental</option>
                            {familias?.map((item) => (
                                <option value={item.id} key={item.id}>{item.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-8">

                    <div className="space-y-4 md:col-start-2 ">
                        <div className="">
                            <label className="block p-2"> Código alterno</label>
                            <input type="text" placeholder="Código alterno"
                                   onChange={(e) => setAltern(e.target.value)}/>
                        </div>
                        <div>
                            <h3>Descripción 1</h3>
                            <p className="uppercase"> {Description} </p>
                            <h3>Código QR </h3>

                            <div className="flex pt-10 pb-12">
                                <QRCode
                                    size={256}
                                    style={{height: "auto", maxWidth: "20%", width: "20%"}}
                                    value={Description}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>

                        </div>
                        <span className="m-0 text-2xl text-blueFB">Código Final</span>
                        <h4>{CHerramental}{CTipoHerramental}-{CFamilia}</h4>

                    </div>
                </div>

                <Link to="/VisualGnrl" className="">
                    <button className="btn btn-orange col-start-1 row-start-2">Atrás</button>
                </Link>
                <Link to="/CreateMeasures">
                    <button onClick={CreatePost("api/herramental_esp",data)}
                        className="btn btn-orange grid-col-2 row-start-2 sm:col-start-2 flex justify-end">Continuar
                    </button>
                </Link>

            </form>
        </>
    )
}