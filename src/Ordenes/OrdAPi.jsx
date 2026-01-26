import '../styles/globals.css'
import NavBar from "../Components/NavBar.jsx";
import * as React from "react";
import useAxios from "../Hooks/useAxios/IndexAx.js";

import {useEffect, useState} from "react";
//import {useState} from "react";

export default function Orders() {
    const {response, error, loading, fetchData} = useAxios();
    //const [OrderId, setOrderId] = useState("");
    //const [User, setUser] = useState(null);
    const [title, setTitle] = useState("");
    const[thumbnailUrl, setThumbnailUrl] = useState("");
    const KEY = '';
    const fetchOrders = async () => {
        await fetchData({
            url: '/photos',
            method: "GET",
        });
    };
    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (

        <>
            <NavBar/>
            <div>
                <h1>Orders</h1>

                <table
                    className="w-full table-fixed border-spacing-2 md:border-spacing-4 border-bg-blueFB bg-bg-blueFB">
                    <thead className="bg-white border-b-2 border-light-greyFB">
                    <tr className="bg-white border-2 border-b-dark-greyFB ">
                        {response && response.map((photos) => (
                            <th className="p-3 text-sm text-blueFB font-bold tracking-wide text-left" key={photos.id}>
                                <span>{photos.title}</span>
                            </th>
                        ))}

                    </tr>
                    </thead>
                    {/*<tbody>
                    {response && response.map((photos) => (
                        <tr className="bg-white border-2 border-b-dark-greyFB " key={photos.id}>
                            <td className="bg-white border-2 border-b-dark-greyFB ">
                                <div className="flex flex-row gap-4 items-center justify-self-start  whitespace-nowrap overflow-hidden text-ellipsis">
                                    {photos.id}
                                </div>
                            </td>
                            <td className="bg-white border-2 border-b-dark-greyFB ">
                                <div className="flex flex-row gap-4 items-center justify-self-start  whitespace-nowrap overflow-hidden text-ellipsis">
                                    {photos.url}
                                </div>
                            </td>
                            <td className="bg-white border-2 border-b-dark-greyFB ">
                                <img  alt={photos.title}   className="flex flex-row gap-4 items-center justify-self-start  whitespace-nowrap overflow-hidden text-ellipsis"
                                    src={photos.thumbnailUrl}/>
                            </td>
                        </tr>
                    ))}

                    {response && response.map((user) => (
                        <tr className="bg-white border-2 border-b-dark-greyFB " key={user.id}>
                            <td className="p-5 text-sm text-light-grayFB" key="1">
                                <span>{user.name}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>*/}
                </table>

            </div>
        </>
    )
}