"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { SetCredentialsContext } from "../utils/auth";

export default function Logout() {
  const router = useRouter();
  const { clearCredentials } = useContext(SetCredentialsContext);

  useEffect(() => {
    clearCredentials();
    router.replace("/login");
  }, []);

  return <></>;
}
