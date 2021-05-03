import React, { useState, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useParams, Link } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { ResultMessage } from '../components/ResultMessage';
import { InputField } from '../components/InputField';
import { useValidator } from '../hooks/Validator/validator.hook';

export const useResetPasswordPage = () => {
    const code = useParams().code;
    const {loading, request, error, clearError, resultData} = useHttp();

    const [resetForm, setResetForm] = useState({
        password_reset: '', password_reset_repeat: ''
    });

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const { validateInput, validateForm, validationResult } = useValidator();
    const validationConfigs = {
        password_reset: {
            methods: [
                { method: 'password' },
                { method: 'maxLength', lnght: 128, message: 'Password must be 128 characters as max!'}
            ]
        },
        password_reset_repeat: {
            methods: [
                { method: 'password_repeat', password: resetForm.password_reset, message: 'Passwords are not much!' },
                { method: 'maxLength', lnght: 128, message: 'Password must be 128 characters as max!'}
            ]
        }
    }
    const validateInputField = (event, skipIfTheSame = true) => {
        validateInput(event, validationConfigs, skipIfTheSame);
    }

    const resetChangeHandler = event => {
        setResetForm({ ...resetForm, [event.target.name] : event.target.value});
    }

    const resetButtonState = () => {
        if(loading) return true;
        return false;
    }

    const resetButtonHandler = async () => {
        try {
            if(!validateForm(resetForm, validationConfigs)) return;
            request('/api/auth/reset_password', 'POST', { code: code, password_reset: resetForm.password_reset });
        } catch(e) {
            
        }
    }

    if(loading) {
        return (
            <Loader />
        );
    }

    if(!loading && (resultData.message || error))
    {
        return (
            <>
                { !loading && <ResultMessage data={resultData.message} error={error} clearError={clearError} /> }
                <Link to="/">Return to authentication page</Link>
            </>
        )
    }

    return (
        <>
        <div className="row">
            <div id="reset-password" className="col s12">
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Set new password</span>
                        <div>                            
                            <InputField                                    
                                error={validationResult.password_reset?.errors}
                                label="Password"
                                placeholder="Enter password"
                                id="password_reset"
                                type="password"
                                name="password_reset"
                                className="yellow-input"
                                value={resetForm.password_reset}
                                onChange={resetChangeHandler}
                                onBlur={validateInputField}
                            />
                            <InputField                                    
                                error={validationResult.password_reset_repeat?.errors}
                                label="Password"
                                placeholder="Enter password again"
                                id="password_reset_repeat"
                                type="password"
                                name="password_reset_repeat"
                                className="yellow-input"
                                value={resetForm.password_reset_repeat}
                                onChange={resetChangeHandler}
                                onBlur={validateInputField}
                            />
                        </div>
                    </div>
                    <div className="card-action">
                        <button onClick={resetButtonHandler} disabled={resetButtonState()} className="btn" style={{marginRight: 10}}>Reset</button>                            
                    </div>
                </div>
            </div>
        </div>
        <Link to="/">Return to authentication page</Link>
        </>               
    )
}

export default useResetPasswordPage;