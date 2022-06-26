import React, { useState } from "react";
import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import Head from "next/head";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => {
        setSubmitted(true);
      })
      .catch((err) => {
        setSubmitted(false);
      });
  };

  return (
    <main>
      <Head>
        <title>
          {post.title} {post.description} | by {post.author.name}
        </title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Header />

      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()}
        alt="Post Image"
      />
      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()}
            alt="Author image"
          />
          <p className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            className=""
            content={post.body}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            serializers={{
              h1: (props: any) => {
                return <h1 className="text-2xl font-bold my-5" {...props} />;
              },
              h2: (props: any) => {
                return <h2 className="text-xl font-bold my-5" {...props} />;
              },
              h3: (props: any) => {
                return <h3 className="text-l font-bold my-5" {...props} />;
              },
              p: (props: any) => {
                return <p className="my-2" {...props} />;
              },
              li: ({ children }: any) => {
                return <li className="ml-4 list-disc">{children}</li>;
              },
              link: ({ href, children }: any) => {
                return (
                  <a href={href} className="text-blue-500 hover:underline">
                    {children}
                  </a>
                );
              },
            }}
          />
        </div>
      </article>
      <hr className="max-w-lg mx-auto border border-yellow-500" />
      {submitted ? (
        <div className="fkex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
          <p>Once it has been approved, it will appear below! </p>
        </div>
      ) : (
        <form
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
          <h1 className="text-3xl font-bold">Leave a comment below!</h1>
          <hr className="py-3 mt-2" />

          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring-2"
              type="text"
              placeholder="John Appleseed"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring-2"
              type="email"
              placeholder="John Appleseed"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring-2"
              placeholder="John Appleseed"
              rows={8}
            />
          </label>

          {/* Errors */}
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">- The name field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">
                - The email field is required
              </span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                - The comment field is required
              </span>
            )}
          </div>

          <input
            type="submit"
            className="shadow bg-yellow-500 hover:bg-yellow-400 transition-all ease-in-out duration-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
          />
        </form>
      )}

      {/* Comments */}
      <div className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post.comments.map((comment) => {
          return (
            <div key={comment._id}>
              <p className="">
                <span className="text-yellow-500">{comment.name}: </span>
                {comment.comment}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default PostCard;

export const getStaticPaths = async () => {
  const query = ` *[_type == "post"]{
        _id,
      }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      _id: post._id,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = ` *[_type == "post" && _id == $_id][0]{
        _id,
        _createdAt,
        title,
        description,
        author-> {
            name,
            image
        },
        "comments": *[
            _type == "comment" && 
            post._ref == ^._id && 
            approved == true
        ],
        mainImage,
        body,
        slug
      }`;

  const post = await sanityClient.fetch(query, {
    _id: params?._id,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 120, // Update cache every 120 seconds
  };
};
