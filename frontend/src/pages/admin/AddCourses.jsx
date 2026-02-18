import React, { useEffect, useRef, useState } from 'react'
import img from "../../assets/empty.jpg"
import { FaArrowLeftLong } from "react-icons/fa6"
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../App'
import { MdEdit } from "react-icons/md"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import { setCourseData } from '../../redux/courseSlice'
import { HiCamera, HiBookOpen, HiTrash, HiEye, HiEyeOff } from 'react-icons/hi'

const CATEGORIES = [
  'App Development', 'AI/ML', 'AI Tools', 'Data Science',
  'Data Analytics', 'Ethical Hacking', 'UI UX Designing', 'Web Development', 'Others'
]
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

function AddCourses() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [title, setTitle] = useState("")
  const [subTitle, setSubTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [level, setLevel] = useState("")
  const [price, setPrice] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const thumb = useRef()
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const dispatch = useDispatch()
  const { courseData } = useSelector(state => state.course)

  const getCourseById = async () => {
    try {
      const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}`, { withCredentials: true })
      setSelectedCourse(result.data)
    } catch (error) {
      toast.error("Failed to load course")
    }
  }

  useEffect(() => {
    if (selectedCourse) {
      setTitle(selectedCourse.title || "")
      setSubTitle(selectedCourse.subTitle || "")
      setDescription(selectedCourse.description || "")
      setCategory(selectedCourse.category || "")
      setLevel(selectedCourse.level || "")
      setPrice(selectedCourse.price || "")
      setFrontendImage(selectedCourse.thumbnail || null)
      setIsPublished(selectedCourse?.isPublished)
    }
  }, [selectedCourse])

  useEffect(() => { getCourseById() }, [])

  const handleThumbnail = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const editCourseHandler = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append("title", title)
    formData.append("subTitle", subTitle)
    formData.append("description", description)
    formData.append("category", category)
    formData.append("level", level)
    formData.append("price", price)
    if (backendImage) formData.append("thumbnail", backendImage)
    formData.append("isPublished", isPublished)

    try {
      const result = await axios.post(`${serverUrl}/api/course/editcourse/${courseId}`, formData, { withCredentials: true })
      const updatedCourse = result.data
      if (updatedCourse.isPublished) {
        const updatedCourses = courseData.map(c => c._id === courseId ? updatedCourse : c)
        if (!courseData.some(c => c._id === courseId)) updatedCourses.push(updatedCourse)
        dispatch(setCourseData(updatedCourses))
      } else {
        dispatch(setCourseData(courseData.filter(c => c._id !== courseId)))
      }
      toast.success("Course updated!")
      navigate("/courses")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  const removeCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this course? This cannot be undone.")) return
    setDeleteLoading(true)
    try {
      await axios.delete(serverUrl + `/api/course/removecourse/${courseId}`, { withCredentials: true })
      dispatch(setCourseData(courseData.filter(c => c._id !== courseId)))
      toast.success("Course deleted")
      navigate("/courses")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate("/courses")} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm">
            <FaArrowLeftLong size={14} /> Back to Courses
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <HiBookOpen size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black">Edit Course</h1>
                <p className="text-white/50 text-sm mt-0.5 truncate max-w-xs">{title || "Untitled Course"}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/createlecture/${courseId}`)}
              className="bg-white text-black rounded-xl px-5 py-3 font-black text-sm hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              Manage Lectures →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Publish toggle + Delete */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-sm mb-0.5">Course Status</h3>
            <p className="text-xs text-gray-500">{isPublished ? "Your course is live and visible to students" : "Your course is in draft mode"}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPublished(p => !p)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${isPublished
                ? 'bg-green-50 border-green-500 text-green-700 hover:bg-red-50 hover:border-red-500 hover:text-red-700'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-500 hover:bg-green-50 hover:text-green-700'
                }`}
            >
              {isPublished ? <><HiEye size={16} /> Published</> : <><HiEyeOff size={16} /> Draft</>}
            </button>
            <button
              onClick={removeCourse}
              disabled={deleteLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all disabled:opacity-50"
            >
              {deleteLoading ? <ClipLoader size={14} color="currentColor" /> : <><HiTrash size={16} /> Delete</>}
            </button>
          </div>
        </div>

        {/* Main form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="font-black text-lg mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-black rounded-full" /> Course Details
          </h2>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-black text-black mb-3">Course Thumbnail</label>
              <div className="flex items-start gap-5">
                <div className="relative group cursor-pointer" onClick={() => thumb.current.click()}>
                  <img
                    src={frontendImage || img}
                    className="w-40 h-24 object-cover rounded-xl border-2 border-gray-200 group-hover:border-black transition-colors"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-xl transition-colors flex items-center justify-center">
                    <HiCamera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => thumb.current.click()}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-bold hover:border-black transition-colors"
                  >
                    <MdEdit size={16} /> Change Image
                  </button>
                  <p className="text-xs text-gray-400 mt-2">Recommended: 1280×720px, JPG or PNG</p>
                  <input type="file" ref={thumb} hidden accept="image/*" onChange={handleThumbnail} />
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-black text-black mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course title"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-black text-black mb-2">Subtitle</label>
              <input
                type="text"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                placeholder="A short, catchy subtitle"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-black text-black mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what students will learn..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white resize-none"
                rows={5}
              />
            </div>

            {/* Category, Level, Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-black text-black mb-2">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black bg-gray-50 focus:bg-white transition-colors font-medium"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2">Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black bg-gray-50 focus:bg-white transition-colors font-medium"
                >
                  <option value="">Select level</option>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white font-medium"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/courses")}
                className="flex-1 sm:flex-none sm:px-8 border-2 border-gray-200 text-gray-600 rounded-xl py-3.5 font-bold text-sm hover:border-black hover:text-black transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={editCourseHandler}
                disabled={loading}
                className="flex-1 bg-black text-white rounded-xl py-3.5 font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? <ClipLoader size={20} color="white" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddCourses