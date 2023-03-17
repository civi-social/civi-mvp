import type { User } from "@prisma/client";

export type UserCreateRequest = Pick<
  User,
  "email" | "firstName" | "lastName" | "address"
> & {
  password: string;
};
