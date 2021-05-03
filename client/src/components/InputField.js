import React from 'react';

export const InputField = ({ ...inputProps }) => {    
    return <>
        <div className="input-field">
            <input
                {...inputProps}
            />
            <label htmlFor={inputProps.id}>{inputProps.label}</label>
        </div>
        {inputProps.error && <p>{inputProps.error.join(' ')}</p>}
    </>    
}