import '../styles/globals.css'
import NavBar from "../Components/NavBar.jsx";
import FBIcon from "../assets/Icons/FBIcon.png"
//import Pagination from "../Components/Pagination.jsx";
import LoadingAnimation from "../Components/LoadingAnimation.jsx";
import * as React from "react";
import useAxios from "../Hooks/useAxios/IndexAx.js";
import {useEffect, useState, useMemo} from "react";
import Pagination from '@mui/material/Pagination';
import Stack from "@mui/material/Stack";
import {FETCH_STATUS} from "../Hooks/useAxios/FetchStatus.js";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    getSortedRowModel,
} from '@tanstack/react-table';


export default function Orders() {
    const {response, error, status, fetchData} = useAxios(); //Response stores the data fetched from API
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([])
    const isLoading = status === FETCH_STATUS.LOADING;

    useEffect(() => {
        fetchData({
            url: '/api/ordenes-produccion-forja',
            method: "GET",
        });
    }, []);

    //Define (Memoizing)Columns
    const columns = useMemo(() => [
        {
            header: 'Cód. Herramental',
            accessorKey: 'codigo_herramental',
        },
        {
            header: 'Núm. Pedido',
            accessorKey: 'numero_pedido',
        },
        {
            header: 'Estado OP',
            accessorKey: 'estado_op',
        },
        {
            header: 'Ord. Producción',
            accessorKey: 'consecutivo_op',
        },
        {
            header: 'Fecha Inicio',
            accessorKey: 'fecha_inicio',
        },
        {
            header: 'Producto',
            accessorKey: 'producto',
        },
        {
            header: 'Cód. Producto',
            accessorKey: 'codigo_producto',
        },
        {
            header: 'Comentario',
            accessorKey: 'comentario',
        },
    ], []);

//DEBUGGING
    fetch('http://10.1.1.14:8000/api/ordenes-produccion-forja')
        .then(res => res.json())
        .then(data => console.log('API RESPONSE:', data))
        .catch(err => console.error('API ERROR:', err));
//-----------------------------------------------------------------0
    console.log("RESPONSE", response);

    console.log("RESPONSE TYPE", typeof response);
    console.log("IS ARRAY?", Array.isArray(response));

    const table = useReactTable({
        data: response || [],
        columns,
        state: {
            globalFilter,
            sorting,
        },
        onGlobalFilterChange: setGlobalFilter,
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

    //-- Pagination Logic --

    const handlePageChange = (event, value) => {
        table.setPageIndex(value - 1);
    };


    if (isLoading) {
        return <LoadingAnimation message="Órdenes con herramentales"/>;

    }

    if (error) return <div>Error: {error}</div>;
    return (

        <>
            <NavBar/>
            <div className = "m-2">
                <h1>Histórico Ordenes</h1>

                <div className="flex justify-end">
                    <input value={globalFilter ?? ''}
                           onChange={e => setGlobalFilter(e.target.value)}
                           placeholder="Busca en todos los datos"
                           className="p-2 border border-gray-300 rounded"></input>
                </div>


                <table
                    className="w-full table-fixed border-spacing-2 md:border-spacing-4 border-bg-blueFB bg-bg-blueFB">
                    <thead className="bg-white border-b-2 border-light-greyFB">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className="p-3 text-sm text-blueFB font-bold tracking-wide text-left">

                                    {
                                        flexRender(

                                            header.column.columnDef.header,
                                            header.getContext(),

                                        )}

                                    {
                                        {'asc': "🔼",
                                            'desc': "🔽",
                                        }[
                                        header.column.getIsSorted() ] ??(header.column.getCanSort()? "🟦": null)


                                    }
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody className="border-b-2 border-light-greyFB">
                    {isLoading && <div>Loading...{FBIcon}</div>}
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className=" border-2 border-b-dark-greyFB">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.column.id} className="p-5 text-sm text-light-grayFB">
                                    {flexRender(cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className= "flex justify-center m-2 bg-BlueFB">
                    <Stack spacing={2}>
                        <Pagination
                            count={table.getPageCount()}
                            page={table.getState().pagination.pageIndex + 1}
                            onChange={handlePageChange}
                            showFirstButton
                            showLastButton
                        />
                    </Stack>

                </div>

            </div>
        </>
    )
}