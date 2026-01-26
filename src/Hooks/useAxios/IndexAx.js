import axios from 'axios';
import {useEffect, useState, useRef} from 'react';
import {FETCH_STATUS} from "./FetchStatus.js";

    const useAxios = () => {
    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState(FETCH_STATUS.IDLE);


    const axiosInstance = axios.create({
        baseURL: "http://10.1.1.14:8000"
        //10.1.2.14/api https://jsonplaceholder.typicode.com
    });

    axiosInstance.interceptors.request.use(
        (config)=>{
        return config;
    },
        (error)=>{
        return Promise.reject(error);
        });

    axiosInstance.interceptors.response.use(
        (response)=>{
            return response;
        },
        (error)=>{
            return Promise.reject(error);
        });
        const controllerRef = useRef(new AbortController());

        useEffect(() => {
            // Cleanup function to abort on unmount
            return () => {
                controllerRef.current?.abort();
            };
        }, []);

       const fetchData = async ({url, method, data = {}, params= {}}) => {
        setStatus(FETCH_STATUS.LOADING);
        setLoading(true);
        setError("");

        controllerRef.current.abort();
        controllerRef.current = new AbortController();


        try {
            //check if url is an array or string
            if (Array.isArray(url)) {
                const requests = url.map(targetUrl => axiosInstance({url: targetUrl, method, data, params, signal: controllerRef.current.signal}));
                const results = await Promise.all(requests);
                setResponse(results.map(result => result.data));

            }else {
                const result = await axiosInstance({
                    url,
                    method,
                    data,
                    params,
                    signal: controllerRef.current.signal
                });
                setResponse(result.data);
            }
            setStatus(FETCH_STATUS.SUCCESS);
        } catch (error) {
            if(axios.isCancel(error)){
                console.error('Request canceled', error.message)
            }
            else {
                setError(error.response ? error.response.data : error.message);
                setStatus(FETCH_STATUS.ERROR);
            }
        } finally {
            setLoading(false);
        }
    };
    return {
        response,
        loading,
        error,
        status,
        fetchData,
    }



}
export default useAxios;