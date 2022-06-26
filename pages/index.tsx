import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import Border from "../components/Border";
import Header from "../components/Header";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";

interface Props {
  posts: [Post];
}

const Home = ({ posts }: Props) => {
  const date = new Date(posts[0]._createdAt);
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium - Where good ideas find you.</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Header />
      <Border />

      {/* Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts.map((post) => {
          return (
            <Link key={post._id} href={`/post/${post._id}`}>
              <div className="border rounded-lg group cursor-pointer overflow-hidden">
                <img
                  className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                  src={urlFor(post.mainImage).url()!}
                  alt="Post Thumbnail"
                />
                <div className="flex justify-between p-5 bg-white">
                  <div>
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={urlFor(post.author.image).url()!}
                        alt="Author Thumbnail"
                      />
                      <p className="font-bold mx-5">{post.author.name}</p>
                    </div>
                    <p className="text-lg font-bold">{post.title}</p>
                    <p className="text-xs font-light text-gray-500">
                      {post.description}
                    </p>
                    <p className="text-xs font-light text-gray-500">
                      {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                      }).format(new Date(post._createdAt))}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const query = `
    *[_type == "post"]{
      _id,
      title,
      author-> {
        name, 
        image
      },
      description,
      mainImage,
      slug,
      _createdAt
    }
  `;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
