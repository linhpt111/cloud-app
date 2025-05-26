// src/services/cognitoAuth.js

const CLIENT_ID = "4u3l06fs2e61aa9ebo88md66f4";
const REDIRECT_URI = "http://localhost:3000/callback";
const DOMAIN = "https://ap-southeast-1uxy9slsvn.auth.ap-southeast-1.amazoncognito.com";
const RESPONSE_TYPE = "code";
const SCOPE = "email openid phone";

export const loginWithCognito = () => {
    const loginUrl = `${DOMAIN}/login?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = loginUrl;
};

export const signupWithCognito = () => {
    const signupUrl = `${DOMAIN}/signup?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = signupUrl;
};