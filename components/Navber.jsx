"use client";
import demoImage from "@/public/img/demo_image.jpg";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const Navber = () => {
  const [userData, setUserData] = useState({});
  const { data: session, status } = useSession();
  // console.log(session)

  async function fetchUser() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/user/${session?.user?._id}`
      );

      const resData = await response.json();
      setUserData(resData);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchUser();
  }, [session?.user?._id]);

  const pathname = usePathname();

  const [showDropdown, setShowDropdown] = useState(false);
  const handleShowDropdown = () => setShowDropdown((prev) => true);
  const handleHideDropdown = () => setShowDropdown((prev) => false);

  const loggedIn = false;

  return (
    <div className='container py-2 h-16 flex items-center justify-between'>
      <Link href='/'>
        <h2>
           <span className='special-word'>Whiteboard</span>
        </h2>
      </Link>
      <ul className='flex items-center gap-3'>
        <li>
          <Link
            href='/blog'
            className={
              pathname === "/blog" ? "text-primaryColor font-bold" : " "
            }
          >
            Blog
          </Link>
        </li>

        {session?.user ? (
          <>
            <li>
              <Link
                href='/create-blog'
                className={
                  pathname === "/create-blog"
                    ? "text-primaryColor font-bold"
                    : " "
                }
              >
                Create
              </Link>
            </li>
            <li>
              <div className='relative'>
                <Image
                  onClick={handleShowDropdown}
                  src={
                    userData?.avatar?.url ? userData?.avatar?.url : demoImage
                  }
                  alt='avater'
                  sizes='100vw'
                  width={0}
                  height={0}
                  className='w-10 h-10 rounded-full cursor-pointer'
                />
                {showDropdown && (
                  <div className='absolute top-0 right-0 bg-primaryColorLight p-5'>
                    <AiOutlineClose
                      onClick={handleHideDropdown}
                      className='w-full cursor-pointer'
                    />

                    <button
                      onClick={() => {
                        signOut();
                        handleHideDropdown();
                      }}
                    >
                      {" "}
                      Logout
                    </button>
                    <Link
                      onClick={handleHideDropdown}
                      href={`/user/${session?.user?._id.toString()}`}
                    >
                      profile
                    </Link>
                  </div>
                )}
              </div>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                href='/login'
                className={
                  pathname === "/login" ? "text-primaryColor font-bold" : " "
                }
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href='/signup'
                className={
                  pathname === "/signup" ? "text-primaryColor font-bold" : " "
                }
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navber;
