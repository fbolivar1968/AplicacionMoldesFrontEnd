import { useState, useCallback } from 'react';
import apiClient from './useAxios/apiClient.js';

export interface HerramentalLookupResult {
    id: number | null;
    herramental: any | null;
    error: any | null;
}

/**
 * Utility function to fetch a herramental ID and record by searching its hesp_CodigoAlterno.
 */
export async function getHerramentalByCodigoAlterno(codigoAlterno: string | number): Promise<{ id: number | null; data: any | null }> {
    if (!codigoAlterno) return { id: null, data: null };

    const searchCode = String(codigoAlterno).trim();
    if (!searchCode) return { id: null, data: null };

    try {
        const res = await apiClient.get('/api/herramental_especifico/', {
            params: { hesp_CodigoAlterno: searchCode }
        });
        const resData = res.data;
        const list = Array.isArray(resData)
            ? resData
            : (resData?.results || (resData ? [resData] : []));

        // Find exact or case-insensitive match
        const match = list.find((item: any) =>
            String(item?.hesp_CodigoAlterno || '').trim().toLowerCase() === searchCode.toLowerCase()
        ) || (list.length === 1 ? list[0] : null);

        const targetId = match?.hesp_IdHerramentalEspecifico ?? match?.id ?? null;
        return { id: targetId, data: match || null };
    } catch (err) {
        console.error("Error looking up herramental by hesp_CodigoAlterno:", err);
        throw err;
    }
}

/**
 * React hook to search and retrieve a herramental ID by hesp_CodigoAlterno with loading and error states.
 */
export default function useHerramentalByCodigoAlterno() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any | null>(null);

    const findHerramental = useCallback(async (codigoAlterno: string | number) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getHerramentalByCodigoAlterno(codigoAlterno);
            return result;
        } catch (err) {
            setError(err);
            return { id: null, data: null };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        findHerramental,
        loading,
        error,
    };
}

