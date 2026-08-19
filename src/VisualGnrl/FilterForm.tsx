import '../styles/globals.css'
import Search from '../Components/Search.jsx';
import { useId, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HerramentalModelSchema } from "../Hooks/Validators/HerramentalEsp.js";
import { useHerramental } from '../Hooks/useAxios/useHerramental.js'
import MenuIcon from '@mui/icons-material/Menu';


// Seleccionamos solo lo necesario para el filtro
const FilterFormSchema = HerramentalModelSchema.pick({
    hesp_IdTipoHerramental: true,
    hesp_IdFamilia: true,
    hesp_IdMaquinaPP: true,
    hesp_IdEstanteria: true,
    hesp_IdDieSet: true,
    nombre_maquina_pp: true,
    nombre_maquina_opc: true,
});

export default function FilterForm({
    isOpen: propIsOpen,
    setIsOpen: propSetIsOpen,
    globalFilter,
    setGlobalFilter,
    onApplyFilters
}: {
    isOpen?: boolean;
    setIsOpen?: (value: boolean) => void;
    globalFilter?: string;
    setGlobalFilter?: (value: string) => void;
    onApplyFilters?: (filters: any) => void;
}) {
    const { useGetLookups } = useHerramental();
    const selectId = useId();

    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;

    const toggleOpen = () => {
        if (propSetIsOpen) {
            propSetIsOpen(!isOpen);
        } else {
            setInternalIsOpen(!isOpen);
        }
    };

    // 1. Get data for filters
    const { tipos, familias, maquinas, estanterias, dieSets } = useGetLookups();

    const { handleSubmit, setValue } = useForm({
        resolver: zodResolver(FilterFormSchema),
        defaultValues: {
            hesp_IdTipoHerramental: 0,
            hesp_IdFamilia: 0,
            hesp_IdMaquinaPP: 0,
            hesp_IdEstanteria: 0,
            nombre_maquina_opc: "",
            nombre_maquina_pp: "",
            hesp_IdDieSet: 0,
        },
    });

    // 2. Global loading state (optional)
    const isLoading = tipos.isLoading || familias.isLoading || maquinas.isLoading || estanterias.isLoading;

    const onSubmit = (data: any) => {
        console.log("Filtros Aplicados:", data);
        if (onApplyFilters) {
            onApplyFilters(data);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={`bg-orangeFB h-full flex flex-col  
            shadow-3xl fixed inset-y-0 left-0 z-50 w-64 p-2
            transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <button
                type="button"
                className="absolute top-10 -right-12 z-50 p-2 rounded-r-md bg-orangeFB text-white shadow-md hover:bg-orange-600 focus:outline-none cursor-pointer flex items-center justify-center"
                onClick={toggleOpen}>
                <MenuIcon fontSize="large" className="text-blueFB" />
            </button>

            {setGlobalFilter && (
                <Search globalFilter={globalFilter ?? ''} setGlobalFilter={setGlobalFilter} onToggleMenu={toggleOpen} />
            )}

            {isLoading ? (
                <p className="text-white text-xs animate-pulse">Cargando filtros...</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {/* Ubicación / Estanterías */}
                    <div>
                        <label className="p-2 text-sm font-bold">Ubicación</label>
                        <select onChange={(e) => setValue('hesp_IdEstanteria', Number(e.target.value))}>
                            <option value="">Estante</option>
                            {Array.isArray(estanterias.data) && estanterias.data.map((est: any) => (
                                <option key={est.es_IdEstanteria} value={est.es_IdEstanteria}>
                                    {est.es_NombreEstanteria}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Máquinas */}
                    <div>
                        <label className="block p-2 text-sm font-bold">N° máquina PP</label>
                        <select onChange={(e) => setValue('hesp_IdMaquinaPP', Number(e.target.value))}>
                            <option value="">Seleccionar máquina</option>
                            {Array.isArray(maquinas.data) && maquinas.data.map((maq: any) => (
                                <option key={maq.id} value={maq.id}>
                                    {maq.numero ?? `Máquina ${maq.numero}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* DieSets */}
                    <div>
                        <label className="block p-2 text-sm font-bold">DieSet</label>
                        <select onChange={(e) => setValue('hesp_IdDieSet', Number(e.target.value))}>
                            <option value="">Seleccionar DieSet</option>
                            {Array.isArray(dieSets.data) && dieSets.data.map((die: any) => (
                                <option key={die.di_IdDieSet} value={die.di_IdDieSet}>
                                    {die.di_CodigoDieSet ?? `DieSet ${die.di_IdDieSet}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Familia */}
                    <div>
                        <label className="block p-2 text-sm font-bold">Familia</label>
                        <select onChange={(e) => setValue('hesp_IdFamilia', Number(e.target.value))}>
                            <option value="">Seleccionar familia</option>
                            {Array.isArray(familias.data) && familias.data.map((fam: any) => (
                                <option key={fam.fa_IdFamilia} value={fam.fa_IdFamilia}>
                                    {fam.fa_NombreFamilia}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tipos de Herramental */}
                    <div>
                        <label className="block p-2 text-sm font-bold">Tipo de Herramental</label>
                        <select onChange={(e) => setValue('hesp_IdTipoHerramental', Number(e.target.value))}>
                            <option value="">Seleccionar tipo</option>
                            {tipos.data?.map((tipo: any) => (
                                <option key={tipo.th_IdTipoHerramental} value={tipo.th_IdTipoHerramental}>
                                    {tipo.th_NombreTipoHerramental}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <button type="submit" className="btn btn-blue text-xs">Aplicar</button>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="btn btn-blue text-xs"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}