import { z } from "zod"

export const HerramentalModelSchema = z.object({
    id: z.number().int().optional(),
    nombre: z.string().max(100),
    codigo: z.string().max(10),
    i: z.number().int().optional(),
    consecutive: z.number(),



    hesp_IdHerramentalEspecifico: z.number().int().optional(),
    hesp_CodigoHerramental: z.string().max(10),
    hesp_CodigoAlterno: z.string().min(3, "Mínimo 3 caracteres").max(15),
    hesp_Descripcion1: z.string().min(0).max(200).optional(),
    hesp_Descripcion2: z.string().min(0).max(200).optional(),
    hesp_CantPieza: z.number().int().min(7).max(4).optional(),
    hesp_Observacion: z.string().min(0).max(100).nullable(),
    hesp_IdImagen: z.number().int().nullable().optional(), // Define que es un entero
    hesp_Criticidad: z.string().max(20).nullable(),

    // Specific technical attributes
    hesp_NumNariz: z.number().int().max(255).nullable(),
    hesp_NumCopas: z.number().int().max(255).nullable(),
    hesp_Radio: z.number().nullable(),
    hesp_Altura1: z.number().nullable(),
    hesp_Altura2: z.number().nullable(),
    hesp_Grado: z.number().nullable(),
    hesp_Ancho: z.number().nullable(),
    hesp_Diametro: z.number().nullable(),
    hesp_Profundidad: z.number().nullable(),
    hesp_ProfunRecogida: z.number().nullable(),
    hesp_Largo: z.coerce.number().nullable(),
    hesp_A: z.coerce.number().nullish(),
    hesp_B: z.coerce.number().nullish(),
    hesp_C: z.coerce.number().nullish(),
    hesp_D: z.coerce.number().nullish(),
    hesp_E: z.coerce.number().nullish(),

    // Herramental
    he_IdHerramental: z.coerce.number().min(1, "Debe seleccionar un herramental"),
    he_NombreHerramental: z.string().max(15),
    he_CodigoHerramental: z.string().max(10),

    // Herramental Type
    th_IdTipoHerramental: z.coerce.number().min(1, "Debe seleccionar un tipo"), th_NombreTipoHerramental: z.string().max(15),
    th_CodigoTipoHerramental: z.string().max(4),

    //Family
    fa_IdFamilia: z.coerce.number().min(1, "Debe seleccionar una familia"),
    fa_CodigoFamilia: z.string().max(4).optional(),
    fa_NombreFamilia: z.string().max(15),




    // Foreign Keys (Required per SQL constraints)
    hesp_IdHerramental: z.coerce.number().int(),
    hesp_IdTipoHerramental: z.coerce.number().int(),
    hesp_IdFamilia: z.coerce.number().int(),
    hesp_IdEstadoHerr: z.number().int(),
    hesp_IdMaquinaPP: z.number().int(),
    nombre_familia: z.string().max(15),
    nombre_maquina_pp: z.string().max(30),
    nombre_maquina_opc: z.string().max(30).optional(),
    nombre_actividad: z.string().max(30).optional(),
    hesp_IdPiso: z.number().int(),
    hesp_IdEstanteria: z.number().int(),
    hesp_IdUbicacionHerr: z.number().int(),
    hesp_IdDieSet: z.coerce.number().int(),
});

//export type HerramentalModelSchema = z.infer<typeof HerramentalModelSchema>;

export const PageMeasuresSchema = HerramentalModelSchema.pick({

    hesp_A: true,
    hesp_B: true,
    hesp_C: true,
    hesp_D: true,
    hesp_E: true,
    hesp_Observacion: true,
    hesp_Descripcion1: true,

});

export const PageUbic = HerramentalModelSchema.pick({

    hesp_A: true,
    hesp_B: true,
    hesp_C: true,
    hesp_D: true,
    hesp_E: true,
    hesp_Observacion: true,

});

export const DropdownItem = HerramentalModelSchema.pick({
    id: true,
    nombre: true,
});

// Tipo para las respuestas de error comunes del backend (Django)
export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}