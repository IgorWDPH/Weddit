import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import MessengerPage from './pages/MessengerPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { Navbar } from './components/Navbar';

export const useRoutes = isAuthenticated => {
    if(isAuthenticated) {
        return(
        <>
        <Navbar />
        <Switch>
            <Route path="/" exact>
                <HomePage />
            </Route>
            <Route path="/messenger" exact>
                <MessengerPage />
            </Route>            
        </Switch>
        </>
        );
    }
    return(
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Route path="/confirm/:code">
                <ConfirmEmailPage />
            </Route>
            <Route path="/reset-password/:code">
                <ResetPasswordPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    );
}