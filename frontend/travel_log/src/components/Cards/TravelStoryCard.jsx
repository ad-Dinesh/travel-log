import React from "react";
import { FaHeart, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TravelStoryCard = ({
  _id,
  id, // 👈 add this
  imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavorite,
  onFavouriteClick,
  onDelete,
}) => {
  const navigate = useNavigate();

  const storyId = _id || id; //  FIX

  return (
    <div
      className="border rounded-xl overflow-hidden bg-white cursor-pointer transition hover:shadow-xl"
      onClick={() => navigate(`/view-story/${storyId}`)}
    >
      <div className="relative w-full h-[220px]">
        <img
          src={imgUrl || "https://via.placeholder.com/400x220"}
          alt={title}
          className="w-full h-full object-cover"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavouriteClick && onFavouriteClick(storyId);
          }}
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow"
        >
          <FaHeart
            className={`text-sm ${
              isFavorite ? "text-red-500" : "text-gray-300"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-md font-semibold">{title}</h3>

        <p className="text-xs text-gray-400 mb-2">
          {date && new Date(date).toLocaleDateString("en-GB")}
        </p>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {story}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {Array.isArray(visitedLocation)
            ? visitedLocation.map((loc, i) => (
                <span key={i} className="text-xs text-cyan-600">
                  📍 {loc}
                </span>
              ))
            : visitedLocation && <span>📍 {visitedLocation}</span>}
        </div>

        <div className="flex justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/edit-story/${storyId}`); //FIX
            }}
            className="text-blue-500 text-sm"
          >
            <FaEdit /> Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(storyId);
            }}
            className="text-red-500 text-sm"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;