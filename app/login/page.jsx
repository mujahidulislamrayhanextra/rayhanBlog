import React from 'react';
import LoginForm from '@/components/LoginForm';

import { getServerSession } from 'next-auth';

import { redirect } from 'next/navigation';

import { authOptions } from '../api/auth/[...nextauth]/route';



const Login = async () => {


  const session = await getServerSession(authOptions);

  // console.log(session)
  // console.log(authOptions,"2")
  // console.log(getServerSession,"3")

  if(session) redirect("/blog")
    return (
        <div>
          <LoginForm />
        </div>
    )  ; 
};

export default Login;