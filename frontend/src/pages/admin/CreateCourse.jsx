import axios from "axios"
import React, { useState } from "react"
import { FaArrowLeftLong } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"
import { serverUrl } from "../../App"
import { toast } from "react-toastify"
import { ClipLoader } from "react-spinners"
import { HiBookOpen } from "react-icons/hi"

const CATEGORIES = [
    'App Development', 'AI/ML', 'AI Tools', 'Data Science',
    'Data Analytics', 'Ethical Hacking', 'UI UX Designing', 'Web Development', 'Others'
]

const CreateCourse = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")

    const CreateCourseHandler = async () => {
        if (!title.trim()) return toast.error("Please enter a course title")
        if (!category) return toast.error("Please select a category")
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/course/create", { title, category }, { withCredentials: true })
            toast.success("Course created!")
            navigate(`/addcourses/${result.data._id}`)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to create course")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-black text-white px-6 py-8">
                <div className="max-w-2xl mx-auto">
                    <button onClick={() => navigate("/courses")} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm">
                        <FaArrowLeftLong size={14} /> Back to Courses
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                            <HiBookOpen size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black">Create New Course</h1>
                            <p className="text-white/50 text-sm mt-1">Start by giving your course a name and category</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                    <form onSubmit={(e) => { e.preventDefault(); CreateCourseHandler() }} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-black text-black mb-2">Course Title *</label>
                            <input
                                type="text"
                                placeholder="e.g. Complete Web Development Bootcamp"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white font-medium"
                            />
                            <p className="text-xs text-gray-400 mt-2">Make it descriptive and engaging</p>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-black text-black mb-3">Category *</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        className={`px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all duration-200 text-left ${category === cat
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-black"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info box */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <p className="text-sm text-gray-600 font-medium">
                                💡 After creating, you'll be taken to the course details page where you can add thumbnails, descriptions, lectures, and more.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate("/courses")}
                                className="flex-1 border-2 border-gray-200 text-gray-600 rounded-xl py-3.5 font-bold text-sm hover:border-black hover:text-black transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-black text-white rounded-xl py-3.5 font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {loading ? <ClipLoader size={20} color="white" /> : "Create Course →"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateCourse