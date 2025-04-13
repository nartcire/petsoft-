"use client";

import React, { createContext, useOptimistic, useState } from "react";
import { addPet, checkoutPet, editPet } from "../actions/actions";

import { Pet } from "@/lib/types";
import { toast } from "sonner";

type PetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (petId: string) => void;
  handleAddPet: (newPet: Omit<Pet, "id">) => Promise<void>;
  handleEditPet: (id: string, newPetData: Omit<Pet, "id">) => Promise<void>;
  handleCheckoutPet: (petId: string) => Promise<void>;
  selectedPet: Pet | undefined;
  numberOfPets: number;
};

export const PetContext = createContext<PetContext | null>(null);

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  // state;
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [...state, { ...payload }];
        case "edit":
          return state.map((pet) => {
            if (pet.id === payload.id) {
              return { ...payload.newPetData };
            }

            return pet;
          });
        case "checkout":
          return state.filter((pet) => pet.id !== payload);
        default:
          return state;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // event handlers / actions
  const handleAddPet = async (newPet: Omit<Pet, "id">) => {
    setOptimisticPets({ action: "add", payload: newPet });
    const error = await addPet(newPet);

    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleEditPet = async (id: string, newPetData: Omit<Pet, "id">) => {
    setOptimisticPets({ action: "edit", payload: { id, newPetData } });
    const error = await editPet(id, newPetData);

    if (error) {
      toast.warning(error.message);
      return;
    }
  };

  const handleCheckoutPet = async (petId: string) => {
    setOptimisticPets({ action: "checkout", payload: petId });
    const error = await checkoutPet(petId);

    if (error) {
      toast.warning(error.message);
    }
    setSelectedPetId(null);
  };
  const handleChangeSelectedPetId = (petId: string) => setSelectedPetId(petId);

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        handleChangeSelectedPetId,
        handleCheckoutPet,
        handleEditPet,
        handleAddPet,
        selectedPet,
        numberOfPets,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
