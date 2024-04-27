import { createContext } from "react";

export const SetCredentialsContext = createContext();

export function _setCredentials({ user, password }) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", user);
    localStorage.setItem("password", password);
  }
}

export function _getCredentials() {
  if (typeof window !== "undefined") {
    return {
      user: localStorage.getItem("user"),
      password: localStorage.getItem("password"),
    };
  }
  return {
    user: undefined,
    password: undefined,
  };
}
