import {useFormState} from "react-dom";

export default function LoadingButton() {

    const {isLoading} = useFormState();

    return (

        <button className="btn-blue" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
        </button>

    )
}