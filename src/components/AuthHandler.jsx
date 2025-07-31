export const handleAuthTokens = () => {
  const hash = window.location.hash;

  if (hash.includes("access_token") && hash.includes("refresh_token")) {
    const accessToken = new URLSearchParams(hash.substring(1)).get("access_token");
    const refreshToken = new URLSearchParams(hash.substring(1)).get("refresh_token");

    if (accessToken && refreshToken) {
      localStorage.setItem("kazini_token", accessToken);
      localStorage.setItem("kazini_refresh_token", refreshToken);

      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ error }) => {
        if (error) {
          console.error("Supabase setSession error:", error);
        } else {
          console.log("✅ Supabase session established via URL token");

          // ✅ Clean up the hash
          window.history.replaceState(null, null, window.location.pathname);

          // ✅ Redirect only if on the homepage
          if (window.location.pathname === "/") {
            window.location.href = "/dashboard";
          }
        }
      });
    }
  }
};
