import React from 'react'
import { useSelector } from "react-redux"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import img from "../../assets/empty.jpg"
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6"
import { HiAcademicCap, HiCurrencyRupee, HiBookOpen, HiUsers } from 'react-icons/hi'

function Dashboard() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const { creatorCourseData } = useSelector((state) => state.course)

  const totalStudents = creatorCourseData?.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0) || 0
  const totalCourses = creatorCourseData?.length || 0
  const publishedCourses = creatorCourseData?.filter(c => c.isPublished)?.length || 0
  const totalEarnings = creatorCourseData?.reduce((sum, c) => sum + ((c.price || 0) * (c.enrolledStudents?.length || 0)), 0) || 0

  const lectureData = creatorCourseData?.map(c => ({
    name: c.title?.length > 12 ? c.title.slice(0, 12) + "…" : c.title,
    lectures: c.lectures?.length || 0
  })) || []

  const enrollData = creatorCourseData?.map(c => ({
    name: c.title?.length > 12 ? c.title.slice(0, 12) + "…" : c.title,
    enrolled: c.enrolledStudents?.length || 0
  })) || []

  const stats = [
    { label: "Total Earnings", value: `₹${totalEarnings.toLocaleString()}`, icon: <HiCurrencyRupee size={22} />, bg: "bg-black", text: "text-white" },
    { label: "Total Students", value: totalStudents, icon: <HiUsers size={22} />, bg: "bg-white", text: "text-black" },
    { label: "Total Courses", value: totalCourses, icon: <HiBookOpen size={22} />, bg: "bg-white", text: "text-black" },
    { label: "Published", value: publishedCourses, icon: <HiAcademicCap size={22} />, bg: "bg-white", text: "text-black" },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
          <p>{label}: {payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm">
            <FaArrowLeftLong size={14} /> Back to Home
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={userData?.photoUrl || img}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20"
            />
            <div>
              <p className="text-white/50 text-sm font-medium mb-1">Welcome back,</p>
              <h1 className="text-3xl font-black">{userData?.name || "Educator"}</h1>
              <p className="text-white/60 text-sm mt-1">{userData?.description || "Start creating amazing courses!"}</p>
            </div>
            <div className="sm:ml-auto">
              <button
                onClick={() => navigate("/courses")}
                className="bg-white text-black rounded-xl px-6 py-3 font-black text-sm hover:bg-gray-100 transition-colors"
              >
                + Create Course
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-gray-200 shadow-sm`}>
              <div className={`${s.text} flex items-center justify-between mb-3`}>
                <span className="opacity-60">{s.icon}</span>
              </div>
              <div className={`text-3xl font-black ${s.text}`}>{s.value}</div>
              <div className={`text-xs font-medium mt-1 ${s.bg === 'bg-black' ? 'text-white/50' : 'text-gray-400'}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lectures Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-5 bg-black rounded-full" />
              <h2 className="font-black text-base">Lectures per Course</h2>
            </div>
            {lectureData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={lectureData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="lectures" fill="#000000" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-gray-400 text-sm">No course data yet</div>
            )}
          </div>

          {/* Enrollment Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-5 bg-black rounded-full" />
              <h2 className="font-black text-base">Student Enrollments</h2>
            </div>
            {enrollData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={enrollData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="enrolled" fill="#000000" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-gray-400 text-sm">No enrollment data yet</div>
            )}
          </div>
        </div>

        {/* Recent Courses Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 bg-black rounded-full" />
              <h2 className="font-black text-base">Your Courses</h2>
            </div>
            <button onClick={() => navigate("/courses")} className="text-sm font-bold text-black hover:underline">
              View all →
            </button>
          </div>

          {creatorCourseData?.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <HiBookOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No courses yet</p>
              <button onClick={() => navigate("/createcourses")} className="mt-4 bg-black text-white rounded-xl px-5 py-2.5 text-sm font-bold">
                Create your first course
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {creatorCourseData?.slice(0, 5).map((course, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100" onClick={() => navigate(`/addcourses/${course._id}`)}>
                  <img src={course.thumbnail || img} className="w-14 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-black truncate">{course.title}</p>
                    <p className="text-xs text-gray-400">{course.category} · {course.level}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-sm">₹{course.price || 0}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {course.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard