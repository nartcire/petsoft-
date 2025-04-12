"use client";

import { PetContext } from "@/app/contexts/pet-context-provider";
import { useContext } from "react";

export function usePetContext() {
  const context = useContext(PetContext);

  if (!context) {
    throw new Error(
      "Some component is trying to access the pet context outside of the pet context provider tags"
    );
  }

  return context;
}
