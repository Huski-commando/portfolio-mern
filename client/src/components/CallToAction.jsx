import React, { useState } from "react";
import ctaImage from "../assets/cta.avif";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <div className="flex flex-col gap-6 sm:flex-row m-3 justify-center items-center p-3 py-6 border border-teal-500 rounded-tl-3xl rounded-br-3xl">
      <div className="flex-1 flex flex-col justify-center gap-3 items-center">
        <h2 className="text-3xl sm:text-3xl tracking-wide">
          Want to work with me
        </h2>
        <p className="text-xl tracking-wider text-gray-500">
          Check out my contact details
        </p>
        <div>
          <Button
            gradientMonochrome="failure"
            size="lg"
            className="focus:ring-0 rounded-tl-xl rounded-bl-none rounded-tr-none rounded-br-xl px-10"
          >
            <Link to="/contact">Get Contact Details</Link>
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <img src={ctaImage} alt="project image" />
      </div>
    </div>
  );
};

export default CallToAction;