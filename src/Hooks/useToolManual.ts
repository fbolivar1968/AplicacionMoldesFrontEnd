import { useState, useEffect } from 'react';
import useAxios from './useAxios/IndexAx.js';

const ManualHerrUrlBase = "http://10.1.1.14/media/manuales/";

export default function useToolManual(idManual: number | null | undefined) {
    const [manualUrl, setManualUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { fetchData } = useAxios();

    useEffect(() => {
        if (!idManual) {
            setManualUrl("");
            return;
        }

        let isMounted = true;

        const loadDoc = async () => {
            setLoading(true);
            try {
                const resDoc = await fetchData({
                    url: `/api/documents/manuales/${idManual}/`
                });
                if (isMounted && resDoc && resDoc.archivo) {
                    const fileName = resDoc.archivo.split('/').pop() || "";
                    setManualUrl(`${ManualHerrUrlBase}${fileName}`);
                }
            } catch (err) {
                console.error("Error fetching tool manual:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadDoc();

        return () => {
            isMounted = false;
        };
    }, [idManual, fetchData]);

    return { manualUrl, loading };
}
