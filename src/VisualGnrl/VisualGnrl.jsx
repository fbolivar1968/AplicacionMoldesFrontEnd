import '../styles/globals.css'
import * as React from 'react';
import Switch from '@mui/material/Switch';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {blue} from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import FilterForm from './FilterForm.jsx';
import Pagination from '../Components/Pagination.jsx';
import {Link} from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";

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

export default function VisualGnrl() {
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
                    <MoldesList/>
                    <Pagination/>
                </div>
            </div>
        </>
    )
}

function MoldesList() {
    return (

        <ul>{initialMoldes.map((molde) => (
            <Link to="/VisualMold" state={{id: molde.id}}>
                <Molde
                    key={molde.id}
                    molde={molde}/>
            </Link>
        ))}</ul>
    );
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
            <p className="col-start-3 row-start-2 row-end-3 justify-self-start bg-blue-50">Máquina: {molde.machine} </p>

            <div className="col-start-5 row-span-2 bg-blue-50">
                <ModeEditIcon/>
                <Switch sx={{color: blue[900]}} defaultChecked/>
            </div>

        </li>
    )
}

