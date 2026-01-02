import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthed: false,
  loading: true,

  login: async () => {},
  logout: () => {},
  setUser: () => {},
});