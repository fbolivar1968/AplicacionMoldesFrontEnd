import '../styles/globals.css'
//import SearchIcon from '@mui/icons-material/Search';
//import MenuIcon from '@mui/icons-material/Menu';
import Search from '../Components/Search.jsx';



import * as React from 'react';

export default function FilterForm() {
    const[selectedFilters, setSelectedFilters] = React.useState([]);
    const[search, setSearch] = React.useState('');
    return (
        <form className="bg-orangeFB h-full hidden sm:block flex-col gap-3 px-5 py-6 shadow-3xl font-">
            <Search md/>
            <div>
                <div>
                    <label className="block p-2">Ubicación</label>
                    <select>
                        <option>
                            Estante A
                        </option>
                    </select>

                </div>
                <div className="block p-2">
                    <label>Máquina</label>
                    <select>
                        <option>
                            Niagara
                        </option>
                    </select>
                </div>

                <div className="block p-2">
                    <label>Tipo de molde</label>
                    <select>
                        <option>
                            HX
                        </option>
                    </select>
                </div>
                <div className="block p-2">
                    <label>Estado</label>
                    <select>
                        <option>
                            En reparación
                        </option>
                    </select>
                </div>
                <div className="block p-2">
                    <label>Nomenclatura</label>
                    <select>
                        <option>
                            HX-05
                        </option>
                    </select>
                </div>

                <div className="flex items-center gap-8">
                    <button className="btn btn-blue">Aplicar</button>
                    <button className="btn btn-blue">Limpiar</button>
                </div>
            </div>
        </form>

    )
}