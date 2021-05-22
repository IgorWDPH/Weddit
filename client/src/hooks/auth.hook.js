import {useState, useCallback, useEffect} from 'react';
import jwt from 'jsonwebtoken';

const storageName = 'userData';

export const useAuth = () => {    
    const [token, setToken] = useState(null);
    const [ready, setReady] = useState(false);
    const [userId, setUserId] = useState(null);

    const login = useCallback((jwtToken, id) => {
        const jwtTokenDecoded = jwt.decode(jwtToken);        
        if(jwtTokenDecoded.exp * 1000 < Date.now()) {
            logout();
            return;
        }
        setToken(jwtToken);
        setUserId(id);
        localStorage.setItem(storageName, JSON.stringify({userId: id, token: jwtToken}));
    }, []);
    const logout = useCallback(() => {
        console.log('from logout');
        setToken(null);
        setUserId(null);
        localStorage.removeItem(storageName);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));
        if(data && data.token) {
            login(data.token, data.userId);
        }
        setReady(true);
    }, [login])

    return { login, logout, token, userId, ready }
}