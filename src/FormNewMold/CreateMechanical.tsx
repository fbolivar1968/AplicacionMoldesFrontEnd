import * as React from "react";
import NavBar from "../Components/NavBar.jsx";
import '../styles/globals.css';
import { MechanicalFormSchema, type MechanicalFormValues } from "../Hooks/Validators/PropHerram.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useFormData } from "../Hooks/FormNewHerrContext/HerrContext.js";
import { useEffect } from "react";
import useAxios from "../Hooks/useAxios/IndexAx.js";
import FilesUpload from "../Components/FilesUpload.js";

export default function CreateMechanical() {
    const { formData, updateFormData } = useFormData();
    const navigate = useNavigate();
    const { response, fetchData, CreatePost } = useAxios();

    useEffect(() => {
        fetchData({
            url: "/api/propiedades-herramental/",
            method: "GET",
        });
    }, []);

    const aceros = response?.aceros || [];
    const durezas = response?.durezas || [];
    const proveedores = response?.proveedores || [];

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<MechanicalFormValues>({
        resolver: zodResolver(MechanicalFormSchema) as unknown as import("react-hook-form").Resolver<MechanicalFormValues>,
        defaultValues: {
            ac_IdAcero: formData.ac_IdAcero ?? 0,
            du_IdDureza: formData.du_IdDureza ?? 0,
            pr_IdProveedor: formData.pr_IdProveedor ?? 0,
            php_PrecioTotal: formData.php_PrecioTotal ?? "",
            ph_FechaCreacion: formData.ph_FechaCreacion ?? "",
            ph_DescripHerra: formData.ph_DescripHerra ?? formData.hesp_Observaciones ?? ""
        }
    });

    const onNextPage = async (data: MechanicalFormValues) => {
        try {
            const hasMechanicalData = Boolean(
                (data.ac_IdAcero && Number(data.ac_IdAcero) > 0) ||
                (data.du_IdDureza && Number(data.du_IdDureza) > 0) ||
                (data.pr_IdProveedor && Number(data.pr_IdProveedor) > 0) ||
                (data.php_PrecioTotal !== "" && data.php_PrecioTotal !== null && data.php_PrecioTotal !== undefined) ||
                data.ph_FechaCreacion ||
                data.ph_DescripHerra
            );

            let propiedadId = formData.hesp_IdPropiedadHerramental;
            if (hasMechanicalData) {
                const payload = {
                    ac_IdAcero: data.ac_IdAcero && Number(data.ac_IdAcero) > 0 ? Number(data.ac_IdAcero) : null,
                    du_IdDureza: data.du_IdDureza && Number(data.du_IdDureza) > 0 ? Number(data.du_IdDureza) : null,
                    pr_IdProveedor: data.pr_IdProveedor && Number(data.pr_IdProveedor) > 0 ? Number(data.pr_IdProveedor) : null,
                    php_PrecioTotal: data.php_PrecioTotal ? Number(data.php_PrecioTotal) : null,
                    ph_FechaCreacion: data.ph_FechaCreacion || new Date().toISOString().split('T')[0],
                    ph_DescripHerra: data.ph_DescripHerra || "",
                };

                try {
                    const resProp = await CreatePost("/api/propiedad_herramental/", "POST", payload);
                    if (resProp?.ph_IdPropiedadHerramental || resProp?.id || resProp?.data?.ph_IdPropiedadHerramental) {
                        propiedadId = resProp?.ph_IdPropiedadHerramental || resProp?.id || resProp?.data?.ph_IdPropiedadHerramental;
                        console.log("Created PropiedadHerramental ID:", propiedadId);
                    }
                } catch (err) {
                    console.warn("Backend endpoint /api/propiedad_herramental/ not reachable yet. Saving data to context:", err);
                }
            }

            updateFormData({
                ...data,
                ...(propiedadId ? { hesp_IdPropiedadHerramental: propiedadId } : {})
            });

            navigate("/CreateUbic");
        } catch (error) {
            console.error("Error in mechanical step submission:", error);
        }
    };

    return (
        <>
            <NavBar />
            <h1>Propiedades mecánicas</h1>
            <form onSubmit={handleSubmit(onNextPage, (errors) => console.log("Validation errors:", errors))} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-full m-5">
                <div className="space-y-6">
                    <div>
                        <label className="block p-2 font-medium">Acero (Opcional)</label>
                        <select className="w-full p-2 border rounded" {...register("ac_IdAcero")}>
                            <option value={0}>Seleccione Acero</option>
                            {aceros.map((acero: any, index: number) => (
                                <option value={acero.ac_IdAcero ?? index} key={acero.ac_IdAcero ?? index}>
                                    {acero.ac_DescripAcero ?? ""}
                                </option>
                            ))}
                        </select>
                        {errors.ac_IdAcero && <span className="text-red-500 text-sm block mt-1">{errors.ac_IdAcero.message}</span>}
                    </div>

                    <div>
                        <label className="block p-2 font-medium">Dureza (Opcional)</label>
                        <select className="w-full p-2 border rounded" {...register("du_IdDureza")}>
                            <option value={0}>Seleccione Dureza</option>
                            {durezas.map((dureza: any, index: number) => (
                                <option value={dureza.du_IdDureza ?? index} key={dureza.du_IdDureza ?? index}>
                                    {dureza.du_ValorDureza ?? ""}
                                </option>
                            ))}
                        </select>
                        {errors.du_IdDureza && <span className="text-red-500 text-sm block mt-1">{errors.du_IdDureza.message}</span>}
                    </div>

                    <div>
                        <label className="block p-2 font-medium">Proveedor (Opcional)</label>
                        <select className="w-full p-2 border rounded" {...register("pr_IdProveedor")}>
                            <option value={0}>Seleccione Proveedor</option>
                            {proveedores.map((proveedor: any, index: number) => (
                                <option value={proveedor.pr_IdProveedor ?? index} key={proveedor.pr_IdProveedor ?? index}>
                                    {proveedor.pr_NombreProv ?? ""}
                                </option>
                            ))}
                        </select>
                        {errors.pr_IdProveedor && <span className="text-red-500 text-sm block mt-1">{errors.pr_IdProveedor.message}</span>}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block p-1 font-medium">Precio (Opcional)</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="$Precio"
                            className="w-full p-2 border rounded"
                            {...register("php_PrecioTotal")}
                        />
                        {errors.php_PrecioTotal && <span className="text-red-500 text-sm block mt-1">{errors.php_PrecioTotal.message}</span>}
                    </div>

                    <div>
                        <label className="block p-1 font-medium">Fecha de creación (Opcional)</label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded"
                            {...register("ph_FechaCreacion")}
                        />
                        {errors.ph_FechaCreacion && <span className="text-red-500 text-sm block mt-1">{errors.ph_FechaCreacion.message}</span>}
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Observaciones (Opcional)</label>
                        <textarea
                            className="w-full p-2 border rounded h-28"
                            rows={4}
                            placeholder="Observaciones de la propiedad..."
                            {...register("ph_DescripHerra")}
                        ></textarea>
                        {errors.ph_DescripHerra && <span className="text-red-500 text-sm block mt-1">{errors.ph_DescripHerra.message}</span>}
                    </div>

                    <div className=" col-start-2 col-end-4 row-start-2 justify-self-center ">
                        <h2 className="text-xl font-bold mb-4">Plano de Herramental</h2>
                        <FilesUpload targetField="hesp_IdPlano" endpoint="/api/documents/" />
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex justify-between mt-4">
                    <button type="button" className="btn btn-orange" onClick={() => navigate(-1)}>
                        Atrás
                    </button>

                    <button
                        type="submit"
                        className="btn btn-orange"
                    >
                        Continuar
                    </button>
                </div>
            </form>
        </>
    );
}

