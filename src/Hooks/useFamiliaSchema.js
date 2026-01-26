// src/hooks/useFamiliaSchema.js

import familiasSchema from '../data/familias.schema.json';

const useFamiliaSchema = (codFamilia) => {
    if (!codFamilia || codFamilia === 'nan') {
        return []; // No hay literales si el código es inválido
    }

    const familiaData = familiasSchema[codFamilia];

    if (familiaData && Array.isArray(familiaData.Literals)) {
        // Retorna solo la lista de literales
        return familiaData.Literals;
    }

    return []; // Por defecto, retorna un array vacío
};

export default useFamiliaSchema;