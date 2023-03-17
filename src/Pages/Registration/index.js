import React, { useState } from "react";

import { SkillsApi } from "../../Service/api";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css"

import eyeOff from "../../Assets/show-password-icon-18.jpg"
import eyeOn from "../../Assets/show-password-icon-19.jpg"

export const Registration = () => {

  const [login, setlogin] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)

  const Navigation = useNavigate()

  //Alertas

  const Success = () =>
    toast.success("Parabéns! você se cadastrou com sucesso", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const PasswordError = () =>
    toast.warn("Oops! Parece que suas senhas não são iguais", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  //Cadastro de usuário

  const PostUser = async () => {
    if (password == checkPassword) {
      await SkillsApi.post(
        '/auth/registro',
        {
          userLogin: login,
          userPassword: password
        }

      ).then(response => {
        if (response.status === 200) {

          Success();
          setTimeout(() => {
            Navigation("/");
          }, "2000");

        }
      }).catch((Error) => {
      })
    } else {
      PasswordError();
    }
  };

  //Função para mostrar senha

  const toggleShowPassword = () => {
    setShowPassword(show => !show);
  };


  return (
    <div className="container">
      <div className="container-register">
        <div className="wrap-register">
          <div className="register-form">
            <span className="register-form-title"> Cadastre-se no NekiSkills </span>

            <div className="wrapRegister-input">
              <input
                className="inputRegister"
                type="email"
                placeholder="Digite aqui seu Login"
                value={login}
                onChange={(e) => setlogin(e.target.value)}
              />
            </div>
            <input
              className="inputRegister"
              type={showPassword == true ? "text" : "password"}
              placeholder="Digite aqui sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="inputRegister"
              type={showPassword == true ? "text" : "password"}
              placeholder="Confirme sua senha"
              value={checkPassword}
              onChange={(e) => setCheckPassword(e.target.value)}
            />
            <div className="container-pass-btn">
              <img
                src={showPassword ? eyeOn : eyeOff}
                alt="Mostrar senha"
                className="pass-image"
                onClick={toggleShowPassword}
              />
            </div>
            <div className="container-register-form-btn">
              <button className="register-form-btn"
                onClick={() => { PostUser() }}
              >Cadastrar</button>
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