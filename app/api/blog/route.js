  
// http://localhost:3000/api/blog

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
import { headers } from 'next/headers';

export async function POST(req) {
   // const headerss = headers();
   // console.log(headerss)
         await connect();
         console.log("resaddf",req)
         
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
            const newBlog = await Blog.create(body);

            // console.log(newBlog)

            return NextResponse.json(newBlog,{status:201})
            
         } catch (error) {
            return NextResponse.json(error);
           
         } 
}



export async function GET(req) {
   // const headerss = await headers();
   console.log(req)

   await connect() ;
    try {
      const blogs = await Blog.find({}).populate({
         path: "authorId",
         select:"-password"
      }).sort({ createAt: -1 });

      return NextResponse.json(blogs)
    } catch (error) {
      return NextResponse.json({message: "GET error"},{status:500})
    }
 
 
}