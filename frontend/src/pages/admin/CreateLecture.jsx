import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';
import { HiPlus, HiBookOpen, HiLockClosed, HiLockOpen } from 'react-icons/hi';
import { FaArrowLeftLong } from 'react-icons/fa6';

function CreateLecture() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [lectureTitle, setLectureTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const dispatch = useDispatch()
  const rawLectureData = useSelector(state => state.lecture.lectureData)
  const lectureData = Array.isArray(rawLectureData) ? rawLectureData : []

  const createLectureHandler = async () => {
    if (!lectureTitle.trim()) { toast.error("Please enter a lecture title"); return }
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true }
      )
      console.log("Create lecture response:", result.data)

      // Handle all possible response shapes from backend
      let newLecture = null
      if (result.data?.lecture) {
        newLecture = result.data.lecture
      } else if (result.data?._id) {
        newLecture = result.data
      } else if (Array.isArray(result.data)) {
        dispatch(setLectureData(result.data))
        toast.success("Lecture created!"); setLectureTitle(""); setLoading(false); return
      } else if (result.data?.lectures) {
        dispatch(setLectureData(result.data.lectures))
        toast.success("Lecture created!"); setLectureTitle(""); setLoading(false); return
      }

      if (newLecture) {
        dispatch(setLectureData([...lectureData, newLecture]))
      } else {
        console.warn("Unknown response shape — re-fetching:", result.data)
        await fetchLectures()
      }
      toast.success("Lecture created!")
      setLectureTitle("")
    } catch (error) {
      console.error("Create lecture error:", error.response || error)
      toast.error(error?.response?.data?.message || "Failed to create lecture")
    } finally {
      setLoading(false)
    }
  }

  const fetchLectures = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/course/getcourselecture/${courseId}`,
        { withCredentials: true }
      )
      console.log("Fetched lectures response:", result.data)
      let lectures = []
      if (Array.isArray(result.data)) lectures = result.data
      else if (Array.isArray(result.data.lectures)) lectures = result.data.lectures
      else if (Array.isArray(result.data.data)) lectures = result.data.data
      dispatch(setLectureData(lectures))
    } catch (error) {
      console.error("Fetch lectures error:", error.response || error)
      toast.error("Failed to load lectures")
      dispatch(setLectureData([]))
    }
  }

  useEffect(() => {
    const load = async () => { setPageLoading(true); await fetchLectures(); setPageLoading(false) }
    load()
  }, [courseId])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate(`/addcourses/${courseId}`)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm">
            <FaArrowLeftLong size={14} /> Back to Course Details
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <HiBookOpen size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Manage Lectures</h1>
              <p className="text-white/50 text-sm mt-1">{lectureData.length} lecture{lectureData.length !== 1 ? 's' : ''} added</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-black text-base mb-4 flex items-center gap-2"><HiPlus size={18} /> Add New Lecture</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="e.g. Introduction to JavaScript"
              onKeyDown={(e) => { if (e.key === 'Enter') createLectureHandler() }}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white font-medium"
            />
            <button onClick={createLectureHandler} disabled={loading} className="bg-black text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 flex-shrink-0">
              {loading ? <ClipLoader size={16} color="white" /> : <><HiPlus size={16} /> Add</>}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Press Enter or click Add to create a lecture</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-black text-base mb-5 flex items-center gap-2"><HiBookOpen size={18} /> Course Lectures</h2>
          {pageLoading ? (
            <div className="flex items-center justify-center py-12"><ClipLoader size={30} color="black" /></div>
          ) : lectureData.length === 0 ? (
            <div className="text-center py-12">
              <HiBookOpen size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="text-gray-400 text-sm font-medium">No lectures yet</p>
              <p className="text-gray-300 text-xs mt-1">Add your first lecture above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lectureData.map((lecture, index) => (
                <div key={lecture._id || index} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-black text-gray-500 flex-shrink-0">{index + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-black truncate">{lecture.lectureTitle}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {lecture.isPreviewFree
                        ? <span className="flex items-center gap-1 text-xs text-green-600 font-semibold"><HiLockOpen size={11} /> Free Preview</span>
                        : <span className="flex items-center gap-1 text-xs text-gray-400 font-semibold"><HiLockClosed size={11} /> Locked</span>
                      }
                      {lecture.videoUrl && <span className="text-xs text-blue-500 font-semibold">• Video added</span>}
                    </div>
                  </div>
                  <button onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-all flex-shrink-0">
                    <FaEdit size={12} /> Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
          <h3 className="font-black text-sm mb-3">💡 Tips</h3>
          <ul className="space-y-1.5 text-xs text-gray-500">
            <li>• Click <strong>Edit</strong> on any lecture to upload a video and set it as free preview</li>
            <li>• Free preview lectures help students decide before enrolling</li>
            <li>• Aim for 5–15 minutes per lecture for best engagement</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CreateLecture