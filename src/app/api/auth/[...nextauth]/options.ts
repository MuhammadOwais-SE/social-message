import { NextAuthOptions } from "next-auth";
// import credentials, {CredentialsProvider} from "next-auth/providers/credentials";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export  const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
          id:"credentails",
          name: "login in",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials: any): Promise<any>{
            await dbConnect();
            try{
                const user = await userModel.findOne({
                    $or: [
                        {email: credentials.identifier},
                        {username: credentials.identifier}
                     ]
                })
                if (!user){
                    throw new Error("No user found with this email")
                }

                if(!user.isVerify){
                    throw new Error("Please verify first, before login")
                }

                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                if(isPasswordCorrect){
                    return user;      
                }else{
                    throw new Error("Password is incorrect")
                }
            } catch (err: any){
                throw new Error(err)
            }

          }
        })
    ],
    pages:{
        signIn: '/login-in'
    },
    session:{
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    //  we create callbacks to avoid request from database to avoid chocking it.
    callbacks: {
        // strategy we will try to get every field from our token
        async session({ session, token}) {
            if(token){
                session.user._id = token._id
                session.user.isVerify = token.isVerify
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
          return session
        },
        async jwt({ token, user, }) {
            token.id = user._id?.toString()
            token.isVerify = user.isVerify
            token.isAcceptingMessages = user.isAcceptingMessages
            token.username = user.username
          
            return token
        }
    }
}