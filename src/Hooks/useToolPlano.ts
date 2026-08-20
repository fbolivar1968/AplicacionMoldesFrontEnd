import { useState, useEffect } from 'react';
import useAxios from './useAxios/IndexAx.js';

const PlanoHerrUrlBase = "http://10.1.1.14/media/planos/";

export default function useToolPlano(idPlano: number | null | undefined) {
    const [planoUrl, setPlanoUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { fetchData } = useAxios();

    useEffect(() => {
        if (!idPlano) {
            setPlanoUrl("");
            return;
        }

        let isMounted = true;

        const loadDoc = async () => {
            setLoading(true);
            try {
                const resDoc = await fetchData({
                    url: `/api/documents/planos/${idPlano}/`
                });
                if (isMounted && resDoc && resDoc.archivo) {
                    const fileName = resDoc.archivo.split('/').pop() || "";
                    setPlanoUrl(`${PlanoHerrUrlBase}${fileName}`);
                }
            } catch (err) {
                console.error("Error fetching tool plano:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
            console.log("planoUrl", planoUrl);
            console.log("loading", loading);
        };

        loadDoc();

        return () => {
            isMounted = false;
        };
    }, [idPlano, fetchData]);

    return { planoUrl, loading };
}
