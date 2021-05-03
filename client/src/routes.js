import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

export const useRoutes = isAuthenticated => {
    if(isAuthenticated) {
        return(
        <Switch>
        </Switch>
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