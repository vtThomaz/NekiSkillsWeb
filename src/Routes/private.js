import React, { useContext } from "react";
import { DataContext } from "../Context/DataContext";
import { Navigate } from "react-router-dom";

export const Private = ({children}) => {

    const {dadosUsuario} = useContext(DataContext);

    let userlogged = localStorage.getItem("user-token")

    return userlogged !== null ? children : <Navigate to='/'/>
}