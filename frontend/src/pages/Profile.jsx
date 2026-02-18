import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { HiAcademicCap, HiMail, HiPencil, HiUser } from "react-icons/hi"
import { MdPlayLesson } from "react-icons/md"

function Profile() {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()

  const stats = [
    { label: "Enrolled", value: userData?.enrolledCourses?.length || 0, icon: <HiAcademicCap size={20} /> },
    { label: "Completed", value: 0, icon: <MdPlayLesson size={20} /> },
    { label: "Role", value: userData?.role === "educator" ? "Educator" : "Student", icon: <HiUser size={20} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Black header — pt-[70px] accounts for fixed navbar height */}
      <div className="bg-black text-white pt-[70px]">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative flex-shrink-0">
              {userData?.photoUrl
                ? <img src={userData.photoUrl} className="w-20 h-20 rounded-2xl object-cover border-4 border-white/10" alt="" />
                : <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-3xl font-black text-white">
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </div>
              }
              <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-2 border-black flex items-center justify-center text-xs font-black ${userData?.role === "educator" ? "bg-yellow-400 text-black" : "bg-green-400 text-black"}`}>
                {userData?.role === "educator" ? "✦" : "✓"}
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">{userData?.name}</h1>
              <p className="text-white/60 capitalize mt-1 text-sm">{userData?.role}</p>
              <p className="text-white/40 text-xs mt-1 flex items-center gap-1.5">
                <HiMail size={13} /> {userData?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 -mt-5 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm text-center">
              <div className="flex items-center justify-center mb-2 text-black">{s.icon}</div>
              <div className="text-xl font-black text-black">{s.value}</div>
              <div className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5">
          <h2 className="font-black text-base mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-black rounded-full inline-block" /> About
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
              <HiUser className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Full Name</p>
                <p className="text-sm text-black font-semibold">{userData?.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
              <HiMail className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Email</p>
                <p className="text-sm text-black font-semibold">{userData?.email}</p>
              </div>
            </div>
            {userData?.description && (
              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl">
                <HiPencil className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Bio</p>
                  <p className="text-sm text-black leading-relaxed">{userData.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pb-10">
          <button onClick={() => navigate("/editprofile")} className="flex-1 bg-black text-white rounded-xl py-3 font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            <HiPencil size={15} /> Edit Profile
          </button>
          <button onClick={() => navigate("/enrolledcourses")} className="flex-1 border-2 border-black text-black rounded-xl py-3 font-bold text-sm hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
            <HiAcademicCap size={15} /> My Courses
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile