// // http://localhost:3000/api/user/id

import Blog from '@/model/Blog';
import { connect } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/jwt';
import User from '@/model/User';
import { headers } from 'next/headers';

export async function PATCH(req, res) {
   await connect();
       const accessToken =  (await headers()).get('authorization')
       console.log(accessToken)
   const id = (await res.params).id;
   // const accessToken = req.headers.get("authorization");

   // console.log(accessToken)

   if (!accessToken) {

      return NextResponse.json({error: "accessToken not found"},{status:403})
      
   }
   
   const token = accessToken.split(" ")[1];
     
   const decodedToken = verifyJwtToken(token);
 
   if (!accessToken || !decodedToken) {
     return NextResponse.json(
       { error: "unauthorized (wrong or expired token)" },
       { status: 403 }
     );
   }
 
   try {
     const body = await req.json();
     const user = await User.findById(id);
 
     if (user?._id.toString() !== decodedToken._id.toString()) {
       return NextResponse.json(
         { msg: "Only author can update his/her data" },
         { status: 403 }
       );
     }
 
     const updateUser = await User.findByIdAndUpdate(user?._id, body, {
       new: true,
     });
 
     return NextResponse.json(updateUser, { status: 200 });
   } catch (error) {
     return NextResponse.json({ message: "PATCH error" }, { status: 500 });
   }
 }



export async function GET(req,res) {

   await connect() ;

   const id = (await res.params).id

  //  const accessToken =  (await headers()).get('authorization')
  

  //  console.log(accessToken,"accessToken")
   
   // const token = accessToken.split(" ")[1];
 
   // const decodedToken = verifyJwtToken(token);
   // console.log(decodedToken,"decodedToken")


    try {
      const user = await User.findById(id).select("-password -__v")

      return NextResponse.json(user,{status:200})
    } catch (error) {
      return NextResponse.json({message: "GET error"},{status:500})
    }
 
 
}


export async function DELETE(req,res) {
    await connect();
    
    const id = (await res.params).id;

    const accessToken = req.headers.get("authorization");
    const token = accessToken.split(" ")[1];
        
   //  console.log(accessToken)

    const decodedToken = verifyJwtToken(token);

    if(!accessToken || !decodedToken ){
       return NextResponse.json({
           error: "unauthorized (wrong or expried token)"
       },
       {status:403}
   
   )
    } 
    try {

     
    
       const blog = await Blog.findById(id).populate("authorId")
if (blog?.authorId?._id.toString() !== decodedToken._id.toString() ) {
return NextResponse.json(
   {msg: "Only author can delete his/her blog" },
   {status:403}
)
}

await Blog.findByIdAndDelete(id)

       return NextResponse.json({message:"Blog Deleted"},{status:200})
       
    } catch (error) {
       return NextResponse.json(error);
      
    } 
}