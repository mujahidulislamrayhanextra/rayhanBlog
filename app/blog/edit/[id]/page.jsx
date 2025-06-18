"use client";
import Input from "@/components/Input";
import { useEffect, useState } from "react";

import Textarea from "@/components/Textarea";
import { useParams, useRouter } from "next/navigation";

import { useSession } from "next-auth/react";
import Image from "next/image";

import { deletePhoto } from "@/action/uploadAction";

const initialState = {
  title: "",
  description: "",
  excerpt: "",
  qoute: "",
  category: "",
  photo: {},
  blogId: "",
  newImage: "",
};

const EditBlog = () => {
  const CLOUD_NAME = "dsivlvees";

  const UPLOAD_PRESET = "nextjs_blog_image";

  const [state, setState] = useState(initialState);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { data: session, status } = useSession();
  //  const sess = useSession();

  const params = useParams();

  //  console.log(sess)

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/api/blog/${params.id}`
        );

        if (res.status === 200) {
          const blogData = await res.json();
          setState((prevstate) => ({
            ...prevstate,
            title: blogData.title,
            description: blogData.description,
            excerpt: blogData.excerpt,
            qoute: blogData.qoute,
            category: blogData.category,
            photo: blogData.image,
            blogId: blogData._id,
          }));
        } else {
          setError("Error fetching blog data");
        }
      } catch (error) {
        setError("Error fetching blog data", error);
      }
    }

    fetchBlog();
  }, [params.id]);

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
  console.log(state);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { newImage, title, category, description, excerpt, qoute } = state;

    if (!title || !description || !category || !excerpt || !qoute) {
      setError("Please fill out all required fields");
      return;
    }
    if (newImage) {
      const maxSize = 5 * 1024 * 1024;
      if (newImage.size > maxSize) {
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

      let image;

      if (state.newImage) {
        image = await uploadImage();

        if (state.photo?.id) {
          await deletePhoto(state.photo.id);
        } else {
          image = state.photo;
        }
      }

      // const image = await uploadImage();
      const updateBlog = {
        title,
        category,
        description,
        excerpt,
        qoute,
        image,
        authorId: session?.user?._id,
      };

      const response = await fetch(
        `${process.env.NEXTAUTH_URL}/api/blog/${params.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "PUT",
          body: JSON.stringify(updateBlog),
        }
      );

      if (response?.status === 200) {
        setSuccess("Blog edited successfully.");
        setTimeout(() => {
          router.refresh();
          router.push(`/blog/${params.id}`);
        }, 1500);
      } else {
        console.log(response?.status);
        setError("Error occured while editing blog 1.");
      }
    } catch (error) {
      console.log(error, error.message);
      setError("Error occured while editing blog 2.");
    }

    setIsLoading(false);
  };

  const uploadImage = async () => {
    if (!state.newImage) return;
    const formdata = new FormData();
    formdata.append("file", state.newImage);
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

  const handleCancelUploadImg = () => {
    setState({ ...state, ["newImage"]: "" });
  };

  return (
    <section className='container max-w-3xl'>
      <h2 className='mb-5'>
        <span className='special-word'>Edit</span>Blog{" "}
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
            <option value='Politics'>Politics</option>
            <option value='History'>History</option>
            <option value='Religion '>Religion </option>
            <option value='Health'>Health</option>
            <option value='Others'>Others</option>
          </select>
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium'>Upload Image</label>
          <input
            onChange={handleChange}
            type='file'
            name='newImage'
            accept='image'
          />

          {state.newImage ? (
            <div>
              <Image
                src={URL.createObjectURL(state.newImage)}
                priority
                alt='Sampleimage'
                width={200}
                height={200}
                sizes='100vw'
                className=' w-32 mt-5'
              />

              <button onClick={handleCancelUploadImg}>Cancel</button>
            </div>
          ) : (
            <div>
              {state.photo && state.photo["url"] && (
                <div>
                  <Image
                    src={state.photo.url}
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
          )}
        </div>

        {error && <div className='text-red-700 '>{error}</div>}

        {success && <div className='text-green-700 '>{success}</div>}

        <button type='submit' className='btn'>
          {isLoading ? "Loading" : "Edit"}
        </button>
      </form>
    </section>
  );
};

export default EditBlog;
