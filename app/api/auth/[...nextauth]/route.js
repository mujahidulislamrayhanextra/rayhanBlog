import User from "@/model/User";
import { connect } from "@/lib/db";
import NextAuth from "next-auth";
import bcrypt from 'bcrypt';
import { signJwtToken } from "@/lib/jwt";

import CredentialsProvider from 'next-auth/providers/credentials'


export  const authOptions = {
    providers :[
        CredentialsProvider({
            type:"credentials",
            credentials:{},
            async authorize(credentials){
                await connect();
                const {email,password} = credentials;
                try {
                    const user = await User.findOne({email})

                    if(!user){
                        throw new Error("Invalid Input")
                    }
                    const passwordMatch = await bcrypt.compare(password,user.password);

                    if(!passwordMatch){
                        throw new Error("Password do nai match")
                    } else{
                        const { password,...currentUser} = user._doc;
                        const accessToken = signJwtToken(currentUser,{expiresIn: "7d"})


                        return {
                            ...currentUser,
                            accessToken
                        }


                    }
                } catch (error) {
                    console.log(error)
                    
                }
            }
        })
    ],
    pages: {
        signIn: "/login"

    },
    secret : process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    callbacks : {
        async jwt({token,user}){
            if(user){
                token.accessToken = user.accessToken;
                token._id = user._id;
            }
            return token
        },

        async session({session,token}){

            if(token){
                session.user._id = token._id;
                session.user.accessToken = token.accessToken
            }

            return session;

        }


    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }