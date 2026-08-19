import { useState, useEffect } from 'react';
import useAxios from './useAxios/IndexAx.js';

const ImgHerrUrlBase = "http://10.1.1.14/media/imagenes/";

export default function useToolImage(idImagen: number | null | undefined) {
    const [imageUrl, setImageUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { fetchData } = useAxios();

    useEffect(() => {
        if (!idImagen) {
            setImageUrl("");
            return;
        }

        let isMounted = true;

        const loadDoc = async () => {
            setLoading(true);
            try {
                const resDoc = await fetchData({
                    url: `/api/documents/${idImagen}/`
                });
                if (isMounted && resDoc && resDoc.archivo) {
                    const fileName = resDoc.archivo.split('/').pop() || "";
                    setImageUrl(`${ImgHerrUrlBase}${fileName}`);
                }
            } catch (err) {
                console.error("Error fetching tool image:", err);
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
    }, [idImagen, fetchData]);

    return { imageUrl, loading };
}
