"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { SetCredentialsContext } from "../utils/auth";

export default function Rounds() {
  const router = useRouter();
  const { hasCredentials } = useContext(SetCredentialsContext);

  useEffect(() => {
    if (!hasCredentials()) {
      router.replace("/");
      return;
    }
  }, []);

  return <></>;
}
