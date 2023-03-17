import React, { createContext, useState } from "react";
import jwt_decode from 'jwt-decode';


export const DataContext = createContext({});


export const DataProvider = ({ children }) => {
    const [dadosUsuario, setDadosUsuario] = useState();

    const armazenaDadosUsuario = (jwt) => {
        var tokenDecodificado = jwt_decode(jwt);

        var usuario = tokenDecodificado.usuario;

        usuario = JSON.parse(usuario);

        setDadosUsuario({
            id: usuario?.id,
            userLogin: usuario?.userLogin,
            token: jwt
        });
    };

    return (
        <DataContext.Provider value={{
            dadosUsuario,
            armazenaDadosUsuario
        }}>
            {children}
        </DataContext.Provider>
    );
}
