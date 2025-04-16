"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { checkAuth, getPetById } from "@/lib/server-utils";

import { AuthError } from "next-auth";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sleep } from "@/lib/utils";

// --- User Actions --- //
export async function logIn(prevState: unknown, formData: unknown) {
  await sleep(1000);

  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: "Failure logging in",
      };
    }

    throw error;
  }
}

export async function signUp(prevState: unknown, formData: unknown) {
  await sleep(1000);

  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  const formDataEntries = Object.fromEntries(formData.entries());

  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return {
      message: "Invalid form data.",
    };
  }

  const hashedPassword = await bcrypt.hash(validatedFormData.data.password, 10);

  try {
    await prisma.user.create({
      data: {
        email: validatedFormData.data.email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists",
        };
      }
    } else {
      return {
        message: "Could not create user.",
      };
    }
  }

  await signIn("credentials", formData);

  redirect("/app/dashboard");
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

// --- Pet Actions --- //
export async function addPet(petData: unknown) {
  await sleep(1000);

  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(petData);

  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, petData: unknown) {
  await sleep(1000);

  // Authentication
  const session = await checkAuth();

  const validatedPet = petFormSchema.safeParse(petData);
  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  } else if (!validatedPetId.success) {
    return {
      message: "Invalid pet id.",
    };
  }

  // Authorization
  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return {
      message: "Pet not found.",
    };
  } else if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized.",
    };
  }
  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
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

export async function checkoutPet(petId: unknown) {
  // authentication check
  const session = await checkAuth();

  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet id.",
    };
  }

  // authorization check
  const pet = await getPetById(validatedPetId.data);

  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }

  if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized.",
    };
  }

  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return {
      message: "Could not checkout pet.",
    };
  }

  revalidatePath("/app", "layout");
}
