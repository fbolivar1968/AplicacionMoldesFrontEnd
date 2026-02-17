import {use, useState} from "react";
import '../styles/globals.css'
import styles from './Login.module.css'; // Import as an objectss
import Logo from "../assets/MoldesImg/Logo.png";
import { Link } from 'react-router-dom';
import * as React from "react";
//import side_image from "../assets/MoldesImg/IMG_Login.JPG";


export default function Login(){

    const [userName, setUser] = useState("");
    const [psw, setPsw] = useState("");



    function handleLogin(){
        login(userName,psw)
    }
    return(
        <form className={styles.form_login}>
            <div className=" overflow-hidden h-screen flex items-center justify-center dark-greyFB">
                <div className="flex shadow-2xl ">
                    <section className ={styles.img_forjadora} >
                        <div className="m:rounded-bl-2xl md:rounded-tl-2xl md:block hidden">
                            <div className={styles.title_description}>
                                <h3>Bienvenido a GMFB</h3>
                            </div>
                            <div className={styles.text_description}>
                                <p>Gestiona el inventario de los moldes, ubícalos y realiza prestamos</p>
                            </div>
                        </div>

                    </section>

                    <div className="flex flex-col items-center
                    justify-center text-center p-10 gap-6
                    bg-blueFB rounded-2xl
                         md:rounded-bl-none md:rounded-tl-none"
                    >
                        <h3 className={styles.h3_ingresar}>Ingresar</h3>

                        <div className="flex flex-col
                        text-left gap-1 text-white">
                            <span className="text-lg">Usuario</span>
                            <input className="rounded-md p-1 border-2 outline-none
                            focus:border-[#4d4d4d] focus:bg-[#fffff] text-dark-greyFB"
                                   onChange={(e)=>setUser(e.target.value)} value={userName} type="text"
                                   placeholder="Usuario"/>
                        </div>
                        <div className="flex flex-col
                        text-left gap-1 text-white">
                            <span className="text-lg">Contraseña</span>
                            <input className="rounded-md p-1 border-2 outline-none
                            focus:border-[#4d4d4d] focus:bg-[#fffff] text-dark-greyFB"
                                   onChange={(e)=>setPsw(e.target.value)} value={psw} type="text"
                                   type="password" placeholder="Contraseña"   />

                        </div>
                        <Link to="/OrdAPiMold" className="flex justify-center gap-2 m-2">
                            <button className={styles.button_login} onClick={handleLogin}>Acceder</button>
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    )
}
