import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { InputField } from '../components/InputField';
import { useValidator } from '../hooks/Validator/validator.hook';

export const AuthPage = () => {    
    const {loading, request, error, clearError} = useHttp();
    const auth = useContext(AuthContext);
    const message = useMessage();    

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);
    
    useEffect(() => {
        window.M.updateTextFields();
        window.M.Tabs.init(
            document.getElementById('auth-tabs'),
            {
                'duration': 300,
                'onShow': null,
                'swipeable': false,
                'responsiveThreshold': 'Infinity'
            });
    }, []);

    //Form data containers
    const [loginForm, setLoginForm] = useState({
        email_login: '', password_login: ''
    });
    const [registerForm, setRegisterForm] = useState({
        nickname_register: '', email_register: '', password_register: '', password_register_repeat: ''
    });
    const [resetPaswwordForm, setResetPaswwordForm] = useState({
        email_reset_password: ''
    });

    //State change handlers
    const inputChangeHandler = (event, container, handler) => {
        handler({...container, [event.target.name] : event.target.value});
    }

    // Input validation
    const { validateInput, validateForm, validationResult } = useValidator();
    const validationConfigs = {
        email_login: {
            methods: [
                { method: 'email', message: 'Provided email is invalid!' },
                { method: 'maxLength', lnght: 64, message: 'Email must be 64 characters as max!'}
            ]
        },
        password_login: {
            methods: [
                { method: 'minLength', lnght: 1, message: 'Pasword cant be empty!' },
                { method: 'maxLength', lnght: 128, message: 'Password must be 128 characters as max!'}
            ]
        },
        nickname_register: {
            methods: [
                { method: 'minLength', lnght: 6, message: 'Nickname must be 6 characters as min!' },
                { method: 'maxLength', lnght: 32, message: 'Nickname must be 32 characters as max!'},
                { method: 'lettersAndNumbers' }
            ]
        },
        email_register: {
            methods: [
                { method: 'email', message: 'Provided email is invalid!' },
                { method: 'maxLength', lnght: 64, message: 'Email must be 64 characters as max!'}
            ]
        },
        password_register: {
            methods: [
                { method: 'password' },
                { method: 'maxLength', lnght: 128, message: 'Password must be 64 characters as max!'}
            ]
        },
        password_register_repeat: {
            methods: [
                { method: 'password_repeat', password: registerForm.password_register, message: 'Passwords are not much!' },
                { method: 'maxLength', lnght: 128, message: 'Password must be 128 characters as max!'}
            ]
        },
        email_reset_password : {
            methods: [
                { method: 'email', message: 'Provided email is invalid!' },
                { method: 'maxLength', lnght: 64, message: 'Email must be 64 characters as max!'}
            ]
        }
    };
    const validateInputField = (event, skipIfTheSame = true) => {
        validateInput(event, validationConfigs, skipIfTheSame);
    }

    //Submit buttons handler
    const submitHandler = async (action) => {
        try {
            if(action === 'login') {
                if(!validateForm(loginForm, validationConfigs)) return;
                const data = await request('/api/auth/login', 'POST', {...loginForm});
                auth.login(data.token, data.userId);
            }
            else if(action === 'register') {
                if(!validateForm(registerForm, validationConfigs)) return;
                const data = await request('/api/auth/register', 'POST', {...registerForm});
                message(data.message);
            }
            else if(action === 'reset') {
                if(!validateForm(resetPaswwordForm, validationConfigs)) return;
                const data = await request('/api/auth/reset_password_send_link', 'POST', {...resetPaswwordForm});
                message(data.message);
            }
        } catch(e) {
            
        }
    }
    
    const buttonState = () => {
        if(loading) return true;        
        return false;
    }   

    return (
        <div className="container">
            <div className="row">
                <div className="col s6 offset-s3">
                    <h1>Welcome to Weddit</h1>
                    <ul id="auth-tabs" className="auth-tabs tabs-fixed-width">
                        <li className="tab col s4"><a className="active" href="#login">Log In</a></li>
                        <li className="tab col s4"><a href="#signin">Sign In</a></li>
                        <li className="tab col s4"><a href="#reset_password">I Forgot Password</a></li>
                    </ul>
                </div>
                <div id="login" className="col s12">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Log In</span>
                            <div>
                                <InputField
                                    error={validationResult.email_login?.errors}
                                    label="Email"
                                    id="email_login"
                                    name="email_login"
                                    type="text"
                                    placeholder="Enter email"                                                                                                            
                                    className="yellow-input"
                                    value={loginForm.email_login}
                                    onChange={(event) => { inputChangeHandler(event, loginForm, setLoginForm); } }
                                    onBlur={validateInputField}
                                />
                                <InputField
                                    error={validationResult.password_login?.errors}
                                    label="Email"
                                    placeholder="Enter password"
                                    id="password_login"
                                    type="password"
                                    name="password_login"
                                    className="yellow-input"
                                    value={loginForm.password_login}
                                    onChange={(event) => { inputChangeHandler(event, loginForm, setLoginForm); } }
                                    onBlur={validateInputField}
                                />
                            </div>
                        </div>
                        <div className="card-action">
                            <button onClick={() => submitHandler('login')} disabled={buttonState()} className="btn" style={{marginRight: 10}}>Log In</button>                            
                        </div>
                    </div>
                </div>
                <div id="signin" className="col s12">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Sign In</span>
                            <div>
                                <InputField
                                    error={validationResult.nickname_register?.errors}
                                    label="Nickname"
                                    placeholder="Enter nickname"
                                    id="nickname_register"
                                    type="text"
                                    name="nickname_register"
                                    className="yellow-input"
                                    value={registerForm.nickname_register}
                                    onChange={(event) => { inputChangeHandler(event, registerForm, setRegisterForm); } }
                                    onBlur={validateInputField}                                   
                                />
                                <InputField
                                    error={validationResult.email_register?.errors}
                                    label="Email"
                                    placeholder="Enter email"
                                    id="email_register"
                                    type="text"
                                    name="email_register"
                                    className="yellow-input"
                                    value={registerForm.email_register}
                                    onChange={(event) => { inputChangeHandler(event, registerForm, setRegisterForm); } }
                                    onBlur={validateInputField}                                   
                                />
                                <InputField
                                    error={validationResult.password_register?.errors}
                                    label="Password"
                                    placeholder="Enter password"
                                    id="password_register"
                                    type="password"
                                    name="password_register"
                                    className="yellow-input"
                                    value={registerForm.password_register}
                                    onChange={(event) => { inputChangeHandler(event, registerForm, setRegisterForm); } }
                                    onBlur={validateInputField}
                                />
                                <InputField
                                    error={validationResult.password_register_repeat?.errors}
                                    label="Password"
                                    placeholder="Enter password again"
                                    id="password_register_repeat"
                                    type="password"
                                    name="password_register_repeat"
                                    className="yellow-input"
                                    value={registerForm.password_register_repeat}
                                    onChange={(event) => { inputChangeHandler(event, registerForm, setRegisterForm); } }
                                    onBlur={validateInputField}
                                />
                            </div>
                        </div>
                        <div className="card-action">
                            <button onClick={() => submitHandler('register')} disabled={buttonState()} className="btn">Sign In</button>
                        </div>
                    </div>
                </div>
                <div id="reset_password" className="col s12">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Log In</span>
                            <div>
                                <InputField                                    
                                    error={validationResult.email_reset_password?.errors}
                                    label="Email"
                                    id="email_reset_password"
                                    name="email_reset_password"
                                    type="text"
                                    placeholder="Enter email"                                                                                                            
                                    className="yellow-input"
                                    value={resetPaswwordForm.email_reset_password}
                                    onChange={(event) => { inputChangeHandler(event, resetPaswwordForm, setResetPaswwordForm); } }
                                    onBlur={validateInputField}
                                />                                
                            </div>
                        </div>
                        <div className="card-action">
                            <button onClick={() => submitHandler('reset')} disabled={buttonState()} className="btn" style={{marginRight: 10}}>Submit</button>                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;