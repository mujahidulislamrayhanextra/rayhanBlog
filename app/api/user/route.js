// // http://localhost:3000/api/user/id

import Blog from '@/model/Blog';
import { connect } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/jwt';
import User from '@/model/User';


export async function GET(req) {

    await connect() ;

     try {
       const user = await User.find({},"-password").sort({ createAt: -1 });
 
       return NextResponse.json(user)
     } catch (error) {
       return NextResponse.json({message: "GET error"},{status:500})
     }
  
  
 }