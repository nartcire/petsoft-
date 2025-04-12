"use client";

import { PetContext } from "@/app/contexts/pet-context-provider";
import { SearchContext } from "@/app/contexts/search-context-provider";
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

export function useSearchContext() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "Some component is trying to access the search context outside of the search context provider tags"
    );
  }

  return context;
}
