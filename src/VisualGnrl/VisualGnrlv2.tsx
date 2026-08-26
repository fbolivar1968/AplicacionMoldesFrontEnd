import '../styles/globals.css'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { blue } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import FilterForm from './FilterForm.js';
import { Link } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";
import ChecklistIcon from '@mui/icons-material/Checklist';
import LoadingAnimation from "../Components/LoadingAnimation.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.js";
//***********************************************************

import useAxios from "../Hooks/useAxios/IndexAx.js";
import { useEffect, useState, useMemo } from "react";
import Stack from "@mui/material/Stack";
import { FETCH_STATUS } from "../Hooks/useAxios/FetchStatus.js";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
} from '@tanstack/react-table';
import Pagination from "@mui/material/Pagination";
import useToolImage from "../Hooks/useToolImage.js";
import useToolQrCode from "../Hooks/useToolQrCode.js";
import QRCode from "react-qr-code";
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';


export default function VisualGnrlv2() {
    const { user } = useAuth();
    const { response, error, status, fetchData } = useAxios(); //Response stores the data fetched from API
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([])
    const [filters, setFilters] = useState<any>({});
    const isLoading = status === FETCH_STATUS.LOADING;
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        try {
            // Clean out default 0 values and empty/null values
            const cleanParams = Object.keys(filters).reduce((acc, key) => {
                const val = filters[key];
                if (val !== 0 && val !== '' && val !== null && val !== undefined) {
                    acc[key] = val;
                }
                return acc;
            }, {} as any);

            fetchData({
                url: '/api/herramental_especifico/',
                method: "GET",
                params: cleanParams,
            });
        } catch (err) {
            console.error("Error al solicitar datos:", err);
            alert("Error al cargar los datos del servidor.");
        }
    }, [filters, fetchData]);

    // Apply client-side filter fallback (ideal for mock testing and backend variations)
    const filteredData = useMemo(() => {
        try {
            if (!response || !Array.isArray(response)) return [];
            return response.filter((item: any) => {
                // 1. Tipo de Herramental
                if (filters.hesp_IdTipoHerramental) {
                    const selId = Number(filters.hesp_IdTipoHerramental);
                    const itemVal = item.hesp_IdTipoHerramental;
                    if (itemVal !== undefined && itemVal !== null) {
                        if (Number(itemVal) !== selId) return false;
                    } else {
                        const mockTiposMap: Record<number, string> = {
                            1: "Troquel (T)",
                            2: "Molde (M)",
                            3: "Copa (C)"
                        };
                        if (item.nombre_tipo_herramental !== mockTiposMap[selId]) return false;
                    }
                }
                // 2. Familia
                if (filters.hesp_IdFamilia) {
                    const selId = Number(filters.hesp_IdFamilia);
                    const itemVal = item.hesp_IdFamilia;
                    if (typeof itemVal === 'string') {
                        const mockCodes: Record<string, number> = { "HX": 3, "CU": 4, "RE": 5 };
                        if (mockCodes[itemVal] !== selId) return false;
                    } else if (itemVal !== undefined && itemVal !== null) {
                        if (Number(itemVal) !== selId) return false;
                    } else {
                        return false;
                    }
                }
                // 3. Máquina PP
                if (filters.num_maquina_pp) {
                    const selId = Number(filters.num_maquina_pp);
                    const itemVal = item.num_maquina_pp;
                    if (itemVal !== undefined && itemVal !== null) {
                        if (Number(itemVal) !== selId) return false;
                    } else {
                        return false;
                    }
                }
                // 4. Estantería (Ubicación)
                if (filters.hesp_IdEstanteria) {
                    const selId = Number(filters.hesp_IdEstanteria);
                    const itemVal = item.hesp_IdEstanteria;
                    if (itemVal !== undefined && itemVal !== null) {
                        if (Number(itemVal) !== selId) return false;
                    } else {
                        return false;
                    }
                }
                // 5. DieSet
                if (filters.hesp_IdDieSet) {
                    const selId = Number(filters.hesp_IdDieSet);
                    const itemVal = item.hesp_IdDieSet;
                    if (itemVal !== undefined && itemVal !== null) {
                        if (Number(itemVal) !== selId) return false;
                    } else {
                        return false;
                    }
                }
                return true;
            });
        } catch (err) {
            console.error("Error al filtrar:", err);
            alert("Ocurrió un error al filtrar los herramentales.");
            return [];
        }
    }, [response, filters]);

    // Track if any filter or search is active
    const hasActiveFilters = useMemo(() => {
        const hasGlobal = Boolean(globalFilter && globalFilter.trim() !== '');
        const hasFormFilters = Boolean(
            filters && Object.keys(filters).some(key => {
                const val = filters[key];
                return val !== 0 && val !== '' && val !== null && val !== undefined;
            })
        );
        return hasGlobal || hasFormFilters;
    }, [globalFilter, filters]);

    const handleResetAllFilters = () => {
        if (confirm("No se encontro ningun herramental con los filtros seleccionados.")) {
            setGlobalFilter('');
            setFilters({});
        }
    };

    //Define (Memoizing) Columns
    const columns = useMemo(() => [
        {
            header: 'id',
            accessorKey: 'hesp_IdHerramentalEspecifico',
        },
        {
            header: 'name',
            accessorKey: 'hesp_CodigoHerramental',
        },
        {
            header: 'machine',
            accessorKey: 'num_maquina_pp',
        },
        {
            header: 'state',
            accessorKey: 'nombre_estado_Herr',
        },
        {
            header: 'image',
            accessorKey: 'hesp_IdImagen',
            cell: ({ getValue }) => {
                const idImagen = getValue() as number;
                return <TableImage idImagen={idImagen} />;
            }
        },

        {
            header: 'QR',
            cell: ({ row }) => {
                const toolData = row.original;
                return <TableQrCode toolData={toolData} />;
            }
        }

    ], []);

    //DEBUGGING

    // fetch('http://localhost:8000/api/herramental_especifico/')
    //     .then(res => res.json())
    //     .then(data => console.log('API RESPONSE:', data))
    //     .catch(err => console.error('API ERROR:', err));
    //-----------------------------------------------------------------0
    console.log("RESPONSE", response);

    console.log("RESPONSE TYPE", typeof response);
    console.log("IS ARRAY?", Array.isArray(response));

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            globalFilter,
            sorting,
        },
        onGlobalFilterChange: setGlobalFilter, //Owns globalFilter state
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
        getSortedRowModel: getSortedRowModel(),
    });

    // Alert the user when search/filters yield no results
    useEffect(() => {
        try {
            if (!isLoading && response && Array.isArray(response) && hasActiveFilters) {
                const totalFound = table.getFilteredRowModel().rows.length;
                if (totalFound === 0) {
                    if (globalFilter && globalFilter.trim() !== '') {
                        handleResetAllFilters();
                        //alert(`No se encontró ningún herramental con el término "${globalFilter}".`);
                    } else {
                        handleResetAllFilters();
                    }
                }
            }
        } catch (err) {
            console.error("Error al verificar los resultados de búsqueda:", err);
            alert("Ocurrió un error al verificar los resultados de los filtros.");
        }
    }, [globalFilter, filters, response, isLoading, hasActiveFilters, table]);


    if (isLoading) {
        return <LoadingAnimation message="Moldes" />;

    }

    if (error) {
        const errorMessage = typeof error === 'object'
            ? (error.message || JSON.stringify(error))
            : String(error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 text-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-lg">
                    <h3 className="text-lg font-bold text-red-800 mb-2">Error de Autenticación / Conexión</h3>
                    <p className="text-sm">{errorMessage}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            navigate('/Login');
                        }}
                        className="btn btn-blue text-sm"
                    >
                        Iniciar Sesión Nuevamente
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-orange text-sm"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <NavBar />
            <div className="grid grid-cols-[0.45fr_1.9fr]">

                <div>
                    <FilterForm
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        onApplyFilters={setFilters}
                        onResetFilters={handleResetAllFilters}
                    />
                </div>

                <div className="ml-7 mt-0  ">
                    {user && user.user_type !== 3 && (
                        <Link to="/CreateGnrlv1">
                            <button className="btn btn-blue">Nuevo molde</button>
                        </Link>
                    )}


                    {/* RENDER THE LIST USING TANSTACK ROW MODEL */}

                    {table.getRowModel().rows.length > 0 ? (
                        <>
                            <ul>
                                {table.getRowModel().rows.map((row) => (
                                    <Molde
                                        key={row.original.hesp_IdHerramentalEspecifico}
                                        molde={row.original}
                                        onNavigate={() => navigate(`/VisualMold/${row.original.hesp_IdHerramentalEspecifico}`)}
                                    />
                                ))}
                            </ul>

                            {/* MUI PAGINATION INTEGRATION */}

                            <div className="mt-8 flex justify-center pb-10">
                                <Stack spacing={10}>
                                    <Pagination
                                        count={table.getPageCount()}
                                        page={table.getState().pagination.pageIndex + 1}
                                        onChange={(event, value) => table.setPageIndex(value - 1)}
                                        color="primary"
                                        variant="outlined"
                                        shape="rounded"
                                    />
                                </Stack>
                            </div>
                        </>
                    ) : (
                        <div>
                            <p>No hay datos para mostrar</p>
                        </div>
                    )}
                </div>
            </div >
        </>
    )
}



