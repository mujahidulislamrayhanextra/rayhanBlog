
// // http://localhost:3000/api/blog/blogid/comment

import Blog from '@/model/Blog';
import { connect } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/jwt';
import User from '@/model/User';


export async function POST(req,res) {
    await connect();
    
    const id =(await res.params).id
    const accessToken = req.headers.get("authorization");
    const token = accessToken.split(" ")[1];
       
    // console.log(accessToken)

    const decodedToken = verifyJwtToken(token);

    if(!accessToken || !decodedToken ){
       return new Response(
           JSON.stringify({ error: "unauthorized (worng or expired token" }),{status:403}
       )
    } 
    try {

       const body = await req.json();
       
       const blog = await Blog.findById(id);

       const user = await User.findById(decodedToken._id) 

       const newComment  = {
        text:body.text,
        user
       }
       blog.comments.unshift(newComment)
       await blog.save();

       // console.log(newBlog)

       return NextResponse.json(blog,{status:201})
       
    } catch (error) {
       return NextResponse.json(error);
      
    } 
}