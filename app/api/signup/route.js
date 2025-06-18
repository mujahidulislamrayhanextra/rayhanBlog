// http://localhost:3000/api/signup

import User from "@/model/User";
import bcrypt from 'bcrypt';
import {connect} from '@/lib/db';
import { NextResponse } from "next/server";


export async function POST(req) {
    console.log("POST request to /api/signup");
    try {
            await connect();
        const {name,email,password} = await req.json();

        const isExisting = await User.findOne({email})
        console.log(isExisting);

       if(isExisting){
        return NextResponse.json({ErrorMessage:"User already exits"})
       }

       const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await User.create({name,email,password:hashedPassword})

       return NextResponse.json(newUser, {status:201})
        
    } catch (error) {
        return NextResponse.json({message: "POST Error (sign up)"})
        
    }
    
}
