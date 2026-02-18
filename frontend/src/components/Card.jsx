import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";

const levelColors = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
}

const CourseCard = ({ thumbnail, title, category, price, id, reviews, level }) => {
  const navigate = useNavigate()

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return null;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };
  const avgRating = calculateAverageRating(reviews);

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-48 bg-gray-100 flex-shrink-0">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-lg">
            <HiArrowRight size={18} className="text-black" />
          </div>
        </div>

        {/* Level badge */}
        {level && (
          <span className={`absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-full ${levelColors[level] || "bg-gray-100 text-gray-600"}`}>
            {level}
          </span>
        )}

        {/* Rating badge */}
        {avgRating && (
          <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
            <FaStar className="text-yellow-400" size={10} /> {avgRating}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{category}</span>

        {/* Title */}
        <h2 className="text-sm font-black text-black leading-snug line-clamp-2 mb-4 group-hover:text-gray-700 transition-colors flex-1">
          {title}
        </h2>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-lg font-black text-black">₹{price}</span>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            {avgRating ? (
              <>
                <FaStar className="text-yellow-400" size={12} />
                <span className="font-semibold text-gray-600">{avgRating}</span>
                <span>({reviews?.length})</span>
              </>
            ) : (
              <span className="text-gray-300">No reviews yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;