import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
<Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    authorizationParams={{ redirect_uri: window.location.origin }}
>
    <App />
</Auth0Provider>
);
