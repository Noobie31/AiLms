import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6"
import { HiPlay, HiAcademicCap } from 'react-icons/hi'

function EnrolledCourse() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm">
            <FaArrowLeftLong size={14} /> Back to Home
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <HiAcademicCap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black">My Courses</h1>
              <p className="text-white/50 text-sm mt-1">{userData?.enrolledCourses?.length || 0} courses enrolled</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {!userData?.enrolledCourses?.length ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <HiAcademicCap size={36} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-black text-black mb-2">No courses yet</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-sm">You haven't enrolled in any courses yet. Browse our catalog to start learning!</p>
            <button
              onClick={() => navigate("/allcourses")}
              className="bg-black text-white rounded-xl px-8 py-3.5 font-black text-sm hover:bg-gray-800 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.enrolledCourses.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                      <HiPlay size={20} className="text-black ml-0.5" />
                    </div>
                  </div>
                  <span className={`absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-full ${course.level === 'Beginner' ? 'bg-green-100 text-green-700' : course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {course.level}
                  </span>
                </div>

                <div className="p-5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{course.category}</span>
                  <h3 className="font-black text-black text-base mt-1 mb-4 leading-tight line-clamp-2">{course.title}</h3>

                  <button
                    onClick={() => navigate(`/viewlecture/${course._id}`)}
                    className="w-full bg-black text-white rounded-xl py-3 font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <HiPlay size={16} /> Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrolledCourse