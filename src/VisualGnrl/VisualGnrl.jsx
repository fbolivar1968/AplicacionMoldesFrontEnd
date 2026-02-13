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
import ChecklistIcon from '@mui/icons-material/Checklist';
import ImageModal from "../Components/ImageModal.jsx";

const initialMoldes = [
    {
        qr: "src/assets/MoldesImg/QR292.png",
        id: 292,
        name: "MES-NZ05",
        image: "src/assets/MoldesImg/292.jpg",
        machine: "25",
        state: "Incompleto",
    },
    {
        qr: "src/assets/MoldesImg/QR420.png",
        id: 373,
        name: "MRG-GT08",
        image: "src/assets/MoldesImg/373.jpg",
        machine: "28",
        state: "Disponible",
    },
    {
        qr: "src/assets/MoldesImg/QR420.png",
        id: 420,
        name: "MES-RE19",
        image: "src/assets/MoldesImg/420.jpg",
        machine: "28",
        state: "Disponible",
    },
    {
        qr: "src/assets/MoldesImg/QR255.png",
        id: 255,
        name: "MES-CL03",
        image: "src/assets/MoldesImg/255.jpg",
        machine: "25",
        state: "Por reparar",

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

            <Molde
                key={molde.id}
                molde={molde}/>

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
                className="col-start-1 row-span-3"

            />

            <div className="justify-self-end col-start-2 row-span-3 p-2 bg-blue-50 overflow-hidden">
                <ImageModal
                    src={molde.qr}
                    alt={molde.name}
                />


                {/*<Avatar*/}
                {/*    alt={molde.name}*/}
                {/*    src={molde.qr}*/}
                {/*    sx={{width: 100, height: 100}}*/}
                {/*    variant="square"*/}
                {/*    className="transition-transform duration-300 ease-in-out transform origin-top hover:scale-200"*/}
                {/*/>*/}
            </div>

            <Link to="/VisualMold" className="col-start-3 row-start-1 justify-self-start">
                <h3> {molde.name}</h3>
            </Link>
            <p className="col-start-3 row-start-2 justify-self-start bg-blue-50">Estado: {molde.state} </p>
            <p className="col-start-3 row-start-3 justify-self-start bg-blue-50">Máquina: {molde.machine} </p>

            <div className="col-start-5 row-span-3 m-2 bg-blue-50">
                <Link to="/CreateActivity">
                    <ChecklistIcon/>
                </Link>


                {/*<Switch sx={{color: blue[900]}} defaultChecked/>*/}
            </div>

        </li>
    )
}

