import { headers } from "next/headers";

export async function getIsGuest(): Promise<boolean> {
  const role = (await headers()).get("x-user-role");
  return role !== "admin";
}
