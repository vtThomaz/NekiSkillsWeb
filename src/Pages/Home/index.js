import React, { useContext, useEffect, useState } from "react";

import { ItemSkill } from "../../Components/itemSkill";
import { DataContext } from "../../Context/DataContext";
import { SkillsApi } from "../../Service/api";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

import logo from "../../Assets/neki-fundo-preto-1256x386.png"
import exit from "../../Assets/icons8-exit-64.png"
import skillIcon from "../../Assets/icons8-adicionar-propriedade-50.png"
import registerSkillIcon from "../../Assets/icons8-adicionar-96.png"


import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';

export const Home = () => {

    const { armazenaDadosUsuario } = useContext(DataContext)
    const { dadosUsuario } = useContext(DataContext)

    const [user, setUser] = useState();
    const [welcome, setWelcome] = useState();
    const [skills, setSkills] = useState();
    const [openModal, setOpenModal] = React.useState(false);
    const [openModalRegister, setOpenModalRegister] = React.useState(false);
    const [skillConfirmed, setSkillConfirmed] = useState();
    const [levelConfirmed, setLevelConfirmed] = useState();
    const [userLogged, setUserLogged] = useState(false);
    const [RegisterSkill, setRegisterSkill] = useState('');
    const [RegisterVersion, setRegisterVersion] = useState('');
    const [RegisterDescription, setRegisterDescription] = useState('');
    const [RegisterImage, setRegisterImage] = useState('');

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    const handleOpenRegister = () => setOpenModalRegister(true);
    const handleCloseRegister = () => setOpenModalRegister(false);

    const Navigation = useNavigate()

    //Estilo do Modal "Box"

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
        toast.success("Parabéns! Skill inserida com sucesso!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

    const ToastRegisterSuccess = () =>
        toast.success("Obrigado! Você cadastrou uma nova skill!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

    //Pegando a Skill da lista
    const handleChange = (event) => {
        setSkillConfirmed(event.target.value);
    };

    //Selecionando o Nível na lista
    const handleChangeLevel = (event) => {
        setLevelConfirmed(event.target.value);
    };

    //Funções de Requisições na API

    const getUser = async () => {

        SkillsApi.get(`/user/${dadosUsuario?.id}`, {
            headers: { "Authorization": `Bearer ${dadosUsuario?.token}` }

        }).then((resp) => {
            const sortedSkills = resp.data.userSkills.sort((a, b) => b.level - a.level); // Ordenação por level
            setUser(sortedSkills);
            setWelcome(resp.data)
        }).catch((error) => {

        })
    };

    const getSkills = async () => {

        SkillsApi.get(`/skills`, {
            headers: { "Authorization": `Bearer ${dadosUsuario?.token}` }
        }).then((response) => {
            setSkills(response.data)
        }).catch((erro) => {
        })
    };

    const PostUserSkills = async () => {

        await SkillsApi.post('/user-skills',
            {
                user: {
                    id: dadosUsuario?.id
                },
                skills: {
                    id: skillConfirmed
                },
                level: levelConfirmed
            },
            { headers: { "Authorization": `Bearer ${dadosUsuario?.token}` } }
        ).then((response) => {
            ToastSuccess();
            Logged()
        })
    };



    const PostSkills = async () => {

        var data = {
            skillName: RegisterSkill,
            version: RegisterVersion,
            descripition: RegisterDescription
        }

        const formData = new FormData();

        formData.append('filename', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        formData.append('source', RegisterImage)

        await SkillsApi.post('/skills',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${dadosUsuario?.token}`,
                    "Content-Type": "multipart/form-data"
                },
            }
        ).then((response) => {
            ToastRegisterSuccess();
            Logged()
        })
    };

    //Traz o token para a Home quando o usuário está logado

    useEffect(() => {
        armazenaDadosUsuario(localStorage.getItem("user-token"))
    }, [userLogged]);

    useEffect(() => {
        getUser()
        getSkills()
    }, [dadosUsuario]);

    const Logged = () => {
        if (userLogged !== true) {
            setUserLogged(true)
        } else {
            setUserLogged(false)
        }
    };

    //Função para deslogar

    const Logout = () => {
        localStorage.removeItem("user-token")
        Navigation("/")
    };

    return (
        <>
            <header>
                <img className="logo" src={logo} alt="Logo" />
                <img src={exit} alt="Sair" className="exit" onClick={Logout} />
            </header>
            <div className="BemVindo">
                <h1>Seja bem-vindo(a), {welcome?.userLogin} !</h1>
            </div>
            <div className="AdicionarSkill">
                <h2>Ta aprendendo algo novo? Que tal adicionar?</h2>
                <div>
                    <img src={skillIcon} alt="Adicionar Skill" className="SkillButton" onClick={handleOpen} />
                </div>
            </div>
            <div className="CadastrarSkill">
                <h5>Não achou o que queria? Que tal cadastrar?</h5>
                <div>
                    <img src={registerSkillIcon} alt="CadastrarSkill" className="RegisterSkillButton" onClick={handleOpenRegister} />
                </div>
            </div>
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h3>Selecione a Skill e o nível:</h3>
                    <FormControl sx={{ m: 3, minWidth: 150 }} size="small">
                        <InputLabel id="demo-select-small">Skill</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={skillConfirmed}
                            label="Skill"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>Skill</em>
                            </MenuItem>
                            {skills?.map((selectedSkill) => (
                                <MenuItem value={selectedSkill.id}>
                                    {selectedSkill?.skillName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                        sx={{ marginTop: 3, backgroundColor: '#252525' }}
                        className="SaveButton"
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={() => { PostUserSkills() }}
                    >
                        Salvar
                    </Button>
                </Box>
            </Modal>
            <Modal
                open={openModalRegister}
                onClose={handleCloseRegister}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h3>Preencha abaixo e adicione uma nova skill</h3>
                    <TextField
                        sx={{ m: 2, minWidth: 150, mt: 5 }}
                        size="small" id="outlined-basic"
                        label="Skill" variant="outlined"
                        value={RegisterSkill}
                        onChange={(e) => setRegisterSkill(e.target.value)}
                    />
                    <TextField
                        sx={{ m: 2, minWidth: 150, mt: 5 }}
                        size="small" id="outlined-basic"
                        label="Versão"
                        variant="outlined"
                        value={RegisterVersion}
                        onChange={(e) => setRegisterVersion(e.target.value)}
                    />
                    <TextField
                        sx={{ m: 2, minWidth: 150 }}
                        size="small" id="outlined-basic"
                        label="Descrição"
                        variant="outlined"
                        value={RegisterDescription}
                        onChange={(e) => setRegisterDescription(e.target.value)}
                    />
                    <form style={{ marginLeft: 245, marginTop: -50 }}>
                        <input
                            type="file"
                            name="imagem"
                            onChange={(e) => setRegisterImage(e.target.files[0])}
                        />
                    </form>
                    <Button
                        sx={{ marginTop: 5, backgroundColor: '#252525' }}
                        className="SaveButton"
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={() => { PostSkills() }}
                    >
                        Salvar
                    </Button>
                </Box>
            </Modal>
            <div className="Container">
                <div className="SkillList">
                    <div className="Topics">
                        <div className="TopicsText" >
                            <h3 className="Title">Foto</h3>
                        </div>
                        <div className="TopicsText">
                            <h3 className="Title">Nome</h3>
                        </div>
                        <div className="TopicsText">
                            <h3 className="Title">Descrição</h3>
                        </div>
                        <div className="TopicsText">
                            <h3 className="Title">Nível</h3>
                        </div>
                        <div className="TopicsText">
                            <h3 className="Title">Editar/Excluir</h3>
                        </div>
                    </div>
                    <ItemSkill props={user} />

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
        </>
    );
};