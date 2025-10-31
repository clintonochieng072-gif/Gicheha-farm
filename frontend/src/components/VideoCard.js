import React from "react";

const VideoCard = ({ video }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <video
          src={video.video}
          className="w-full h-32 sm:h-40 md:h-48 object-contain bg-gray-50"
          controls
          preload="metadata"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
          VIDEO
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-secondary-800 mb-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-secondary-600 text-sm leading-relaxed">
            {video.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between text-xs text-secondary-500">
          <span className="capitalize">{video.category}</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
