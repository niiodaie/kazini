import { useEffect } from "react";
import { supabase } from '../supabaseClient'; // or adjust path

function AuthHandler() {
  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("access_token") && hash.includes("refresh_token")) {
      const accessToken = new URLSearchParams(hash.substring(1)).get("access_token");
      const refreshToken = new URLSearchParams(hash.substring(1)).get("refresh_token");

      if (accessToken && refreshToken) {
        // Store tokens
        localStorage.setItem("kazini_token", accessToken);
        localStorage.setItem("kazini_refresh_token", refreshToken);

        // Set Supabase session
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        }).then(({ error }) => {
          if (error) {
            console.error("Supabase setSession error:", error);
          } else {
            console.log("Supabase session established via URL token.");
            window.history.replaceState(null, null, window.location.pathname);
            window.location.href = "/dashboard"; // optional
          }
        });
      }
    }
  }, []);

  return null; // or a loading screen
}

export default AuthHandler;
