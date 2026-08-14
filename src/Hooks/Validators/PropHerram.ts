import { z } from 'zod';

export const PropiedadHerramentalSchema = z.object({
    ph_IdPropiedadHerramental: z.number().int().optional(),
    ph_DescripHerra: z.string().max(500),
    ph_FechaCreacion: z.date().optional(),
});
export type PropiedadHerramentalSchema = z.infer<typeof PropiedadHerramentalSchema>;

export const AceroSchema = z.object({
    ac_IdAcero: z.number().int().optional(),
    ac_DescripAcero: z.string().max(50),
});
export type AceroSchema = z.infer<typeof AceroSchema>;

export const DurezaSchema = z.object({
    du_IdDureza: z.number().int().optional(),
    du_ValorDureza: z.string().max(10),
});
export type DurezaSchema = z.infer<typeof DurezaSchema>;

export const ProveedorSchema = z.object({
    pr_IdProveedor: z.number().int().optional(),
    pr_NombreProv: z.string().max(100),

});
export type ProveedorSchema = z.infer<typeof ProveedorSchema>;


export const HerramentalProveedorSchema = z.object({
    hp_IdHerramental: z.number().int().positive(),
    hp_IdProveedor: z.number().int().positive(),
    hp_PrecioTotal: z.number().nonnegative()
});

export type HerramentalProveedor = z.infer<typeof HerramentalProveedorSchema>;

export const HerramentalDurezaSchema = z.object({
    hd_IdHerramental: z.number().int().positive(),
    hd_IdDureza: z.number().int().positive()
});

export type HerramentalDureza = z.infer<typeof HerramentalDurezaSchema>;


export const HerramentalAceroSchema = z.object({
    ha_IdHerramental: z.number().int().positive(),
    ha_IdAcero: z.number().int().positive()
});

export type HerramentalAcero = z.infer<typeof HerramentalAceroSchema>;

export const MechanicalFormSchema = z.object({
    ac_IdAcero: z.coerce.number().min(1, "Debe seleccionar un acero"),
    du_IdDureza: z.coerce.number().min(1, "Debe seleccionar una dureza"),
    pr_IdProveedor: z.coerce.number().min(1, "Debe seleccionar un proveedor"),
    php_PrecioTotal: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0").optional().or(z.literal("")),
    ph_FechaCreacion: z.string().optional(),
    ph_DescripHerra: z.string().max(500, "Máximo 500 caracteres").optional(),
});

export type MechanicalFormValues = z.infer<typeof MechanicalFormSchema>;