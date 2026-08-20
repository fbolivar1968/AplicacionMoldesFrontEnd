import '../styles/globals.css'
import * as React from "react";
import NavBar from "../Components/NavBar.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.js";
import { useEffect, useState } from "react";
import useAxios from "../Hooks/useAxios/IndexAx.js";
import familiasSchema from "../assets/Schemas/familias.schema.json" with { type: "json" };
import QRCode from "react-qr-code";
import useToolImage from "../Hooks/useToolImage.js";
import useToolPlano from "../Hooks/useToolPlano.js";
import useToolQrCode from "../Hooks/useToolQrCode.js";
import useToolManual from '../Hooks/useToolManual.js';



export default function VisualMold() {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchData } = useAxios();
    const [toolData, setToolData] = useState<Record<string, any> | null>(null);

    useEffect(() => {
        const loadData = async () => {
            const resTool = await fetchData({ url: `/api/herramental_especifico/${id}/` });
            if (resTool) {
                setToolData(resTool);
            }
        };
        if (id) loadData();
    }, [id]);

    const { imageUrl } = useToolImage(toolData?.hesp_IdImagen);
    const { planoUrl } = useToolPlano(toolData?.hesp_IdPlano);
    const { manualUrl } = useToolManual(toolData?.hesp_IdManual);
    const [isOpen, setIsOpen] = useState(false);

    const familyInfo = toolData ? familiasSchema[toolData.codigo_familia as keyof typeof familiasSchema] : null;

    const qrCodeValue = useToolQrCode(toolData);

    const handleOpenPlano = () => {
        if (planoUrl) {
            window.open(planoUrl, "_blank", "noopener,noreferrer");
        } else {
            alert("No hay un plano disponible para este herramental.");
        }
    };

    const handleOpenManual = () => {
        if (manualUrl) {
            window.open(manualUrl, "_blank", "noopener,noreferrer");
        } else {
            alert("No hay un manual disponible para este herramental.");
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("¿Está seguro de que desea eliminar este herramental?")) {
            fetchData({
                url: `/api/herramental_especifico/${id}/`,
                method: "DELETE",
            });
        }
    };



    if (!toolData) return <div className="p-10 text-center">Cargando datos del herramental...</div>;


    return (
        <div className="bg-white min-h-screen font-['Poppins']">
            <NavBar />

            {/* Main Container */}
            <div className="max-w-7xl mx-auto p-4 md:p-8">

                {/* Header with Edit Button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        Hoja de vida molde {toolData.hesp_CodigoHerramental}
                    </h1>
                    {user && user.user_type !== 3 && (
                        <div className="">
                            <button className="btn btn-orange" onClick={() => navigate(`/EditHerramental/${id}`)}>
                                Editar
                            </button>

                            <button className="flex flex-col btn btn-blue" onClick={() => handleDelete(id)}>
                                Eliminar Herramental
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* COLUMN 1: Image & Technical List */}
                    <div className="flex flex-col space-y-4">
                        <img
                            src={imageUrl || "./default-image.svg"}
                            alt={toolData.hesp_CodigoHerramental}
                            className="w-full aspect-[3/4] object-contain border border-gray-300 rounded"
                        />


                        <div className="text-sm border border-gray-200">
                            <div className={`lightGrey p-3 space-y-1`}>
                                <p><strong>N° Molde:</strong> {toolData.hesp_IdHerramentalEspecifico}</p>
                                <p><strong>Codigo Alterno:</strong> {toolData.hesp_CodigoAlterno}</p>
                                <p><strong>Tipo de Herramental:</strong>{toolData.nombre_tipo_herra}</p>
                                <p><strong>Familia:</strong> {toolData.nombre_familia}</p>
                                <p><strong>Cantidad de Herramental:</strong> {toolData.hesp_CantHerramental}</p>
                            </div>
                            <div className="p-3 space-y-1">
                                <p><strong>Máquinas compatibles</strong></p>
                                <p><strong>N° Maq. Principal:</strong> {toolData.num_maquina_pp}</p>
                                <p><strong>N° Maq. Opcional:</strong> {toolData.num_maquina_opc || "Sin Maq. Opcional"} </p>
                                <p><strong>Die-Set:</strong> {toolData.codigo_dieset}</p>
                            </div>
                        </div>



                        {/* <button className={`btn-orange text-white py-2 px-4 rounded w-max mt-4 text-sm font-bold uppercase`}>
                            Historial producción
                        </button> */}
                    </div>

                    {/* COLUMN 2: QR, Location & Schema */}
                    <div className="space-y-6">
                        {/* QR & ID Section */}
                        <div className="flex items-center space-x-4">
                            <div className="w-24 h-24 bg-white flex items-center justify-center border border-gray-300 rounded p-1 shadow-sm">
                                <button onClick={() => setIsOpen(true)}>
                                    <QRCode
                                        value={qrCodeValue}
                                        size={256}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    />
                                </button>
                                <React.Fragment>
                                    {isOpen && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                                <div className="text-sm border border-gray-200">
                                                    <div className={`lightGrey p-3 space-y-1`}>
                                                        <p><strong>Descripción QR</strong></p>
                                                        <p><strong>N° Molde:</strong> {toolData.hesp_IdHerramentalEspecifico}</p>
                                                        <p><strong>Codigo Alterno:</strong> {toolData.hesp_CodigoAlterno}</p>
                                                        <p><strong>Tipo de Herramental:</strong>{toolData.nombre_tipo_herra}</p>
                                                        <p><strong>Familia:</strong> {toolData.nombre_familia}</p>
                                                        <p><strong>Maquina Principal:</strong> {toolData.num_maquina_pp}</p>
                                                        <p><strong>Maquina Opcional:</strong> {toolData.num_maquina_opc}</p>
                                                        <p><strong>Piso:</strong> {toolData.numero_piso}</p>
                                                        <p><strong>Estante:</strong> {toolData.nombre_estanteria}</p>
                                                        <p><strong>Fila:</strong> {toolData.numero_fila}</p>
                                                        <p><strong>Columna:</strong> {toolData.numero_columna}</p>
                                                        <p><strong>Posición:</strong> {toolData.numero_posicion}</p>
                                                        <p><strong>Estado:</strong> {toolData.nombre_estado_Herr}</p>
                                                        <p><strong>Cantidad de Herramental:</strong> {toolData.hesp_CantHerramental}</p>
                                                    </div>
                                                </div>

                                                <button onClick={() => setIsOpen(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
                                                    Cerrar
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                                {/* QR Description */}

                            </div>
                            <h2 className="text-4xl font-black orangeText">
                                {toolData.hesp_CodigoHerramental}
                            </h2>
                        </div>

                        {/* Location Sub-Grid */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                                <h4 className="font-bold border-b border-gray-300 pb-1">Ubicación Molde:</h4>
                                <p><strong>Piso:</strong> {toolData.numero_piso}</p>
                                <p><strong>Descripción: </strong> {toolData.descripcion_piso} </p>
                                <p><strong>Estante:</strong> {toolData.nombre_estanteria}</p>
                                <p><strong>Fila:</strong> {toolData.numero_fila}</p>
                                <p><strong>Columna:</strong> {toolData.numero_columna}</p>
                                <p><strong>Posición:</strong> {toolData.numero_posicion}</p>
                                <p><strong>Existencia:</strong> 1</p>
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold border-b border-gray-300 pb-1">Ubicación Die-Set:</h4>
                                <p><strong>Piso:</strong> 1</p>
                                <p><strong>Estante:</strong> A</p>
                                <p><strong>Fila:</strong> 2</p>
                                <p><strong>Columna:</strong> 5</p>
                                <p><strong>Posición:</strong> 3</p>
                            </div>
                        </div>

                        <div className="text-sm">
                            <p><strong>Estado Molde:</strong> {toolData.nombre_estado_Herr}</p>
                            <div className="mt-4">
                                <p className="font-bold">Actividad Pendiente: </p>
                                <p className="ml-4 text-gray-600">{toolData.nombre_actividad}</p>
                                <h4 className="text-sm font-bold border-b border-gray-500 pb-1 mb-2">Observaciones:</h4>
                                <p className="text-xs leading-relaxed italic">
                                    {toolData.hesp_Observacion || "Sin observaciones adicionales registradas en el sistema."}
                                </p>
                            </div>
                        </div>

                        {/* Technical Drawing Section */}
                        <div className="pt-4 border-t border-gray-100">
                            <h3 className={`font-bold orangeText mb-4 uppercase text-sm`}>
                                Esquema Familia {familyInfo?.EsquemaFamilia || 'HEX'}
                            </h3>
                            <img
                                src={`http://10.1.1.14:8000/api/media/esquemas/` + familyInfo?.EsquemaFamilia + `.png`}
                                alt="Esquema Técnico"
                                className="w-full h-auto mb-4 border border-gray-100 p-2"
                            />


                            {/* Literals / Dimensions boxes */}
                            <div className="mt-4">
                                <h4 className="text-xs font-bold mb-2">Dimensiones:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {familyInfo?.Literals.map((lit: string) => (
                                        <div key={lit} className="border-2 border-orange-400 px-4 py-2 min-w-[60px] text-center rounded">
                                            <span className="block text-[10px] uppercase font-bold text-gray-500">{lit}</span>
                                            <span className="text-lg font-bold">{toolData[`hesp_${lit}`] || '0'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 3: Mechanical Specs & Observations */}
                    <div className="flex flex-col">
                        {/* Mechanical Specs Card */}
                        <div className={`darkGrey text-white p-6 rounded-sm flex-grow relative`}>
                            <h3 className={`font-bold text-lg mb-6 orangeText uppercase`}>
                                Características Mecánicas
                            </h3>

                            <div className="space-y-6 bg-dark-greyFB rounded-md p-4">
                                <div className="flex items-start space-x-3">
                                    <div className={`p-2 rounded orange`}>
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold">Fecha de elaboración:</p>
                                        <p>{toolData.fecha_creacion || "Sin datos"}</p>
                                        <p className="text-xs font-bold mt-1">Material:</p>
                                        <p>{toolData.nombre_acero || "Sin datos"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className={`p-2 rounded orange`}>
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 3 10 13 11 13 11z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-300">Acero:</p>
                                        <div className="mt-2 space-y-2">
                                            <p className="text-xs">{toolData.nombre_acero || "Sin datos"}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-300">Dureza:</p>
                                        <div className="mt-2 space-x-3">
                                            <p className="text-xs">{toolData.nombre_dureza || "Sin datos"}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-300">Proveedor:</p>
                                        <div className="mt-2 space-y-5">
                                            <p className="text-xs">{toolData.nombre_proveedor || "Sin datos"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <h4 className="text-sm font-bold border-b border-gray-500 pb-1 mb-2">Observaciones:</h4>
                                    <p className="text-xs leading-relaxed italic">
                                        {toolData.descripcion_herra || "Sin observaciones adicionales registradas en el sistema."}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-4">
                                <button className="btn btn-orange" onClick={handleOpenPlano}>
                                    Ver plano
                                </button>
                                <button className="btn btn-orange" onClick={handleOpenManual}>
                                    Ver manual
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}