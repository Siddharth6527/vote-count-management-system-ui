import { createContext } from "react";

export const SetCredentialsContext = createContext();

export function _setCredentials({ user, password }) {
  localStorage.setItem("user", user);
  localStorage.setItem("password", password);
}

export function _getCredentials() {
  return {
    user: localStorage.getItem("user"),
    password: localStorage.getItem("password"),
  };
}
