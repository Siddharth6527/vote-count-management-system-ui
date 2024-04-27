"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { CredentialsContext } from "../utils/auth";

export default function Rounds() {
  const router = useRouter();
  const { hasCredentials } = useContext(CredentialsContext);

  useEffect(() => {
    if (!hasCredentials()) {
      router.replace("/");
      return;
    }
  }, []);

  return <></>;
}
