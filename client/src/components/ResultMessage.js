import React from 'react';

export const ResultMessage = (props) => {    
    if(props.error) return (
        <>
        <p>{props.error && props.clearError()}</p>
        </>
    );    
    if(props.data) {
        return (
            <>
            <p>{props.data}</p>
            </>
        );
    }
    return (
        <></>
    )
}