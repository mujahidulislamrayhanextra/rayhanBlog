"use client";
import Input from "@/components/Input";
import { useState } from "react";

import Textarea from "@/components/Textarea";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import Image from "next/image";
const initialState = {
  title: "",
  description: "",
  excerpt: "",
  qoute: "",
  category: "",
  photo: "",
};

const CreateBlog = () => {
  const CLOUD_NAME = "dsivlvees";

  const UPLOAD_PRESET = "nextjs_blog_image";

  const [state, setState] = useState(initialState);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { data: session, status } = useSession();
  //  const sess = useSession();
  //  console.log(sess)

  if (status === "loading") {
    return <p>loading</p>;
  }
  if (status === "unauthenticated") {
    return <p>Access denied</p>;
  }

  const handleChange = (event) => {
    setError("");
    const { name, value, type, files } = event.target;

    if (type === "file") {
      setState({ ...state, [name]: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };
  //  console.log(state)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { photo, title, category, description, excerpt, qoute } = state;

    if (!title || !description || !category || !excerpt || !qoute) {
      setError("Please fill out all required fields");
      return;
    }
    if (photo) {
      const maxSize = 5 * 1024 * 1024;
      if (photo.size > maxSize) {
        setError("File size is too large. Please select a file under 5MB.");
        return;
      }
    }
    if (title.length < 4) {
      setError("Title must be at least 4 characters long.");
      return;
    }

    if (description.length < 20) {
      setError("Description must be at least 20 characters long.");
      return;
    }

    if (excerpt.length < 10) {
      setError("Excerpt must be at least 10 characters long.");
      return;
    }

    if (qoute.length < 6) {
      setError("Qoute must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");
      const image = await uploadImage();
      const newBlog = {
        title,
        category,
        description,
        excerpt,
        qoute,
        image,
        authorId: session?.user?._id,
      };

      const response = await fetch(process.env.NEXT_PUBLIC_NEXTAUTH_URL+ "/api/blog", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(newBlog),
      });
      //   console.log(newBlog)
      // console.log(response?.status)
      // console.log(session?.user?.accessToken)

      if (response?.status === 201) {
        setSuccess("Blog created successfully.");
        setTimeout(() => {
          router.refresh();
          router.push("/blog");
        }, 1500);
      } else {
        setError("Error occured while creating blog 1.");
      }
    } catch (error) {
      console.log(error, error.message);
      setError("Error occured while creating blog 2.");
    }

    setIsLoading(false);
  };

  const uploadImage = async () => {
    if (!state.photo) return;
    const formdata = new FormData();
    formdata.append("file", state.photo);
    formdata.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formdata,
        }
      );

      const data = await res.json();
      const image = {
        id: data["public_id"],
        url: data["secure_url"],
      };
      return image;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className='container max-w-3xl'>
      <h2 className='mb-5'>
        <span className='special-word'>Create</span>Blog{" "}
      </h2>
      <form onSubmit={handleSubmit} className='space-y-5'>
        <Input
          label='Title'
          type='text'
          name='title'
          placeholder='Write your title here...'
          onChange={handleChange}
          value={state.title}
        />
        <Textarea
          label='Description'
          rows='4'
          name='description'
          placeholder='Write your title here...'
          onChange={handleChange}
          value={state.description}
        />
        <Textarea
          label='Excerpt'
          rows='2'
          name='excerpt'
          placeholder='Write your title here...'
          onChange={handleChange}
          value={state.excerpt}
        />
        <Textarea
          label='Qoute'
          rows='2'
          name='qoute'
          placeholder='Write your title here...'
          onChange={handleChange}
          value={state.qoute}
        />

        <div>
          <label className='block'>Select an option</label>
          <select
            name='category'
            onChange={handleChange}
            value={state.category}
            className='block rounded-lg w-full p-3 bg-primaryColorLight '
          >
            <option value='Politics'>Politics </option>
            <option value='History'>History</option>
            <option value='Religion '>Religion </option>
            <option value='Health '>Health </option>
            <option value='Others'>Others</option>
          </select>
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium'>Upload Image</label>
          <input
            onChange={handleChange}
            type='file'
            name='photo'
            accept='image'
          />

          {state.photo && (
            <div>
              <Image
                src={URL.createObjectURL(state.photo)}
                priority
                alt='Sampleimage'
                width={200}
                height={200}
                sizes='100vw'
                className=' w-32 mt-5'
              />
            </div>
          )}
        </div>

        {error && <div className='text-red-700 '>{error}</div>}

        {success && <div className='text-green-700 '>{success}</div>}

        <button type='submit' className='btn'>
          {isLoading ? "Loading" : "Create"}
        </button>
      </form>
    </section>
  );
};

export default CreateBlog;
