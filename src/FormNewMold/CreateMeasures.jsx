import * as React from "react";
import NavBar from "../Components/NavBar.jsx";
import {Link} from "react-router-dom";
import '../styles/globals.css'
import FileUploader from "../Components/FileUploader.jsx";

// import {useForm} from 'react-hook-form';
// import useFamiliaSchema from "../Hooks/useFamiliaSchema.js";

export default function CreateMeasures() {
    /*function FormularioFamilia() {
        // 1. Obtener el código de familia (ejemplo con querystring)
        const location = useLocation();
        // Asume que la URL es /formulario?familia=HX
        const codFamilia = new URLSearchParams(location.search).get('familia');

        // 2. Obtener los literales a renderizar para esta familia
        const literales = useFamiliaSchema(codFamilia);

        // 3. Inicializar React Hook Form
        const {
            register,
            handleSubmit,
            formState: {errors}
        } = useForm({
            // 💡 Clave para la renderización condicional
            shouldUnregister: true,
            defaultValues: {}
        });

        const onSubmit = (data) => {
            console.log(`Datos finales para ${codFamilia}:`, data);
            // 🚀 Aquí puedes enviar 'data' a tu API
        };

        if (!codFamilia) {
            return <div>Cargando... o Seleccione una familia.</div>;
        }*/

        return (

            <>
                <NavBar/>

                <h1>Medidas de Molde</h1>

                <form className="grid grid-cols-[4,auto] grid-rows-[repeat(4,auto)]
            gap-4 w-screen h-screen m-5"
                      >

                    <div className="items-center">

                        <div className="space-y-8">

                            <div className="col-start-1 row-start-1">
                                <label className="block p-1">A</label>
                                <input type="number" inputMode="numeric" placeholder="A"/>
                                <label className=" block p-1">B</label>
                                <input type="number" inputMode="numeric" placeholder="B "/>
                                <label className="block p-1">C</label>
                                <input type="number" inputMode="numeric" placeholder="C"/>
                            </div>

                        </div>


                    </div>

                    {/*-----------------row-start-1 row-end-3---------------------------------------- */}
                    <div className="col-start-1 row-start-2">
                        <label className=" block">Observaciones</label>
                        <textarea name="txt" id="" className="h-30 w-[100%]" rows={10}></textarea>
                    </div>

                    <div className="col-start-2 col-end-4 row-start-1 place-self-center">

                        <img className="place-self-center object-cover"
                             src="src/assets/Squemas/SquemaBristol.png" alt="esquema"/>
                        <label className="block place-self-center">Esquema: Familia AAA</label>
                    </div>

                    <div className=" col-start-2 col-end-4 row-start-2 justify-self-center ">
                        <FileUploader/>
                    </div>

                    {/*-----------------Buttons---------------------------------------- */}

                    <Link to="/Createubic" className="col-start-4 row-start-3 ">
                        <button className="btn btn-orange ">Continuar</button>
                    </Link>

                    <Link to="/CreateGnrl" className="col-start-1 row-start-3">
                        <button className="btn btn-orange">Atrás</button>
                    </Link>

                </form>


            </>
        )
    }
