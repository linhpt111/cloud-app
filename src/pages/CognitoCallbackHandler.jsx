import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUser, setLoading } from "../slices/profileSlice";
import { setToken } from "../slices/authSlice"; 

const CognitoCallbackHandler = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");
        if (!code) return;

        const fetchTokens = async () => {
            try {
                dispatch(setLoading(true));

                const response = await axios.post(
                    "https://ap-southeast-1uxy9slsvn.auth.ap-southeast-1.amazoncognito.com/oauth2/token",
                    new URLSearchParams({
                        grant_type: "authorization_code",
                        client_id: "4u3l06fs2e61aa9ebo88md66f4", 
                        redirect_uri: "http://localhost:3000/callback",
                        code: code,
                    }),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );

                const id_token = response.data.id_token;
                const userInfo = jwtDecode(id_token);

                const userObj = {
                    firstName: userInfo.given_name || "AWS",
                    lastName: userInfo.family_name || "User",
                    email: userInfo.email,
                    image: userInfo.picture || "",
                    additionalDetails: {},
                };

                localStorage.setItem("token", id_token);
                localStorage.setItem("user", JSON.stringify(userObj));

                dispatch(setToken(id_token));       
                dispatch(setUser(userObj));
                dispatch(setLoading(false));

                navigate("/dashboard/my-profile", { replace: true });
            } catch (error) {
                console.error("Token Exchange Error", error);
                dispatch(setLoading(false));
                navigate("/login");
            }
        };

        fetchTokens();
    }, [dispatch, navigate]);

    return (
        <div className="text-white p-5 text-center">
            Logging you in...
        </div>
    );
};

export default CognitoCallbackHandler;