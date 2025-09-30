export const useAuth = () => {
  return {
    user: { name: "Guest" },
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
  };
};
