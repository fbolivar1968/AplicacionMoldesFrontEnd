import '../styles/globals.css';
import * as React from "react";
import NavBar from "../Components/NavBar.jsx";
import useAxios from "../Hooks/useAxios/IndexAx.js";
import { useEffect, useState } from "react";
import DropDown from "../Components/DropDown.js";
import { DieSetWizardSchema } from "../Hooks/Validators/Ubication.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useBlocker } from "react-router-dom";
import { useFormData } from "../Hooks/FormNewHerrContext/HerrContext.js";
import { z } from "zod";
import schemeDieSet from "../assets/Schemas/DieSetSchema.png";
import defaultScheme from "../assets/Schemas/default-scheme.png";
import { Button } from "../Components/Button.js";

type DropdownItem = {
    id?: number;
    numero?: number | string;
    nombre?: string;
    es_IdEstanteria?: number;
    es_NombreEstanteria?: string;
    di_NumeroPiso?: number | string;
    pi_DescripcionPiso?: string;
    pi_IdPiso?: number;
    di_IdDieSet?: number;
    di_CodigoDieSet?: number | string;
    di_Dimensiones?: string;
    di_IdPiso?: number;
    di_IdEstanteria?: number;
    di_IdUbicacionDieset?: number;
    pi_NumeroPiso?: number;
};

type FormValues = z.infer<typeof DieSetWizardSchema>;

