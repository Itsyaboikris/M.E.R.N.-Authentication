import React from 'react'
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {PrivateRoute} from "./components/routing/PrivateRoute";

import RegisterScreen from "./components/screens/RegisterScreen/RegisterScreen";
import PrivateScreen from "./components/screens/PrivateScreen/PrivateScreen";
import LoginScreen from "./components/screens/LoginScreen/LoginScreen";
import ForgotPasswordScreen from "./components/screens/ForgotPasswordScreen/ForgotPasswordScreen";
import ResetPasswordScreen from "./components/screens/ResetPasswordScreen/ResetPasswordScreen";

const App = () => {
    return (
        <Router>
            <div className="app">
                <Switch>
                    <PrivateRoute exact path="/" component={PrivateScreen}/>
                    <Route exact path="/login" component={LoginScreen}/>
                    <Route exact path="/register" component={RegisterScreen}/>
                    <Route exact path="/forgotPassword" component={ForgotPasswordScreen}/>
                    <Route exact path="/resetPassword/:resetToken" component={ResetPasswordScreen}/>
                </Switch>
            </div>
        </Router>
    );
};

export default App;
