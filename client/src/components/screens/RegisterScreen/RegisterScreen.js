import React, {useEffect, useState} from "react";
import axios from 'axios';
import {Link, useHistory} from "react-router-dom";
import "./styles.css";

const RegisterScreen = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    useEffect(()=> {
        if (localStorage.getItem("authToken")) {
            history.push("/");
        }
    }, []);

    const registerHandler = async (e) => {
        e.preventDefault();

        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };

        if (password !== confirmPassword) {
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                setError("");
            }, 5000);
            return setError("Passwords do not match");
        }

        try {
            const { data } = await axios.post(
                "/auth/register",
                {
                    username,
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
            <div className="register-screen">
                <form  onSubmit={registerHandler} className="register-screen__form">
                    <h3 className="register-screen__title">Register</h3>
                    {
                        error && <span className="error-message">{error}</span>
                    }
                    <div className="form-group">
                        <label htmlFor="name">Username</label>
                        <input type="text" required id="name" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" required id="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" required id="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" required id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>

                    <span className="register-screen__subtext">Already have an account? <Link to="/login">Login</Link></span>

                </form>
            </div>
        )
};

export default RegisterScreen;
