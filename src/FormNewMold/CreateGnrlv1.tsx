import '../styles/globals.css'
import * as React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar.jsx";
import useAxios from "../Hooks/useAxios/IndexAx.js";
import { useEffect, useMemo } from "react";
import QRCode from "react-qr-code";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HerramentalModelSchema } from "../Hooks/Validators/HerramentalEsp.js";
import LoadingAnimation from "../Components/LoadingAnimation.jsx";
import { useFormData } from "../Hooks/FormNewHerrContext/HerrContext.js";
import { z } from "zod";
import { useState } from "react";

//pick Validator variables in this form
const HerramentalValuesSchema = HerramentalModelSchema.pick(
    {

        //he_IdHerramental: true,
        //th_IdTipoHerramental: true,
        hesp_IdHerramental: true,
        hesp_IdTipoHerramental: true,
        hesp_IdFamilia: true,         // El select de Familia
        hesp_CodigoAlterno: true,
        consecutive: true,
        hesp_CodigoHerramental: true,
        hesp_Descripcion1: true,
        fa_NombreFamilia: true,
        //fa_IdFamilia: true,
        fa_CodigoFamilia: true,
        hesp_Criticidad: true,
    }
)

interface HerramentalItem {
    id: number;
    nombre: string;
}

export default function CreateGnrlv1() {
    const { formData, updateFormData } = useFormData();
    const navigate = useNavigate();
    const { response, loading, fetchData } = useAxios();
    const { fetchData: fetchConsecutive } = useAxios();
    const [nextConsecutive, setNextConsecutive] = useState("01");




    //Initialization React Hook Form

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors } //review-----------------
    } = useForm({
        resolver: zodResolver(HerramentalValuesSchema),
        defaultValues: {
            hesp_IdHerramental: formData.hesp_IdHerramental ?? 0,
            /*             he_IdHerramental: formData.he_IdHerramental ?? 0,
                        th_IdTipoHerramental: formData.th_IdTipoHerramental ?? 0,
                        fa_IdFamilia: formData.fa_IdFamilia ?? 0, */
            hesp_CodigoAlterno: formData.hesp_CodigoAlterno ?? "",
            consecutive: formData.consecutive ?? 0,
            hesp_CodigoHerramental: formData.hesp_CodigoHerramental ?? "",
            hesp_Descripcion1: formData.hesp_Descripcion1 ?? "",
            hesp_IdFamilia: formData.hesp_IdFamilia ?? 0,
            hesp_IdTipoHerramental: formData.hesp_IdTipoHerramental ?? 0,
            fa_NombreFamilia: formData.fa_NombreFamilia ?? "",
            fa_CodigoFamilia: formData.fa_CodigoFamilia ?? "",
            hesp_Criticidad: formData.hesp_Criticidad ?? "",
        }
    });




    //watch fields to update Description and Qr code automatically

    // Watch the IDs
    // 1. Destructure the watched fields as an object
    const watched = watch();
    const {
        hesp_IdHerramental,
        hesp_IdTipoHerramental,
        hesp_IdFamilia,
        hesp_CodigoAlterno,
        fa_CodigoFamilia,
        consecutive } = watched;



    //Maps the API responses to const if response is null, it safaly fallsback to empty arrays

    const [tipo_herramental, familias, herramentales] = response || [[], [], []];

    // Sync fa_CodigoFamilia whenever hesp_IdFamilia changes
    useEffect(() => {
        const selectedFamily = familias?.find(i => i.fa_IdFamilia === Number(hesp_IdFamilia));
        if (selectedFamily?.fa_CodigoFamilia) {
            setValue("fa_CodigoFamilia", selectedFamily.fa_CodigoFamilia);
            setValue("fa_NombreFamilia", selectedFamily.fa_NombreFamilia);
        }
    }, [hesp_IdFamilia, familias, setValue]);



    //Memoize the description so it only recalculates when watched fields change

    const description = useMemo(() => {

        // Find the object in your original response arrays
        const hName =
            herramentales?.find(
                (i) => i.he_IdHerramental === Number(hesp_IdHerramental)
            )?.he_NombreHerramental || "...";

        const tName =
            tipo_herramental?.find(
                (i) => i.th_IdTipoHerramental === Number(hesp_IdTipoHerramental)
            )?.th_NombreTipoHerramental || "...";

        const fName =
            familias?.find(
                (i) => i.fa_IdFamilia === Number(hesp_IdFamilia)
            )?.fa_NombreFamilia || "...";



        return `Herramental ${hName} tipo ${tName} de la Familia ${fName} con código alterno ${hesp_CodigoAlterno || "..."}`;
    }, [
        hesp_IdHerramental,
        hesp_IdTipoHerramental,
        hesp_IdFamilia,
        hesp_CodigoAlterno,
        herramentales,
        tipo_herramental,
        familias,
    ]);
    //only re-runs if response changes




    // Prefix CodeBase Generator

    const baseCodePrefix = useMemo(() => {
        // Find codes in your response arrays
        const hCode = herramentales?.find(i => i.he_IdHerramental === Number(hesp_IdHerramental))?.he_CodigoHerramental || "";
        const tCode = tipo_herramental?.find(i => i.th_IdTipoHerramental === Number(hesp_IdTipoHerramental))?.th_CodigoTipoHerramental || "";
        const fCode = familias?.find(i => i.fa_IdFamilia === Number(hesp_IdFamilia))?.fa_CodigoFamilia || "";

        return `${hCode}${tCode}-${fCode}`;
    }, [hesp_IdHerramental, hesp_IdTipoHerramental, hesp_IdFamilia, response]);

    const consecutiveCode = String(consecutive || "").padStart(2, "0");
    const HerramentalCode = `${baseCodePrefix}${consecutiveCode}`;
    const Description1 = description;

    //NextConsecutive ApiCall
    useEffect(() => {
        // Only fetch if all 3 parts are selected
        if (hesp_IdHerramental && hesp_IdTipoHerramental && hesp_IdFamilia) {
            fetchConsecutive({
                url: `/api/herramental/next-consecutive`,
                method: "GET",
                params: {
                    h: hesp_IdHerramental,
                    t: hesp_IdTipoHerramental,
                    f: hesp_IdFamilia
                }
            }).then(res => {
                // If the API returns 5, we format it as "06"
                const num = res.data.nextValue;
                setNextConsecutive(num.toString().padStart(2, '0'));
            });
        }
    }, [hesp_IdHerramental, hesp_IdTipoHerramental, hesp_IdFamilia, fetchConsecutive]);

    //Sync HerramentalCode whenever hesp_CodigoAlterno changes
    useEffect(() => {
        setValue("hesp_CodigoHerramental", HerramentalCode);
        console.log("Herramental Code", HerramentalCode)
    }, [HerramentalCode]);

    //Sync HerramentalCode whenever hesp_CodigoAlterno changes
    useEffect(() => {
        setValue("hesp_Descripcion1", description);
    }, [description]);

    useEffect(
        () => {
            fetchData({
                url: [
                    "/api/tipo_herramental/",
                    "/api/familia/",
                    "/api/herramental/"
                ],
                method: "GET",
            });
        }, []); //Empty array means Run the code once when page Loads
    //On mount, it fetches data from 3 endpoints in parallel. The results are destructured from the response array.

    /*    //Handle Logical Navigation
        const onSubmit = (data:z.infer<typeof HerramentalValuesSchema>) =>{
            console.log("it worked", data)
            navigate("/CreateMeasures");
            };*/

    // Define your onNextPage function
    const onNextPage = (data: z.infer<typeof HerramentalValuesSchema>) => {
        updateFormData(data); // Saves Page 1 data to Context + SessionStorage
        navigate("/CreateMeasures"); // Move to Page 2
        console.log("Page 1 Data:", data);
    };



    if (loading) return <LoadingAnimation />;

    return (
        <>
            <NavBar />
            <h1 className="text-2xl font-bold p-5"> Información General</h1>

            <form
                onSubmit={handleSubmit(onNextPage, (errors) => console.log("Validation errors:", errors))}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-full m-5">
                <div className="space-y-8">
                    <div>
                        <label className="block p-2" htmlFor="NombreHerramental"> Categoria Herramental</label>
                        <select {...register("hesp_IdHerramental")} className="w-full p-2 border rounded">
                            <option value=""> Seleccione Herramental</option>
                            {herramentales?.map((item: any) => (
                                <option value={item.he_IdHerramental} key={item.he_IdHerramental}>{item.he_NombreHerramental}</option>
                            ))}
                        </select>
                        {errors.hesp_IdHerramental && <p className="text-red-500 text-sm">{errors.hesp_IdHerramental.message}</p>}
                    </div>

                    <div>
                        <label htmlFor={"NombreTipoHerramental"} className="block p-2">Uso del Herramental</label>
                        <select {...register("hesp_IdTipoHerramental")} className="w-full p-2 border rounded">
                            <option value=""> Seleccione tipo de uso </option>
                            {tipo_herramental?.map((typeh: any) => (
                                <option value={typeh.th_IdTipoHerramental} key={typeh.th_IdTipoHerramental}>{typeh.th_NombreTipoHerramental}</option>
                            ))}
                        </select>
                        {errors.hesp_IdTipoHerramental && <p className="text-red-500 text-sm">{errors.hesp_IdTipoHerramental.message}</p>}
                    </div>

                    <div>
                        <label className="block p-2" htmlFor={"NombreFamilia"} >Familia Herramental</label>
                        <select {...register("hesp_IdFamilia")} className="w-full p-2 border">
                            <option value="">Seleccione Familia</option>
                            {familias?.map((item: any) => (
                                <option value={item.fa_IdFamilia} key={item.fa_IdFamilia}>{item.fa_NombreFamilia}</option>
                            ))}
                        </select>
                        {errors.hesp_IdFamilia && <p className="text-red-500 text-sm">{errors.hesp_IdFamilia.message}</p>}

                    </div>

                    <div>
                        <label className="block p-2" htmlFor={"CodigoAlterno"}> Código alterno</label>
                        <input
                            type="text"
                            {...register("hesp_CodigoAlterno")}
                            className="block p-2 border"
                        />
                        {errors.hesp_CodigoAlterno && <p className="text-red-500 text-sm">{errors.hesp_CodigoAlterno.message}</p>}

                    </div>

                    <div>
                        <label className="block p-2" htmlFor={" Criticidad"}> Criticidad</label>
                        <select
                            {...register("hesp_Criticidad")}
                            className="w-full p-2 border"
                        >
                            <option disabled value="">Seleccione Criticidad</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                        {errors.hesp_Criticidad && <p className="text-red-500 text-sm">{errors.hesp_Criticidad.message}</p>}

                    </div>
                </div>


                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold"> Descripción</h3>
                    <p className=" uppercase text-sm mb-4">{description}</p>

                    <div className="flex justify-center mb-4">
                        <QRCode
                            {...register("hesp_Descripcion1")}
                            value={description}
                            size={256}
                        />
                    </div>

                    <div>

                        {/* <input type={"hidden"} {...register("hesp_CodigoHerramental")} value={HerramentalCode} /> */}
                        <div className="mt-4">
                            <h4 className="text-blueFB font-bold">Código Final:</h4>
                            <h2 className="text-3xl font-mono">{baseCodePrefix}{nextConsecutive}</h2>
                        </div>
                        {/* <input
                            type="number"
                            {...register("consecutive", { valueAsNumber: true })}
                            className="block p-2 border"
                        /> */}
                        {errors.consecutive && <p className="text-red-500 text-sm">{errors.consecutive.message}</p>}

                    </div>

                </div>

                <div className="col-span-2 flex justify-between mt-10">
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-orange">
                        Atrás
                    </button>

                    <button type="submit" className="btn btn-orange">
                        Continuar
                    </button>
                </div>

            </form>

        </>
    )





}