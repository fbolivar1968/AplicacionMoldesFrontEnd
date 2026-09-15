import * as React from "react";
import NavBar from "../Components/NavBar.jsx";
import { Link, useNavigate } from "react-router-dom";
import '../styles/globals.css'
import FilesUpload from "../Components/FilesUpload.js";
import { useFormData } from "../Hooks/FormNewHerrContext/HerrContext.js";
import { useMeasuresForm } from "../Hooks/useMeasuresForm.js";
import defaultScheme from "../assets/Schemas/default-scheme.png"
import { Button } from "../Components/Button.js";

export default function CreateMeasures() {
    const { formData, updateFormData } = useFormData();
    const navigate = useNavigate();

    // Get family code from Context(Saved in CreateGnrlv1)
    const familyCode = formData?.fa_CodigoFamilia || 'nan';

    // 2. Obtener los literales a renderizar para esta familia
    const {
        register,
        handleSubmit,
        literals,
        schemeUrl,
        familyName,
        formState: { errors }
    } = useMeasuresForm(familyCode);

    const canContinue = true;

    const onNextPage = (data: any) => {
        updateFormData(data); // Saves Page 2 data to Context + SessionStorage
        navigate("/CreateMechanical"); // Move to Page 2
        const finalData = { ...formData, ...data };
        console.log("Page 1 and 2 Data:", finalData);
        console.log("url scheme", schemeUrl);
    };
    if (!familyCode) {
        return <div>Cargando... o Seleccione una familia.</div>;
    }

    return (

        <>
            <NavBar />

            <h1>Medidas de Molde</h1>

            <form onSubmit={handleSubmit(onNextPage, (errors) => console.log("Validation errors:", errors))}
                className="grid grid-cols-[4,auto] grid-rows-[repeat(4,auto)]
            gap-4 w-screen h-screen m-5"
            >
                <div className="items-center">

                    <div className="space-y-8">
                        {literals.map((lit) => (
                            <div key={lit} className="col-start-1 row-start-1">
                                <label className="block p-1">Medida {lit}</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder={`Ingrese valor para ${lit}`}
                                    {...register(`hesp_${lit}`, { valueAsNumber: true })}
                                    className={` border p-2 w-full ${errors[`hesp_${lit}`] ? `border-red-500` : ""}`}
                                />
                                {errors[`hesp_${lit}`] && (
                                    <span className="text-red-500 text-xs">Requerido</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/*-----------------row-start-1 row-end-3-Image Column---------------------- */}
                <div className="col-start-1 row-start-2">
                    <label className=" block">Observaciones</label>
                    <textarea id="" className="h-30 w-[100%]" rows={10} {...register("hesp_Observacion")}></textarea>
                </div>

                <div className="col-start-2 col-end-4 row-start-1 place-self-center">

                    <img
                        src={schemeUrl}
                        alt={`Esquema ${familyName}`}
                        className="place-self-center object-cover"
                        onError={(e) => {
                            e.currentTarget.src = defaultScheme;
                        }}// REMEMBER TO SEARCH
                    />
                    <p className="block place-self-center">Esquema: {familyName}</p>
                </div>

                <div className=" col-start-2 col-end-4 row-start-2 justify-self-center ">
                    <FilesUpload />
                </div>

                {/*-----------------Buttons---------------------------------------- */}
                <div className="col-span-2 flex justify-between mt-10">
                    <Button variant="primary" onClick={() => navigate(-1)}>
                        Atrás
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!canContinue}
                    >
                        Continuar
                    </Button>
                </div>
            </form>
        </>
    )
}
