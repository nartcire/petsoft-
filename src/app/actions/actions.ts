"use server";

import { Pet } from "@prisma/client";
import { PetEssentials } from "@/lib/types";
import { petFormSchema } from "@/lib/validations";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sleep } from "@/lib/utils";

export async function addPet(petData: PetEssentials) {
  await sleep(1000);

  const validatedPet = petFormSchema.safeParse(petData);

  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: Pet["id"], petData: PetEssentials) {
  await sleep(1000);

  const validatedPet = petFormSchema.safeParse(petData);

  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: "Could not edit pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function checkoutPet(petId: Pet["id"]) {
  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (error) {
    return {
      message: "Could not checkout pet.",
    };
  }

  revalidatePath("/app", "layout");
}
