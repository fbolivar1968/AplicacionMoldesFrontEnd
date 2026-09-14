import { useMemo } from 'react';
import { type FamiliasSchema, type FamilySchemaItem } from './Validators/FamilyScheme.js';
import rawFamiliasSchema from '../assets/Schemas/familias.schema.json' with { type: 'json' };

const familiasSchema = rawFamiliasSchema as FamiliasSchema;

export default function useToolQrCode(toolData: any) {
    const familyCode = toolData?.codigo_familia || toolData?.fa_CodigoFamilia || 'nan';
    const familyData: FamilySchemaItem = familiasSchema[familyCode] ?? familiasSchema['nan'];
    const literals: string[] = familyData?.Literals || [];

    const qrCodeValue = useMemo(() => {
        if (!toolData) return "";

        const measuresLines = literals.map(
            (lit) => `Medida ${lit}: ${toolData[`hesp_${lit}`] ?? ""}`
        );
        return [
            "Codigo herramental: " + (toolData.hesp_CodigoHerramental || ""),
            "Codigo alterno: " + (toolData.hesp_CodigoAlterno || ""),
            "Medidas: " + measuresLines.join("\n"),
            "CantHerramental: " + (toolData.hesp_CantHerramental || ""),
            "Maq.principal: " + (toolData.nombre_maquina_pp || ""),
            "Maq.Opcional: " + (toolData.nombre_maquina_opc || ""),
            "DieSet: " + (toolData.codigo_dieset || ""),
            "Ubicacion Molde: " + "Piso " + (toolData.numero_piso || "") + " Estante " + (toolData.nombre_estanteria || "") + " Fila " + (toolData.numero_fila || "") + " Celda " + (toolData.numero_columna || "") + " Posicion " + (toolData.numero_posicion || ""),
            "EstadoMolde: " + (toolData.nombre_estado_Herr || ""),
            "hesp_Descripcion1: " + (toolData.hesp_Descripcion1 || "")
        ].join("\n");
    }, [toolData, literals]);

    const displayedText = useMemo(() => {
        if (!toolData) return null;

        return (
            <>
                <p><strong>Codigo Molde:</strong> {toolData.hesp_CodigoHerramental}</p>
                <p><strong>Codigo Alterno:</strong> {toolData.hesp_CodigoAlterno}</p>
                <p><strong>Tipo de Herramental:</strong> {toolData.nombre_tipo_herra}</p>
                <p><strong>Familia:</strong> {toolData.nombre_familia}</p>
                {literals.map((lit) => (
                    <p key={lit}><strong>Medida {lit}:</strong> {toolData[`hesp_${lit}`] ?? ""}</p>
                ))}
                <p><strong>Maquina Principal:</strong> {toolData.num_maquina_pp}</p>
                <p><strong>Maquina Opcional:</strong> {toolData.num_maquina_opc}</p>
                <p><strong>Piso:</strong> {toolData.numero_piso}</p>
                <p><strong>Estante:</strong> {toolData.nombre_estanteria}</p>
                <p><strong>Fila:</strong> {toolData.numero_fila}</p>
                <p><strong>Columna:</strong> {toolData.numero_columna}</p>
                <p><strong>Posición:</strong> {toolData.numero_posicion}</p>
                <p><strong>Estado:</strong> {toolData.nombre_estado_Herr}</p>
                <p><strong>Cantidad de Herramental:</strong> {toolData.hesp_CantHerramental}</p>
            </>
        );
    }, [toolData, literals]);

    return {
        qrCodeValue,
        displayedText,
        // Allow backwards-compatibility if coerced to string or used directly where string was expected
        toString: () => qrCodeValue,
        valueOf: () => qrCodeValue,
    };
}
