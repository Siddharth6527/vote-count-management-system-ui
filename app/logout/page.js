"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { CredentialsContext } from "../utils/auth";

export default function Logout() {
  const router = useRouter();
  const { clearCredentials } = useContext(CredentialsContext);

  useEffect(() => {
    clearCredentials();
    router.replace("/login");
  }, []);

  return <></>;
}
