import React, { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { SkillsApi } from "../../Service/api";
import { DataContext } from "../../Context/DataContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css"

import eyeOff from "../../Assets/show-password-icon-18.jpg"
import eyeOn from "../../Assets/show-password-icon-19.jpg"


export const Login = () => {

  const { armazenaDadosUsuario } = useContext(DataContext)

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)

  const Navigation = useNavigate()

  //Alerta

  const PasswordError = () =>
    toast.error("Oops! Login e/ou senha errados!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  //Fazendo Login

  const handleLogin = async () => {

    var tokenJwt = null;

    try {
      const retorno = await SkillsApi.post('/auth/login',
        { userLogin: login, 
          userPassword: password, 
          lastLogin: getCurrentDate() 
        });
      if (retorno.status === 200) {

        tokenJwt = retorno.data;

        localStorage.setItem("user-token", tokenJwt["jwt-token"])

        armazenaDadosUsuario(localStorage.getItem("user-token"))

        Navigation("/home")
      } else {

      }

    } catch (error) {
      PasswordError();
    }
  };

  //Função para mostrar senha

  const toggleShowPassword = () => {
    setShowPassword(show => !show);
  };

  const getCurrentDate = () => {
    const date = new Date().toJSON()
    return date;
  };


  return (
    <div className="container">
      <div className="container-login">
        <div className="wrap-login">
          <div className="login-form">
            <span className="login-form-title"> NekiSkills </span>
            <input
              className="input"
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <input
              className="input"
              type={showPassword === true ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="container-pass-btn">
              <img
                src={showPassword ? eyeOn : eyeOff}
                alt="Mostrar senha"
                className="pass-image"
                onClick={toggleShowPassword}
              />
            </div>
            <div className="container-login-form-btn">
              <button className="login-form-btn" onClick={() => handleLogin()}>Login</button>
            </div>

            <div className="textLogin-center">
              <span className="txtLogin1">Não possui conta? </span>
              <p className="txtLogin2" onClick={() => { Navigation("/Registration") }}> Cadastre-se</p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};