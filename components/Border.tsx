import React from "react";

const Border = () => {
  return (
    <div
      className="flex justify-between items-center
       bg-yellow-400 border-y border-black py-10 lg:py-0"
    >
      <div className="flex flex-col items-center">
        <div className="px-10 space-y-5">
          <h1 className="text-7xl max-w-2xl font-serif font-bold py-5">
            Stay curious.
          </h1>
        </div>
        <div className="px-10 space-y-5">
          <h2 className="py-5">
            Discover stories, thinking, and expertise from writers on any topic.
          </h2>
        </div>
      </div>

      <img
        className="hidden md:inline-flex h-32 lg:h-full"
        src="https://i.imgur.com/xG40LfR.png"
        alt="Medium-logo-short"
      />
    </div>
  );
};

export default Border;
