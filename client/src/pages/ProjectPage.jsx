import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { Alert, Button } from "flowbite-react";
import CallToAction from "../components/CallToAction";

import { HiInformationCircle } from "react-icons/hi";
import PostCard from "../components/PostCard";
import Img from "../components/Img";

// LAZY LOADING MODAL IMAGES
const ImageModal = lazy(() => import("../components/ImageModal"));

const ProjectPage = () => {
  const { slug } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  // modal useState
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (images) => {
    setSelectedImage(images);
    setIsOpen(true);
  };
  // console.log(selectedImage);

  const onClose = () => {
    setSelectedImage(null);
    setIsOpen(false);
  };

  const recentPostUrl = `/api/post/getPosts?limit=3`;

  // console.log(slug);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/post/getPosts?slug=${slug}`);
        const data = await res.json();
        // console.log(data.posts[0]);
        if (!res.ok) {
          setError(true);
          setIsLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchPost();
  }, [slug]);

  const fetchRelatedPosts = async (url) => {
    try {
      setIsLoading(true);
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setRecentPosts(data?.posts);
      } else {
        console.log(data?.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchRelatedPosts(recentPostUrl);
  }, []);

  return (
    <main>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="p-3 flex flex-col max-w-6xl mx-auto 2xl:min-h-screen">
          <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:max-w-4xl">
            {post?.title}
          </h1>
          <Link
            to={`/search?category=${post?.category}`}
            className="self-center mt-2 md:mt-5"
          >
            <Button color="gray" pill size="xs">
              {post?.category}
            </Button>
          </Link>

          <div
            onClick={() => openModal(post?.image)}
            className="max-h-[600px] max-w-6xl flex justify-center"
          >
            <Img
              src={post?.image}
              alt={post?.title}
              className="p-3 max-h-[600px] w-[1400px] object-cover"
            />
          </div>

          <div className="flex justify-between p-3 px-6 border-b border-b-slate-300 text-sm">
            <span>
              {post && new Date(post?.createdAt).toLocaleDateString()}
            </span>
            <span className="italic">
              {(post?.content.length / 1000).toFixed(0)} mins read
            </span>
          </div>

          <div
            className="p-3 max-w-2xl mx-auto w-full post-content"
            dangerouslySetInnerHTML={{ __html: post?.content }}
          ></div>

          {error && (
            <Alert color="failure" icon={HiInformationCircle} className="">
              {error}
            </Alert>
          )}
        </div>
      )}
      <div className="max-w-5xl mx-auto w-full">
        <CallToAction />
      </div>

      <div className="flex flex-col justify-center items-center mb-5 max-w-7xl mx-auto">
        <h1 className="text-xl my-5 border-b-2 border-gray-500 ">
          Recent Projects
        </h1>
        <div className="flex flex-wrap justify-center gap-4 p-4">
          {recentPosts?.map((recentPost) => (
            <PostCard key={recentPost?._id} data={recentPost} />
          ))}
        </div>
      </div>

      {/* opening modal */}

      {isOpen && (
        <Suspense fallback={<Loader />}>
          <ImageModal
            isOpen={isOpen}
            onClose={onClose}
            imageUrl={selectedImage}
            imageTitle={post?.title}
          />
        </Suspense>
      )}
    </main>
  );
};

export default ProjectPage;
