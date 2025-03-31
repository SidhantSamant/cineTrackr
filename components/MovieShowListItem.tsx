import React from "react";

interface MovieShowListItemProps {
  title: string;
  imageUrl: string;
}

const MovieShowListItem: React.FC<MovieShowListItemProps> = ({
  title,
  imageUrl,
}) => {
  return (
    <div className="flex items-center rounded-lg bg-gray-800 p-4 text-white shadow-md">
      <img
        src={imageUrl}
        alt={title}
        className="mr-4 h-16 w-16 rounded-md object-cover"
      />
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
    </div>
  );
};

export default MovieShowListItem;
