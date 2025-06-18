
// // http://localhost:3000/api/blog/blogid/comment/commentid

import Blog from '@/model/Blog';
import { connect } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/jwt';

import { headers } from 'next/headers';

export async function DELETE(req,res) {
    await connect();
    //  const head = headers()
    // console.log("hat",head)
    const id = (await res.params).id;
      
    const commentId =( await res.params).commentId
    
    // console.log(commentId)
    // console.log(req)

    const accessToken = await req.headers.get("authorization");
    const token = accessToken.split(" ")[1];
        
    // console.log(accessToken)

    const decodedToken = verifyJwtToken(token);

    if(!accessToken || !decodedToken ){
       return NextResponse.json({
           error: "unauthorized (wrong or expried token)"
       },
       {status:403} ,

       
   
   )
    } 
    try {

     
    
       const blog = await Blog.findById(id).populate("authorId").populate("comments.user")

   const comment = blog.comments.find(comment => comment.id === commentId)

//  console.log("comment",comment)


  if (!comment) {
    return NextResponse.json({
        message: "comment does not exist"
    },{status:404})
    
  }

if (comment?.user?._id.toString() !== decodedToken._id.toString() ) {
return NextResponse.json(
   {msg: "Only author can delete his/her comment" },
   {status:403}
)
}

 blog.comments = blog.comments.filter(comment  => comment.id !== commentId )
 await blog.save()
       return NextResponse.json({message:"Comment Deleted"},{status:200})
       
    } catch (error) {
       return NextResponse.json(error);
      
    } 
}