// Check if the user is logged in by checking for a token
export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

// Get the token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Get the user info from localStorage (if stored during login)
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Remove token and user info from localStorage (used on logout)
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
    window.location.href = "/login"
};
