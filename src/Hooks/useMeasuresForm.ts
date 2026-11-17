import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HerramentalModelSchema, PageMeasuresSchema } from "./Validators/HerramentalEsp.js"
type MeasuresFormData = z.infer<typeof PageMeasuresSchema>;
import { type FamiliasSchema, type FamilySchemaItem } from "./Validators/FamilyScheme.js";
import rawFamiliasSchema from '../assets/Schemas/familias.schema.json' with {type: 'json'};


import { useFormData } from "./FormNewHerrContext/HerrContext.js";

// Properly cast the JSON as our typed schema
const familiasSchema = rawFamiliasSchema as FamiliasSchema;


export const useMeasuresForm = (familyCode: string | undefined) => {
    const { formData } = useFormData();

    // Handle the lookup with a fallback to 'nan'
    const effectiveCode = (familyCode && familiasSchema[familyCode]) ? familyCode : 'nan';
    const familyData: FamilySchemaItem = familiasSchema[effectiveCode] ?? familiasSchema['nan'];

    // Initialize the form with types
    const methods = useForm<MeasuresFormData>({
        shouldUnregister: true,
        resolver: zodResolver(PageMeasuresSchema),
        mode: "onChange",
        defaultValues: formData,
    });

    const assetBaseUrl = "http://10.1.1.52/media/esquemas/";
    //const assetBaseUrl = import.meta.env.VITE_MEDIA_URL || "http://localhost:8000/media/esquemas/";
    return {
        ...methods,
        literals: familyData.Literals,
        schemeUrl: `${assetBaseUrl}${familyData.EsquemaFamilia}.png`,
        familyName: familyData.Familia,
    };

};



