import {} from "next-auth";

declare module "next-auth" {
  interface User {
    hasAccess: boolean;
    email: string;
  }

  interface Session {
    user: User & {
      id: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    hasAccess: boolean;
    email: string;
  }
}
