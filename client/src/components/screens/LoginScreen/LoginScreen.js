import React, {useEffect, useState} from "react";
import axios from 'axios';
import {Link, useHistory} from "react-router-dom";
import "./styles.css";

const LoginScreen = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            history.push("/");
        }
    }, []);

    const loginHandler = async (e) => {
        e.preventDefault();

        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };

        try {
            const {data} = await axios.post(
                "/auth/login",
                {
                    email,
                    password,
                },
                config
            );

            localStorage.setItem("authToken", data.token);

            history.push("/");
        } catch (error) {
            setError(error.response.data.error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    return (
        <div className="login-screen">
            <form onSubmit={loginHandler} className="login-screen__form">
                <h3 className="login-screen__title">Login</h3>
                {
                    error && <span className="error-message">{error}</span>
                }
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input tabIndex={1} type="email" required id="email" placeholder="Enter email" value={email}
                           onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password; <Link tabIndec={4} className="login-screen__forgotpassword" to="/forgotPassword">Forgot Password?</Link></label>
                    <input tabIndex={2} type="password" required id="password" placeholder="Enter Password"
                           value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button tabIndex={3} type="submit" className="btn btn-primary">Login</button>

                <span className="login-screen__subtext">Need an account? <Link to="/register">Register</Link></span>

            </form>
        </div>
    )
};

export default LoginScreen;
