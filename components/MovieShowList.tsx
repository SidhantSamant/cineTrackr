import React from "react";
import MovieShowListItem from "./MovieShowListItem";

interface MovieShow {
  title: string;
  imageUrl: string;
}

interface MovieShowListProps {
  items: MovieShow[];
}

const MovieShowList: React.FC<MovieShowListProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <MovieShowListItem
          key={index}
          title={item.title}
          imageUrl={item.imageUrl}
        />
      ))}
    </div>
  );
};

export default MovieShowList;
