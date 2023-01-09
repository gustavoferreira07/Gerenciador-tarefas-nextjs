import { NextPage } from "next";
import { useState } from 'react';
import { Modal } from "react-bootstrap";
import { executeRequest } from "../services/api";

type LoginProps = {
    setToken(s:string):void
}

export const Login: NextPage<LoginProps> = ({setToken}) => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);


    // STATES MODAL
    const [showModal, setShowModal] = useState(false);
    const [name, setNameModal] = useState('');
    const [email, setEmailModal] = useState('');
    // const [password, setPasswordModal] = useState('');
    const [errorMsgModal, setErrorMsgModal] = useState('');

    const closeModal = () => {
        setShowModal(false);
        setLoading(false);
        setErrorMsgModal('');
        setEmailModal('');
        setNameModal('');
        setPassword('');
    }

    const createUser = async () => {
        try {
            setErrorMsgModal('');
            if (!name || !email || !password) {
                return setErrorMsgModal('Favor preencher os campos');
            }

            setLoading(true);

            const body = {
                name: name,
                email: email,
                password: password
            }

            await executeRequest('register', 'POST', body);
            alert('Usuário casastrado com sucesso!');
            closeModal();
        } catch (e: any) {
            console.log('Ocorreu erro ao cadastrar usuário:', e);
            if(e?.response?.data?.error){
                setErrorMsgModal(e?.response?.data?.error);
            }else {
                setErrorMsgModal('Ocorreu erro ao cadastrar usuário');
            }
        }

        setLoading(false);
    }

    const doLogin = async () => {
        try {
            setErrorMsg('');
            if (!login || !password) {
                return setErrorMsg('Favor preencher os campos');
            }

            setLoading(true);

            const body = {
                login,
                password
            }

            const result = await executeRequest('login', 'POST', body);
            if(result && result.data){
                const obj = result.data;
                localStorage.setItem('accessToken', obj.token);
                localStorage.setItem('name', obj.name);
                localStorage.setItem('email', obj.email);
                setToken(obj.token);
            }
        } catch (e: any) {
            console.log('Ocorreu erro ao efetuar login:', e);
            if(e?.response?.data?.error){
                setErrorMsg(e?.response?.data?.error);
            }else {
                setErrorMsg('Ocorreu erro ao efetuar login');
            }
        }

        setLoading(false);
    }

    return (
        <>
        <div className="container-login">
            <img src="/logo.svg" alt="Logo Fiap" className="logo" />
            <div className="form">
                {errorMsg && <p>{errorMsg}</p>}
                <div>
                    <img src="/mail.svg" alt="Login" />
                    <input type='text' placeholder="Login"
                        value={login} onChange={event => setLogin(event.target.value)}
                    />
                </div>

                <div>
                    <img src="/lock.svg" alt="Senha" />
                    <input type='password' placeholder="Senha"
                        value={password} onChange={event => setPassword(event.target.value)}
                    />
                </div>

                <button onClick={doLogin} disabled={loading}>{loading ? '...Carregando' : 'Login'}</button>
                <span className="link" onClick={() => setShowModal(!showModal)}>Não tem cadastro? clique aqui</span>
            </div>
        </div>

        <Modal
                show={showModal}
                onHide={closeModal}
                className="container-modal">
                <Modal.Body>
                        <p>Cadastro de usuário</p>
                        {errorMsgModal && <p className="error">{errorMsgModal}</p>}
                        <input type="text" placeholder="Nome"
                            value={name} onChange={e => setNameModal(e.target.value)}/>
                        <input type="text" placeholder="Email"
                            value={email} onChange={e => setEmailModal(e.target.value)}/>
                        <input type="password" placeholder="Senha"
                            value={password} onChange={e => setPassword(e.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <div className="button col-12">
                        <button disabled={loading} onClick={createUser}>
                            {loading ? '...Carregando' : 'Salvar'}
                        </button>
                        <span onClick={closeModal}>Cancelar</span>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
        
    );
}