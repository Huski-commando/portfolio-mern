import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

// motion
import { motion } from "framer-motion";
import { fadeIn } from "../utils/variants";

const Projects = () => {
  const [project, setProject] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/post/getPosts?limit=6");
      const data = await res.json();

      setProject(data.posts);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // console.log(project);
  return (
    <div className="mt-16 px-4 sm:mt-24 max-w-7xl mx-auto">
      <motion.h1
        className="text-center text-4xl xl:text-5xl font-semibold mb-10"
        variants={fadeIn("up", 0.4)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: true, amount: 0.7 }}
      >
        My Work
      </motion.h1>

      <div className="flex flex-wrap justify-center gap-10 my-10">
        {project?.map((item) => (
          <PostCard key={item?._id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
