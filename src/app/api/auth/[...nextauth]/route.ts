import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);

// Since it is a framer work. you can not define the get and post method in this file
export {handler as GET, handler as POST}