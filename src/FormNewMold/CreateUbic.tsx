import '../styles/globals.css';
import * as React from "react";
import NavBar from "../Components/NavBar.jsx";
import useAxios from "../Hooks/useAxios/IndexAx.js";
import { useEffect, useState } from "react";
import DropDown from "../Components/DropDown.js";
import { UbicacionHerramentalSchema } from "../Hooks/Validators/Ubication.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useBlocker } from "react-router-dom";
import { useFormData } from "../Hooks/FormNewHerrContext/HerrContext.js";
import { z } from "zod";

type DropdownItem = {
    id?: number;
    numero?: number | string;
    nombre?: string;
    es_IdEstanteria?: number;
    es_NombreEstanteria?: string;
    pi_NumeroPiso?: number | string;
    pi_DescripcionPiso?: string;
    di_IdDieSet?: number;
    di_CodigoDieSet?: number | string;
    eh_IdEstadoHerr?: number;
    eh_NombreEstado?: string;
};

type FormValues = z.infer<typeof UbicacionHerramentalSchema>;

export function CreateUbic() {
    const { formData, updateFormData, clearForm } = useFormData();
    const navigate = useNavigate();
    const { response, fetchData, CreatePost } = useAxios();



    const [maquinas, setMaquinas] = useState<DropdownItem[]>([]);
    const [pisos, setPisos] = useState<DropdownItem[]>([]);
    const [estanterias, setEstanterias] = useState<DropdownItem[]>([]);
    const [estados, setEstados] = useState<DropdownItem[]>([]);
    const [actividades, setActividades] = useState<DropdownItem[]>([]);
    const [diesets, setDiesets] = useState<DropdownItem[]>([]);

    //const [maquinas, pisos, estanterias, actividades, diesets] = response || [[], [], [], [], []];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<FormValues>({
        resolver: zodResolver(UbicacionHerramentalSchema) as unknown as import("react-hook-form").Resolver<FormValues>,
        defaultValues: {
            hesp_IdMaquinaPP: formData.hesp_IdMaquinaPP ?? 0,
            hesp_IdMaquinaOpc: formData.hesp_IdMaquinaOpc ?? 0,
            uh_NumeroFila: formData.uh_NumeroFila ?? 0,
            uh_NumeroColumna: formData.uh_NumeroColumna ?? 0,
            uh_NumeroPosicion: formData.uh_NumeroPosicion ?? 0,
            hesp_CantHerramental: formData.hesp_CantHerramental ?? 0,
            hesp_Observacion: formData.hesp_Observacion ?? "",
            hesp_IdActividad: formData.hesp_IdActividad ?? 0,
            hesp_IdEstadoHerr: formData.hesp_IdEstadoHerr ?? 0,
            hesp_IdDieSet: formData.hesp_IdDieSet ?? 0,
            hesp_IdEstanteria: formData.hesp_IdEstanteria ?? 0,
            es_IdEstanteria: formData.es_IdEstanteria ?? 0,
            hesp_IdPiso: formData.hesp_IdPiso ?? 0,
            di_CodigoDieSet: formData.di_CodigoDieSet ?? "",
            di_IdDieSet: formData.di_IdDieSet ?? 0,
        },
    });

    useEffect(() => {
        const loadDropdownData = async () => {
            const urls = [
                "/api/maquinas/",
                "/api/actividades/",
                "/api/estanterias/",
                "/api/pisos/",
                "/api/estado_herramental/",
                "/api/diesets/",
            ];

            const results = await fetchData({ url: urls });

            if (results && Array.isArray(results)) {
                const getData = (res: any) => {
                    if (!res) return [];
                    if (Array.isArray(res)) return res;
                    if (res?.results && Array.isArray(res.results)) return res.results;
                    return [];
                };

                setMaquinas(getData(results[0]));
                setActividades(getData(results[1]));
                setEstanterias(getData(results[2]));
                setPisos(getData(results[3]));
                setEstados(getData(results[4]));
                setDiesets(getData(results[5]));
            }
        };

        loadDropdownData();
    }, []);

    // Warn on page reload or closing the tab
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            const hasUnsavedChanges = isDirty || Object.keys(formData).length > 0;
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty, formData]);

    // Intercept back button or SPA navigation
    const wizardRoutes = ["/CreateGnrlv1", "/CreateMeasures", "/CreateUbic", "/CreateUbicDieSet"];
    const blocker = useBlocker(({ nextLocation }) => {
        const leavingWizard = !wizardRoutes.some(route => nextLocation.pathname.startsWith(route));
        const hasData = isDirty || Object.keys(formData).length > 0;
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
                hesp_IdEstanteria: data.hesp_IdEstanteria,
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

            let propiedadHerramentalId = formData?.hesp_IdPropiedadHerramental;

            // Fallback: If hesp_IdPropiedadHerramental wasn't created in step 3, attempt creation now
            if (!propiedadHerramentalId && formData?.ac_IdAcero) {
                try {
                    const propPayload = {
                        ac_IdAcero: formData.ac_IdAcero,
                        du_IdDureza: formData.du_IdDureza,
                        pr_IdProveedor: formData.pr_IdProveedor,
                        php_PrecioTotal: formData.php_PrecioTotal ? Number(formData.php_PrecioTotal) : null,
                        ph_FechaCreacion: formData.ph_FechaCreacion || new Date().toISOString().split('T')[0],
                        ph_DescripHerra: formData.ph_DescripHerra || "",
                    };
                    const resProp = await CreatePost("/api/propiedad_herramental/", "POST", propPayload);
                    propiedadHerramentalId = resProp?.ph_IdPropiedadHerramental || resProp?.id || resProp?.data?.ph_IdPropiedadHerramental;
                } catch (errProp) {
                    console.warn("Could not create PropiedadHerramental on final submit:", errProp);
                }
            }

            const finalData = {
                ...formData,
                ...data,
                hesp_IdUbicacionHerr: ubicacionId,
                ...(propiedadHerramentalId ? { hesp_IdPropiedadHerramental: propiedadHerramentalId } : {})
            };

            updateFormData(data);

            const res = await CreatePost("/api/herramental_especifico/", "POST", finalData);
            console.log("Created Herramental Response:", res);

            const recordId = res?.hesp_IdHerramentalEspecifico || res?.id || res?.data?.hesp_IdHerramentalEspecifico || res?.data?.id;

            if (recordId) {
                clearForm();
                reset();
                navigate(`/VisualMold/${recordId}`);
            } else {
                alert("Herramental creado pero no se encontró un ID en la respuesta. ¡Verifica la consola!");
            }
        } catch (error) {
            console.error("Error creating herramental:", error);
        }
    };

    return (
        <>
            <NavBar />
            <h1>Ubicación</h1>

            <form onSubmit={handleSubmit(onFinalSubmit, (formErrors) => console.log("Validation errors:", formErrors))}>
                <div className="grid grid-cols-[3,fr] grid-rows-[(5,5,5,2)] gap-4 w-screen h-screen m-5">
                    <div className="grid p-2 col-span-2 row-start-1 card-form">
                        <div className="col-start-1 row-start-1">
                            <label className="block p-2">N° máquina PP</label>
                            <select {...register("hesp_IdMaquinaPP")}>
                                <option value="" hidden>N° máquina PP</option>
                                {maquinas?.map((maquina, index) => (
                                    <option value={maquina.id ?? index} key={maquina.id ?? index}>
                                        {maquina.numero ?? ""}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-start-2 row-start-1">
                            <label className="block p-2">N° máquina Opc</label>
                            <select {...register("hesp_IdMaquinaOpc")}>
                                <option value="" hidden>N° máquina Opc</option>
                                {maquinas?.map((maquina, index) => (
                                    <option value={maquina.id ?? index} key={maquina.id ?? index}>
                                        {maquina.numero ?? ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid col-span-3 row-start-2 p-2 card-form">
                        <div className="col-start-1 row-start-2">
                            <label className="block p-2">Piso</label>
                            <select {...register("hesp_IdPiso")}>
                                <option value="" hidden>Piso</option>
                                {pisos.map((piso, index) => (
                                    <option value={piso.pi_NumeroPiso ?? index} key={piso.pi_NumeroPiso ?? index}>
                                        {piso.pi_DescripcionPiso ?? ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-start-2 row-start-2">
                            <label className="block p-2">Estante</label>
                            <select {...register("hesp_IdEstanteria")}>
                                <option value="" hidden>Estante</option>
                                {estanterias?.map((estante, index) => (
                                    <option value={estante.es_IdEstanteria ?? index} key={estante.es_IdEstanteria ?? index}>
                                        {estante.es_NombreEstanteria ?? ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-start-3 row-start-2">
                            <label className="block p-2">Columna</label>
                            <DropDown length={31} start={0} {...register("uh_NumeroColumna")} />
                        </div>

                        <div className="col-start-4 row-start-2">
                            <label className="block p-2">Fila</label>
                            <DropDown length={8} start={0} {...register("uh_NumeroFila")} />
                        </div>

                        <div className="col-start-5 row-start-2">
                            <label className="block p-2">Posición</label>
                            <DropDown length={22} start={0} {...register("uh_NumeroPosicion")} />
                        </div>

                        <div className="col-start-1 row-start-3">
                            <label className="block p-2">DieSet</label>
                            <select {...register("hesp_IdDieSet")}>
                                <option value="" hidden>DieSet</option>
                                {diesets?.map((dieSet, index) => (
                                    <option value={dieSet.di_IdDieSet ?? index} key={dieSet.di_IdDieSet ?? index}>
                                        {dieSet.di_CodigoDieSet ?? ""}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div className="col-start-2 row-start-3">
                            <button onClick={() => navigate("/CreateUbicDieSet")} className="btn btn-orange p-2">Crear DieSet</button>
                        </div>
                    </div>

                    <div className="grid p-2 col-span-2 row-start-3 card-form">
                        <div className="col-start-1 row-start-1">
                            <label className="">Estado</label>
                            <select {...register("hesp_IdEstadoHerr")}>
                                <option value="" hidden>Estado</option>
                                {estados.map((estado, index) => (
                                    <option value={estado.eh_IdEstadoHerr ?? index} key={estado.eh_IdEstadoHerr ?? index}>
                                        {estado.eh_NombreEstado ?? ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-start-2 row-start-1">
                            <label className="block p-2">Actividad Pendiente</label>
                            <select {...register("hesp_IdActividad")}>
                                <option value="" hidden>Actividad Pendiente</option>
                                {actividades?.map((actividad, index) => (
                                    <option value={actividad.id ?? index} key={actividad.id ?? index}>
                                        {actividad.nombre ?? ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-start-3 row-start-1">
                            <label className="block p-2">Existencia</label>
                            <input
                                type="number"
                                {...register("hesp_CantHerramental")}
                                placeholder="Existencia"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-3 flex justify-between m-8">

                    <button type="button" className="btn btn-orange" onClick={() => navigate(-1)}>
                        Atrás
                    </button>

                    <button type="submit" className="btn btn-orange">
                        Finalizar
                    </button>
                </div>
            </form>
        </>
    );
}