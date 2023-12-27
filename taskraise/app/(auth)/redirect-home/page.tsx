"use client";
import React from "react";
import { useRouter } from "next/navigation";

function RedirectHome() {
  const router = useRouter();
  router.push("/");
  router.refresh();
  return <div>Redirecting home...</div>;
}

export default RedirectHome;
