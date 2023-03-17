import React, { useContext, useState, useEffect } from "react";

import { DataContext } from "../../Context/DataContext";
import { SkillsApi } from "../../Service/api";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css"

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

import editar from "../../Assets/icons8-edit-64.png"




export const ItemSkill = ({ props }) => {

    const { dadosUsuario } = useContext(DataContext)

    const [levelConfirmed, setLevelConfirmed] = useState();
    const [skillConfirmed, setSkillConfirmed] = useState();
    const [openModal, setOpenModal] = React.useState(false);
    // const [userLogged, setUserLogged] = useState(false)

    const handleClose = () => setOpenModal(false);

    //Estilo do modal "Box"

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: "#f6f7f9",
        borderRadius: 5,
        boxShadow: 24,
        p: 4,
    };

    const ToastSuccess = () =>
        toast.success("Parabéns! Skill atualizada com sucesso!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

    //Selecionando o Nível no modal

    const handleChangeLevel = (event) => {
        setLevelConfirmed(event.target.value);
    };

    //Requisições na API

    const handleOpen = (id) => {
        setOpenModal(true);

        SkillsApi.get(`/user-skills/${id}`, {
            headers: { "Authorization": `Bearer ${dadosUsuario?.token}` }

        }).then((resp) => {
            setSkillConfirmed(resp.data)
        }).catch((error) => {
        })
    };

    const UpdateUserSkill = async () => {

        SkillsApi.put(`/user-skills/${skillConfirmed?.id}`,
            {
                user: {
                    id: dadosUsuario?.id
                },
                skills: {
                    id: skillConfirmed?.skills?.id
                },
                level: levelConfirmed
            },
            { headers: { "Authorization": `Bearer ${dadosUsuario?.token}` } }
        ).then((response) => {
            ToastSuccess();
        }).catch((error) => {
        })
    };

    const DeleteUserSkill = async () => {

        SkillsApi.delete(`/user-skills/${skillConfirmed?.id}`, {
            headers: { "Authorization": `Bearer ${dadosUsuario?.token}` }

        }).then((resp) => {

        }).catch((error) => {
        })
    };

    return (
        <>
            {props?.map((user) => (
                <div className="List" key={user.id} >
                    <div className="containerItem" >
                        <div className="Box" >
                            <img className="SkillImage" src={user?.skills?.image} alt="Skill" />
                        </div>
                        <div className="Infos">
                            <div className="CenterInfo">
                                <span>{user?.skills?.skillName}</span>
                            </div>
                        </div>
                        <div className="Infos">
                            <div className="CenterInfo">
                                <span>{user?.skills?.descripition}</span>
                            </div>
                        </div>
                        <div className="Infos">
                            <div className="CenterInfo">
                                <span>{user?.level}</span>
                            </div>
                        </div>
                        <div className="Infos">
                            <div className="CenterInfo">
                                <img
                                    className="EditIcon"
                                    src={editar}
                                    alt="Editar"
                                    onClick={() => {
                                        handleOpen(user.id)
                                    }} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h3>Subiu de nível ou quer excluir a Skill:</h3>
                    <FormControl sx={{ m: 3, minWidth: 150 }} size="small">
                        <InputLabel id="demo-select-small">Nível</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={levelConfirmed}
                            label="Nível"
                            onChange={handleChangeLevel}
                        >
                            <MenuItem value="">
                                <em>Nível</em>
                            </MenuItem>
                            <MenuItem value={1}>Nível 1</MenuItem>
                            <MenuItem value={2}>Nível 2</MenuItem>
                            <MenuItem value={3}>Nível 3</MenuItem>
                            <MenuItem value={4}>Nível 4</MenuItem>
                            <MenuItem value={5}>Nível 5</MenuItem>
                            <MenuItem value={6}>Nível 6</MenuItem>
                            <MenuItem value={7}>Nível 7</MenuItem>
                            <MenuItem value={8}>Nível 8</MenuItem>
                            <MenuItem value={9}>Nível 9</MenuItem>
                            <MenuItem value={10}>Nível 10</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        sx={{ marginTop: 3, marginLeft: 3, backgroundColor: '#252525' }}
                        className="SaveButton"
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={() => { UpdateUserSkill() }}
                    >
                        Salvar
                    </Button>
                    <Button
                        sx={{ marginTop: 3, marginLeft: 5, backgroundColor: '#252525' }}
                        className="SaveButton"
                        variant="contained"
                        endIcon={<DeleteIcon />}
                        onClick={() => { DeleteUserSkill() }}
                    >
                        Excluir
                    </Button>
                </Box>
            </Modal>
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
        </>
    );
};