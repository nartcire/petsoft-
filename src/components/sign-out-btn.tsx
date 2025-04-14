"use client";

import { Button } from "./ui/button";
import React from "react";
import { logOut } from "@/app/actions/actions";

export default function SignOutBtn() {
  return (
    <Button
      onClick={async () => {
        await logOut();
      }}
    >
      Sign out
    </Button>
  );
}
