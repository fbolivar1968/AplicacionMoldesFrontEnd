import '../styles/globals.css'
//import SearchIcon from '@mui/icons-material/Search';
//import MenuIcon from '@mui/icons-material/Menu';
import Search from '../Components/Search.jsx';
import {useId} from 'react';


import * as React from 'react';
import useAxios from "../Hooks/useAxios/IndexAx.js";
import {useEffect} from "react";

export default function FilterForm() {
    const [selectedFilters, setSelectedFilters] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const selectId = useId();

    const {response, error, loading, fetchData} = useAxios();
    const urls = [
        "/api/maquinas/",
        "/api/herramental/",
        "/api/estanterias/",
        "api/estado_herramental/"
    ];
    useEffect(() => {
        fetchData({
            url: urls,
            method: "GET",
        });
    }, []);
    const [maquinas, herramental, estanterias,estado_herramental] = response || [[], [], [], []];

    //--------------------Debugging from console-------------------------------------

    console.log("RESPONSE", response);

    console.log("RESPONSE TYPE", typeof response);
    console.log("IS ARRAY?", Array.isArray(response));


    return (
        <form className="bg-orangeFB h-full hidden sm:block flex-col gap-3 px-5 py-6 shadow-3xl font-">
            <Search md/>
            <div>
                <div>
                    <label className="block p-2">Ubicación</label>
                    <select>
                        <option hidden>
                            Estante
                        </option>
                        {estanterias?.map((estanteria) => (
                            <option value={estanteria.es_NombreEstanteria}
                                    key={estanteria.es_NombreEstanteria}>{estanteria.es_NombreEstanteria}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className=" block p-2">N° máquina PP</label>
                    <select>
                        <option hidden>N° máquina PP</option>
                        {maquinas?.map((maquina) => (
                            <option value={maquina.id} key={maquina.id}>{maquina.numero}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Tipo de molde</label>
                    <select>
                        <option hidden>Tipo Herramental</option>
                        {herramental?.map((herramentales) => (
                            <option value={herramentales.id} key={herramentales.id}>{herramentales.nombre}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Estado</label>
                    <select className="">
                        <option hidden> Disponibilidad</option>
                        {estado_herramental?.map((estado) => (
                            <option value={estado.id} key={estado.id}>{estado.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-8">
                    <button className="btn btn-blue">Aplicar</button>
                    <button className="btn btn-blue">Limpiar</button>
                </div>
            </div>
        </form>

    )
}