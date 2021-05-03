import { useState } from 'react';
import { validationMethods } from './validationMethods';

export const useValidator = () => {
    const [validationResult, setValidationResult] = useState({});

    const validate = (value, params) => {
        if(!('methods' in params) || !Array.isArray(params.methods) || params.methods.length === 0) {
            console.log(`ERROR: No validation methods`);
            return;
        }
        const responseData = { errors: [] };
        params.methods.forEach((method) => {
            if(typeof validationMethods[method.method] !== 'function') {
                console.log(`ERROR: Validation method "${method.method}" does not exist!`);
                return;
            }
            const validationResult = validationMethods[method.method](value, method);
            if(validationResult) responseData.errors.push(validationResult);
        });        
        return responseData;
    }

    const validateInput = (event, validationConfigs, skipIfTheSame = true) => {        
        if(!event.target.name) {
            console.log('Input has no name!');
            return;
        }
        if(!(event.target.name in validationConfigs)) {
            console.log('There are no validation rules set for this input!');
            return;
        }        
        if(skipIfTheSame && validationResult[event.target.name]?.value === event.target.value) return;        
        const result = validate(event.target.value, validationConfigs[event.target.name]);        
        const validationStatus = (!result.errors.length);
        setValidationResult({
            ...validationResult,
            [event.target.name]: { value: event.target.value, status: validationStatus, errors: result.errors }
        });
    }

    const validateForm = (form, validationConfigs) => {        
        const localValidationResult = {};
        let formValidationStatusFlag = true;
        for(const input in form) {            
            const inputValidationResult = validate(form[input], validationConfigs[input]);
            if(inputValidationResult.errors.length) formValidationStatusFlag = false;
            localValidationResult[input] = { value: form[input], errors: inputValidationResult.errors };
        }        
        if(!formValidationStatusFlag) {
            setValidationResult({
                ...validationResult,
                ...localValidationResult
            });
            return false;
        }
        else return true;
    }
    
    return { validate, validateInput, validateForm, validationResult };
}