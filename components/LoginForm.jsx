"use client"
import React, { useEffect, useState } from 'react';
import Input from './Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';



const initialState = {
  name: "",
  email: "",
  password: ""
}


const LoginForm = () => {



  const [hydrated,setHydrated] = useState(false);
  
  const [state,setState ] = useState(initialState);

  const [error,setError] = useState("")

  const [success,setSuccess] = useState("")

  const [isLoading,setIsLoading] = useState(false)

 const router = useRouter()

  useEffect(() => {
    setHydrated(true)
  },[])

  if(!hydrated){
    return null
  }

    
  const handleChange = (event) =>{
    setError("")
    setState({...state,[event.target.name]: event.target.value})
  }


  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {email,password } = state;

    if( !email || !password){
      setError("All fields are require");
      return;
    }

    const pattern = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/

    if(!pattern.test(email)){
      setError("Please enter a valid email address.")
      return;
    }
    if(password.length < 6 ){
      setError("Password must be at least 6 character long.");
      return;
    }

     try {
      setIsLoading(true)
         const res = await signIn("credentials",{
          email,password,redirect:false
         })

      if(res?.error){
        setError("Invalid Credentials")
        setIsLoading(false)
        return
      }

      router.push("/blog")
     
     } catch (error) {
      console.log(error)
      
     }
 setIsLoading(false)
   
  }




  return (
   <section className='container'>
    <form onSubmit={handleSubmit}  className='border-2 border-paragrapColor rounded-lg max-w-sm mx-auto px-8 py-6 space-y-5'
    >
        <h2 className='text-center special-word'>Login</h2>
        {/* <Input label="Name" type="text" name="name" /> */}
        <Input label="Email" type="email" name="email" onChange={handleChange} value={state.email} />
        <Input label="Password" type="password" name="password" onChange={handleChange} value={state.password} />


        {
          error && <div className='text-red-700 '>
                 {error}
          </div>
        }
        

        
        {
          success && <div className='text-green-700 '>
              {success}
          </div>
        }




        <button type='submit' className='btn w-full'  >
        {isLoading ? "Loading" : "Login"}
        </button>

        <p className='text-center '>Need a Account ? {" "} <Link href={"/signup"} className='text-primaryColor' >Login</Link></p>
        </form>
      
   </section>
  )
}

export default LoginForm
