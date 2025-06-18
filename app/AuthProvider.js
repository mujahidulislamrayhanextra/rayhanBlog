"use client"

import { SessionProvider } from 'next-auth/react';

const AuthProvier = ({children,session}) => (

     <SessionProvider session={session} >
        {children}
     </SessionProvider>
)


export default AuthProvier;