function TableImage({ idImagen }: { idImagen: number | null | undefined }) {
    const { imageUrl } = useToolImage(idImagen);
    if (!idImagen) return <span>Sin imagen</span>;
    return (
        <img
            src={imageUrl || "./default-image.svg"}
            alt="Herramental"
            className="w-24 h-24 object-cover"
        />
    );
}

function TableQrCode({ toolData }: { toolData: any }) {
    const qrCodeValue = useToolQrCode(toolData);
    const [isOpen, setIsOpen] = useState(false);
    return (

        <div className="flex items-center space-x-4">
            <button onClick={() => setIsOpen(true)}>
                <QRCode
                    value={qrCodeValue}
                    size={80}
                    style={{ height: "100%", maxWidth: "200%", width: "200%" }}
                />
            </button>
            <React.Fragment>

                <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                    <DialogTitle>QR Code</DialogTitle>
                    <DialogContent>
                        <div className={`lightGrey p-3 space-y-1`}>
                            <p><strong>Descripción QR</strong></p>
                            <p><strong>Codigo Molde:</strong> {toolData.hesp_CodigoHerramental}</p>
                            <p><strong>Codigo Alterno:</strong> {toolData.hesp_CodigoAlterno}</p>
                            <p><strong>Tipo de Herramental:</strong>{toolData.nombre_tipo_herra}</p>
                            <p><strong>Familia:</strong> {toolData.nombre_familia}</p>
                            <p><strong>Maquina Principal:</strong> {toolData.num_maquina_pp}</p>
                            <p><strong>Maquina Opcional:</strong> {toolData.num_maquina_opc}</p>
                            <p><strong>Piso:</strong> {toolData.numero_piso}</p>
                            <p><strong>Estante:</strong> {toolData.nombre_estanteria}</p>
                            <p><strong>Fila:</strong> {toolData.numero_fila}</p>
                            <p><strong>Columna:</strong> {toolData.numero_columna}</p>
                            <p><strong>Posición:</strong> {toolData.numero_posicion}</p>
                            <p><strong>Estado:</strong> {toolData.nombre_estado_Herr}</p>
                            <p><strong>Cantidad de Herramental:</strong> {toolData.hesp_CantHerramental}</p>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button onClick={() => setIsOpen(false)} className="btn btn-blue">
                            Cerrar
                        </button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>

    );
}

function Molde({ molde, onNavigate, }) {
    const { user } = useAuth();
    const { imageUrl } = useToolImage(molde.hesp_IdImagen);


    return (
        <li className="molde-list-item" >
            <div className="col-start-1 row-span-5 self-center justify-self-center w-auto h-auto object-cover">
                <Avatar
                    alt={molde.hesp_CodigoHerramental}
                    src={imageUrl || "./default-image.svg"}
                    sx={{ width: 200, height: 200 }}
                    variant="rounded"
                    className=" col-start-1 row-span-5 items-center m-5"
                />
            </div>
            <div className="col-start-3 row-start-1 row-end-5" onClick={onNavigate} style={{ cursor: 'pointer' }}>
                <h3 className="col-start-3 row-start-1 justify-self-start">{molde.hesp_CodigoHerramental}</h3>
                <p className="col-start-3 row-start-2 row-end-3 justify-self-start bg-blue-50">Estado: {molde.nombre_estado_Herr} </p>
                <p className="col-start-3 row-start-3 row-end-4 justify-self-start bg-blue-50">Máquina: {molde.num_maquina_pp} </p>
                <p className="col-start-3 row-start-4 row-end-5 justify-self-start bg-blue-50">Código alterno: {molde.hesp_CodigoAlterno} </p>

            </div>

            <div className="col-start-2 row-span-5 self-center justify-self-center w-auto h-auto bg-white flex items-center justify-center border border-gray-300 rounded  shadow-sm m-2">

                <TableQrCode toolData={molde} />
            </div>



            {user && user.user_type !== 3 && (
                <div className="col-start-5 row-span-2 bg-blue-50 ">
                    <Link to={`/CreateActivity/${molde.hesp_IdHerramentalEspecifico}`}>
                        <button className='p-2 mx-2 rounded-full hover:bg-blueFB/20'>
                            <ChecklistIcon />
                        </button>
                    </Link>

                    {/* Agrega el botón de editar con el icono */}
                    <Link to={`/EditHerramental/${molde.hesp_IdHerramentalEspecifico}`}>
                        <button className='p-2 mx-2 rounded-full hover:bg-blueFB/20'>
                            <ModeEditIcon sx={{ color: blue[500], cursor: 'pointer' }} />
                        </button>
                    </Link>
                </div>
            )}
        </li>

    )
}

