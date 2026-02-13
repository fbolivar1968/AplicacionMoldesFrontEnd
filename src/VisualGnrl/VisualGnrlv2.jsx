import '../styles/globals.css'
import * as React from 'react';
import Switch from '@mui/material/Switch';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {blue} from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import FilterForm from './FilterForm.jsx';
import {Link} from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";
import ChecklistIcon from '@mui/icons-material/Checklist';
import LoadingAnimation from "../Components/LoadingAnimation.jsx";
//***********************************************************

import useAxios from "../Hooks/useAxios/IndexAx.js";
import {useEffect, useState, useMemo} from "react";
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
import Pagination from "@mui/material/Pagination";

/*
const initialMoldes = [
    {
        qr: "src/assets/qr-code.png",
        id: 1,
        name: "M-HX01",
        image: "src/assets/MoldesImg/M-HX01.JPEG",
        machine: "Ona",
        state: "Taller",
    },
    {
        qr: "src/assets/qr-code.png",
        id: 2,
        name: "M-HX02",
        image: "src/assets/MoldesImg/M-HX02.JPEG",
        machine: "24",
        state: "Taller",
    },
    {
        qr: "src/assets/qr-code.png",
        id: 3,
        name: "M-HX03",
        image: "src/assets/MoldesImg/M-HX03.JPEG",
        machine: "16",
        state: "Taller",
    },
    {
        qr: "src/assets/qr-code.png",
        id: 4,
        name: "M-HX05",
        image: "src/assets/MoldesImg/M-HX05.JPEG",
        machine: "22",
        state: "Taller",

    },
]
*/



export default function VisualGnrlv2() {
    const {response, error, status, fetchData} = useAxios(); //Response stores the data fetched from API
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([])
    const isLoading = status === FETCH_STATUS.LOADING;

    useEffect(() => {
        fetchData({
            url: '/api/GnrlView', // Wait for backend to generate view
            method: "GET",
        });
    }, []);

    //Define (Memoizing) Columns
    const columns = useMemo(() => [
        {
            header: 'qr',
            accessorKey: 'qr',
        },
        {
            header: 'id',
            accessorKey: 'id',
        },
        {
            header: 'name',
            accessorKey: 'name',
        },
        {
            header: 'image',
            accessorKey: 'image',
        },
        {
            header: 'machine',
            accessorKey: 'machine',
        },
        {
            header: 'state',
            accessorKey: 'state',
        },

    ], []);

    //DEBUGGING

    fetch('http://10.1.1.14:8000/api/GnrlView')
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


    if (isLoading) {
        return <LoadingAnimation message="Moldes"/>;

    }

    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <NavBar/>
            <div className="grid grid-cols-[0.45fr_1.9fr]">
                <div>
                    <FilterForm/>
                </div>

                <div className="ml-7 mt-0  ">
                    <Link to="/CreateGnrl">
                        <button className="btn btn-blue">Nuevo molde</button>
                    </Link>

                    {/* RENDER THE LIST USING TANSTACK ROW MODEL */}

                    <ul>
                        {table.getRowModel().rows.map((row) => (
                            <Link key={row.id}
                                  to="/VisualMold"
                                  state={{id: row.original.id}}>
                                <Molde
                                    molde={row.original}/>
                            </Link>
                        ))}</ul>

                    {/* MUI PAGINATION INTEGRATION */}

                    <div className="mt-8 flex justify-center pb-10">
                        <Stack spacing={2}>
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
                </div>
            </div>
        </>
    )
}





function Molde({molde}) {
    return (
            <li className="molde-list-item">
                <Avatar
                    alt={molde.name}
                    src={molde.image}
                    sx={{width: 100, height: 100}}
                    variant="rounded"
                    className="col-start-1 row-span-2"

                />

                <div className="justify-self-end col-start-2 row-span-2 p-2 bg-blue-50">
                    <Avatar
                        alt={molde.name}
                        src={molde.qr}
                        sx={{width: 100, height: 100}}
                        variant="square"
                    />
                </div>

                <h3 className="col-start-3 row-start-1 justify-self-start bg-blue-50">{molde.name}</h3>
                <p className="col-start-3 row-start-2 row-end-3 justify-self-start bg-blue-50">Estado: {molde.state} </p>
                <p className="col-start-3 row-start-2 row-end-3 justify-self-start bg-blue-50">Máquina: {molde.machine} </p>

                <div className="col-start-5 row-span-2 m-2 bg-blue-50">
                    <Link to="/CreateActivity">
                        <ChecklistIcon/>
                    </Link>
                </div>
            </li>

    )
}