export function CreateUbicDieSet() {
    const { formData, updateFormData } = useFormData();
    const navigate = useNavigate();
    const { fetchData, CreatePost } = useAxios();
    const [pisos, setPisos] = useState<DropdownItem[]>([]);
    const [estanterias, setEstanterias] = useState<DropdownItem[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<FormValues>({
        resolver: zodResolver(DieSetWizardSchema) as unknown as import("react-hook-form").Resolver<FormValues>,
        defaultValues: {
            uh_NumeroFila: formData.uh_NumeroFila ?? 0,
            uh_NumeroColumna: formData.uh_NumeroColumna ?? 0,
            uh_NumeroPosicion: formData.uh_NumeroPosicion ?? 0,
            di_IdEstanteria: formData.di_IdEstanteria ?? 0,
            di_IdPiso: formData.hesp_IdPiso ?? 0, // Maps hesp_IdPiso from context if user had selected it
            di_CodigoDieSet: formData.di_CodigoDieSet ?? "",
            di_Dimensiones: formData.di_Dimensiones ?? "",
        },
    });
    const canContinue = true;

    useEffect(() => {
        const loadDropdownData = async () => {
            const urls = [
                "/api/estanterias/",
                "/api/pisos/",
            ];

            const results = await fetchData({ url: urls });

            if (results && Array.isArray(results)) {
                const getData = (res: any) => {
                    if (!res) return [];
                    if (Array.isArray(res)) return res;
                    if (res?.results && Array.isArray(res.results)) return res.results;
                    return [];
                };

                setEstanterias(getData(results[0]));
                setPisos(getData(results[1]));
            }
        };

        loadDropdownData();
    }, []);

    // Warn on page reload or closing the tab
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            const hasUnsavedChanges = isDirty;
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    // Intercept back button or SPA navigation
    const blocker = useBlocker(({ nextLocation }) => {
        const wizardRoutes = ["/CreateGnrlv1", "/CreateMeasures", "/CreateUbic", "/CreateUbicDieSet"];
        const leavingWizard = !wizardRoutes.some(route => nextLocation.pathname.startsWith(route));
        const hasData = isDirty;
        return leavingWizard && hasData;
    });

    useEffect(() => {
        if (blocker.state === "blocked") {
            const confirmLeave = window.confirm(
                "Tiene cambios sin guardar en el formulario. ¿Está seguro de que desea salir?"
            );
            if (confirmLeave) {
                blocker.proceed();
            } else {
                blocker.reset();
            }
        }
    }, [blocker]);

    const onFinalSubmit: import("react-hook-form").SubmitHandler<FormValues> = async (data) => {
        try {
            const ubicacionData = {
                uh_NumeroFila: data.uh_NumeroFila,
                uh_NumeroColumna: data.uh_NumeroColumna,
                uh_NumeroPosicion: data.uh_NumeroPosicion,
                hesp_IdEstanteria: data.di_IdEstanteria,
            };

            let ubicacionId;
            try {
                const resUbic = await CreatePost("/api/ubicaciones/", "POST", ubicacionData);
                ubicacionId = resUbic?.uh_IdUbicacionHerr;
            } catch (err: any) {
                // Check if the backend complains that this specific combination already exists
                const nonFieldErrors = err?.non_field_errors || [];
                const isUniqueError = nonFieldErrors.some((e: string) => typeof e === 'string' && e.includes("unique set"));

                if (isUniqueError) {
                    console.log("Ubicación already exists. Seeking existing ID...");
                    // Fetch existing locations targeting this combination
                    const existingData = await fetchData({
                        url: "/api/ubicaciones/",
                        params: {
                            uh_NumeroFila: ubicacionData.uh_NumeroFila,
                            uh_NumeroColumna: ubicacionData.uh_NumeroColumna,
                            uh_NumeroPosicion: ubicacionData.uh_NumeroPosicion
                        }
                    });

                    const list = Array.isArray(existingData) ? existingData : existingData?.results || [];
                    const found = list.find((u: any) =>
                        u.uh_NumeroFila === ubicacionData.uh_NumeroFila &&
                        u.uh_NumeroColumna === ubicacionData.uh_NumeroColumna &&
                        u.uh_NumeroPosicion === ubicacionData.uh_NumeroPosicion
                    );

                    if (found) {
                        ubicacionId = found.uh_IdUbicacionHerr;
                        console.log("Reusing existing ubicacionId:", ubicacionId);
                    } else {
                        alert("Esta combinación de Fila, Columna y Posición ya existe. Sin embargo, no se pudo recuperar automáticamente. Por favor elija otra ubicación.");
                        return;
                    }
                } else {
                    alert("No se pudo crear la ubicación. Verifique los datos o notifique al sistema.");
                    throw err; // Re-throw if it wasn't the unique constraint error
                }
            }

            if (!ubicacionId) {
                throw new Error("Can't get IdUbicacionHerr");
            }

            const dieSetData = {
                di_CodigoDieSet: data.di_CodigoDieSet,
                di_Dimensiones: data.di_Dimensiones,
                di_IdPiso: data.di_IdPiso,
                di_IdEstanteria: data.di_IdEstanteria,
                di_IdUbicacionDieset: ubicacionId,
            };

            const res = await CreatePost("/api/diesets/", "POST", dieSetData);
            console.log("Created DieSet Response:", res);

            const createdDieSetId = res?.di_IdDieSet || res?.id || res?.data?.di_IdDieSet || res?.data?.id;

            if (createdDieSetId) {
                // Update wizard progress context and pre-select the newly created DieSet
                updateFormData({
                    hesp_IdDieSet: createdDieSetId,
                    uh_NumeroFila: data.uh_NumeroFila,
                    uh_NumeroColumna: data.uh_NumeroColumna,
                    uh_NumeroPosicion: data.uh_NumeroPosicion,
                    hesp_IdPiso: data.di_IdPiso,
                    hesp_IdEstanteria: data.di_IdEstanteria,
                });
                reset();
                navigate("/CreateUbic");
            } else {
                alert("DieSet creado pero no se encontró un ID en la respuesta. ¡Verifica la consola!");
            }
        } catch (error) {
            console.error("Error creating DieSet:", error);
            alert("Ocurrió un error al crear el DieSet.");
        }
    };

    return (
        <>
            <NavBar />
            <div className="max-w-7xl mx-auto p-4 md:p-8 font-['Poppins']">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Creación de Die-Set</h1>
                </div>

                <form onSubmit={handleSubmit(onFinalSubmit, (formErrors) => console.log("Validation errors:", formErrors))} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Form Fields */}
                        <div className="space-y-6 bg-gray-50 p-6 rounded-lg border">
                            <h1 className="">Información del Die-Set</h1>

                            <div>
                                <label className="block p-2">Código DieSet</label>
                                <input
                                    type="text"
                                    {...register("di_CodigoDieSet")}
                                    className="w-full p-2 border rounded bg-white"
                                />
                                {errors.di_CodigoDieSet && <p className="text-red-500 text-sm">{errors.di_CodigoDieSet.message}</p>}
                            </div>

                            <div>
                                <label className="block p-2 font-bold">Dimensiones</label>
                                <input
                                    type="text"
                                    {...register("di_Dimensiones")}
                                    className="w-full p-2 border rounded bg-white"
                                />
                                {errors.di_Dimensiones && <p className="text-red-500 text-sm">{errors.di_Dimensiones.message}</p>}
                            </div>

                            <div>
                                <label className="block p-2 font-bold">Piso</label>
                                <select {...register("di_IdPiso")} className="w-full p-2 border rounded bg-white">
                                    <option value="" hidden>Seleccione Piso</option>
                                    {pisos.map((piso, index) => (
                                        <option value={piso.pi_NumeroPiso ?? index} key={piso.pi_NumeroPiso ?? index}>
                                            {piso.pi_DescripcionPiso ?? ""}
                                        </option>
                                    ))}
                                </select>
                                {errors.di_IdPiso && <p className="text-red-500 text-sm">{errors.di_IdPiso.message}</p>}
                            </div>

                            <div>
                                <label className="block p-2 font-bold">Estante</label>
                                <select {...register("di_IdEstanteria")} className="w-full p-2 border rounded bg-white">
                                    <option value="" hidden>Seleccione Estante</option>
                                    {estanterias?.map((estante, index) => (
                                        <option value={estante.es_IdEstanteria ?? index} key={estante.es_IdEstanteria ?? index}>
                                            {estante.es_NombreEstanteria ?? ""}
                                        </option>
                                    ))}
                                </select>
                                {errors.di_IdEstanteria && <p className="text-red-500 text-sm">{errors.di_IdEstanteria.message}</p>}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block p-2 font-bold">Fila</label>
                                    <DropDown length={8} start={0} {...register("uh_NumeroFila")} className="w-full p-2 border rounded bg-white" />
                                    {errors.uh_NumeroFila && <p className="text-red-500 text-sm">{errors.uh_NumeroFila.message}</p>}
                                </div>
                                <div>
                                    <label className="block p-2 font-bold">Columna</label>
                                    <DropDown length={31} start={0} {...register("uh_NumeroColumna")} className="w-full p-2 border rounded bg-white" />
                                    {errors.uh_NumeroColumna && <p className="text-red-500 text-sm">{errors.uh_NumeroColumna.message}</p>}
                                </div>
                                <div>
                                    <label className="block p-2 font-bold">Posición</label>
                                    <DropDown length={22} start={0} {...register("uh_NumeroPosicion")} className="w-full p-2 border rounded bg-white" />
                                    {errors.uh_NumeroPosicion && <p className="text-red-500 text-sm">{errors.uh_NumeroPosicion.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Schema representation */}
                        <div className="bg-gray-50 p-6 rounded-lg border flex flex-col items-center justify-center">
                            <h3 className="font-bold text-sm text-gray-700 mb-2 uppercase">Esquema Técnico de Referencia</h3>
                            <img
                                src={schemeDieSet}
                                alt="Esquema DieSet"
                                className="max-h-64 object-contain border p-2 bg-white rounded"
                                onError={(e) => {
                                    e.currentTarget.src = defaultScheme;
                                }}
                            />
                        </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t">
                        <Button
                            type="button"
                            onClick={() => navigate(-1)}
                            variant="primary"
                        >
                            Volver
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!canContinue}
                        >
                            Guardar DieSet
                        </Button>

                    </div>
                </form>
            </div>
        </>
    );
}