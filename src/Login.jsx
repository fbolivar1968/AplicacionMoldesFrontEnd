import{useState} from "react";
import './Login.css';
import Logo from "./assets/Logo.png";
import IMG_Login from "./assets/IMG_Login.JPG";
export default function Login(){
    const [user, setUser] = useState("");
    const [psw, setPsw] = useState("");

    function handleSubmit(e){
        e.preventDefault();
        if (!user)return;
        alert("Enter User name")
    }
    return(
        <form>
            <div className="rectangle-4">
                    <img
                        src={Logo}
                        alt="LogoFb"
                        className="img_logo"
                        />

            </div>

            <div className ="img_forjadora">
                <div className="text_description" >
                <h3>Bienvenido a GMFB</h3>
                </div>

                <div className="descripcion-gmfb">
                <p>Gestiona el inventario de los moldes, ubícalos y realiza prestamos</p>
                </div>
            </div>
        </form>
    )
}
