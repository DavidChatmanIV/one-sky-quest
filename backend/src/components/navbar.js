import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar() {
const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

return (
    <nav>
    {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Log In</button>
    ) : (
        <>
        <p>Welcome, {user.name}</p>
        <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
        </button>
        </>
    )}
    </nav>
);
}
