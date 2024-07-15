import { redirect } from "@remix-run/server-runtime";

// previously this was /explore
export const loader = () => redirect("/");
