import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.open("http://localhost:1234/auth/google", "_self");
    }, []);

    useEffect(() => {
        axios.get("http://localhost:1234/auth/check")
            .then((res) => {
                if (res.data.authenticated) {
                    navigate("/kiosk");
                }
            })
            .catch(() => navigate("/"));
    }, [navigate]);

    return <h2>Redirecting to Google Login...</h2>;
};

export default Auth;
