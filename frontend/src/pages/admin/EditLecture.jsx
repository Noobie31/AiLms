import axios from 'axios'
import React, { useState } from 'react'
import { FaArrowLeft } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../App'
import { setLectureData } from '../../redux/lectureSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { HiTrash, HiUpload, HiLockOpen, HiFilm } from 'react-icons/hi'

function EditLecture() {
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { courseId, lectureId } = useParams()
  const { lectureData } = useSelector(state => state.lecture)
  const dispatch = useDispatch()
  const selectedLecture = lectureData.find(lecture => lecture._id === lectureId)
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(selectedLecture?.videoUrl || null)
  const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "")
  const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture?.isPreviewFree || false)
  const navigate = useNavigate()

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  const editLecture = async () => {
    if (!lectureTitle.trim()) return toast.error("Please enter a lecture title")
    setLoading(true)
    const formData = new FormData()
    formData.append("lectureTitle", lectureTitle)
    if (videoFile) formData.append("videoUrl", videoFile)
    formData.append("isPreviewFree", isPreviewFree)

    try {
      const result = await axios.post(serverUrl + `/api/course/editlecture/${lectureId}`, formData, { withCredentials: true })
      // BUG FIX: was duplicating lecture, now properly replacing it
      const updatedLectures = lectureData.map(l => l._id === lectureId ? result.data : l)
      dispatch(setLectureData(updatedLectures))
      toast.success("Lecture updated!")
      navigate(`/createlecture/${courseId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  const removeLecture = async () => {
    if (!window.confirm("Delete this lecture? This cannot be undone.")) return
    setDeleteLoading(true)
    try {
      await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`, { withCredentials: true })
      dispatch(setLectureData(lectureData.filter(l => l._id !== lectureId)))
      toast.success("Lecture removed")
      navigate(`/createlecture/${courseId}`)
    } catch (error) {
      toast.error("Failed to remove lecture")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate(`/createlecture/${courseId}`)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm">
            <FaArrowLeft size={14} /> Back to Lectures
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <HiFilm size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black">Edit Lecture</h1>
                <p className="text-white/50 text-sm mt-0.5 truncate max-w-xs">{selectedLecture?.lectureTitle}</p>
              </div>
            </div>
            <button
              onClick={removeLecture}
              disabled={deleteLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 text-red-300 text-sm font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
            >
              {deleteLoading ? <ClipLoader size={14} color="white" /> : <><HiTrash size={16} /> Delete</>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Title */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <label className="block text-sm font-black text-black mb-3">Lecture Title *</label>
          <input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Enter lecture title"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white font-medium"
          />
        </div>

        {/* Video Upload */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-black text-sm mb-4 flex items-center gap-2">
            <HiFilm size={16} /> Lecture Video
          </h2>

          {videoPreview && (
            <div className="mb-4 rounded-xl overflow-hidden border border-gray-200 bg-black">
              <video src={videoPreview} controls className="w-full max-h-64 object-contain" />
            </div>
          )}

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-black transition-colors group">
            <HiUpload size={28} className="text-gray-300 group-hover:text-black mb-3 transition-colors" />
            <p className="text-sm font-bold text-gray-500 group-hover:text-black transition-colors">
              {videoFile ? videoFile.name : "Click to upload video"}
            </p>
            <p className="text-xs text-gray-400 mt-1">MP4, MOV, AVI supported</p>
            <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
          </label>

          {loading && (
            <div className="mt-4 flex items-center gap-3 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <ClipLoader size={18} color="#3b82f6" />
              <div>
                <p className="text-sm font-bold text-blue-700">Uploading video...</p>
                <p className="text-xs text-blue-500">This may take a few minutes for large files</p>
              </div>
            </div>
          )}
        </div>

        {/* Free Preview Toggle */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPreviewFree ? 'bg-green-100' : 'bg-gray-100'}`}>
                <HiLockOpen size={20} className={isPreviewFree ? 'text-green-600' : 'text-gray-400'} />
              </div>
              <div>
                <h3 className="font-black text-sm text-black">Free Preview</h3>
                <p className="text-xs text-gray-400 mt-0.5">Let students preview this lecture before enrolling</p>
              </div>
            </div>
            <button
              onClick={() => setIsPreviewFree(p => !p)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isPreviewFree ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isPreviewFree ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/createlecture/${courseId}`)}
            className="flex-1 sm:flex-none sm:px-8 border-2 border-gray-200 text-gray-600 rounded-xl py-3.5 font-bold text-sm hover:border-black hover:text-black transition-all"
          >
            Cancel
          </button>
          <button
            onClick={editLecture}
            disabled={loading}
            className="flex-1 bg-black text-white rounded-xl py-3.5 font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Save Lecture"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditLecture