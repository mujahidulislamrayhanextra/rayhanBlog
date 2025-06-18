
// http://localhost:3000/api/blog/

// import Blog from '@/model/Blog';
// import { connect } from '@/lib/db';
// import { NextResponse } from 'next/server';
// import { verifyJwtToken } from '@/lib/jwt';

// export async function POST(req) {
//     await connect();

//     const accessToken = req.headers.get("authorization");

//     // Check if accessToken exists and is valid
//     if (!accessToken || !accessToken.startsWith("Bearer ")) {
//         return NextResponse.json(
//             { error: "Unauthorized: Missing or malformed token" },
//             { status: 401 }
//         );
//     }

//     const token = accessToken.split(" ")[1];
//     const decodedToken = verifyJwtToken(token);

//     if (!decodedToken) {
//         return NextResponse.json(
//             { error: "Unauthorized: Invalid or expired token" },
//             { status: 403 }
//         );
//     }

//     try {
//         const body = await req.json();
//         const newBlog = await Blog.create(body);

//         return NextResponse.json(newBlog, { status: 201 });
//     } catch (error) {
//         console.error("Error creating blog:", error);
//         return NextResponse.json(
//             { error: "Failed to create blog", details: error.message },
//             { status: 500 }
//         );
//     }
// }




// export async function GET(req) {

//    await connect() ;
    
//    return NextResponse.json("fdfkjdfkj")
 
// }




// // http://localhost:3000/api/blog

import Blog from '@/model/Blog';
import { connect } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyJwtToken } from '@/lib/jwt';

export async function PUT(req,res) {
         await connect();
         
         const id = (await res.params).id;

         const accessToken = req.headers.get("authorization");
         const token = accessToken.split(" ")[1];
             
         // console.log(accessToken)

         const decodedToken = verifyJwtToken(token);

         if(!accessToken || !decodedToken ){
            return NextResponse.json({
                error: "unauthorized (wrong or expried token)"
            },
            {status:403}
        
        )
         } 
         try {

            const body = await req.json();
         
            const blog = await Blog.findById(id).populate("authorId")
  if (blog?.authorId?._id.toString() !== decodedToken._id.toString() ) {
    return NextResponse.json(
        {msg: "Only author can update his/her blog" },
        {status:403}
    )
  }

  const updateBlog = await Blog.findByIdAndUpdate(id,{$set: {...body}},{new:true})

            return NextResponse.json(updateBlog,{status:200})
            
         } catch (error) {
            return NextResponse.json(error);
           
         } 
}



export async function GET(req,res) {

   await connect() ;

   const id = (await res.params).id
    try {
      const blog = await Blog.findById(id).populate({
         path: "authorId",
         select:"-password"
      }).populate({
        path: "comments.user",
        select: "-password"
      })

      return NextResponse.json(blog,{status:200})
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