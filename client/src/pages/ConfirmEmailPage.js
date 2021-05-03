import React, { useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useParams, Link } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { ResultMessage } from '../components/ResultMessage';

export const useConfirmPage = () => {
    const code = useParams().code;
    const { loading, request, error, clearError, resultData } = useHttp();  
    
    useEffect(() => {
        request('/api/auth/confirm', 'POST', { code: code });
    }, [request, code]);
   
    if(loading) {
        return (
            <Loader />
        );
    }

    return (
        <>
            { !loading && <ResultMessage data={resultData.message} error={error} clearError={clearError} /> }
            <Link to="/">Return to authentication page</Link>
        </>
    )
}

export default useConfirmPage;