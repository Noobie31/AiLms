import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaArrowLeftLong } from "react-icons/fa6"
import img from "../assets/empty.jpg"
import Card from "../components/Card.jsx"
import { setSelectedCourseData } from '../redux/courseSlice';
import { FaLock, FaPlayCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { FaStar, FaRegStar } from "react-icons/fa6";
import { HiUsers, HiBookOpen } from 'react-icons/hi';
import { ClipLoader } from 'react-spinners';

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate()
  const { courseData } = useSelector(state => state.course)
  const { userData } = useSelector(state => state.user)
  const [creatorData, setCreatorData] = useState(null)
  const dispatch = useDispatch()
  const [selectedLecture, setSelectedLecture] = useState(null);
  const { selectedCourseData } = useSelector(state => state.course)
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([])
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // FIX: dedicated state for fully-populated lecture objects
  const [lectures, setLectures] = useState([]);
  const [lecturesLoading, setLecturesLoading] = useState(true);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };
  const avgRating = calculateAverageRating(selectedCourseData?.reviews);

  // FIX: always fetch lectures fresh from API — never rely on Redux course.lectures
  // because those may be just ObjectId strings (not populated objects)
  const fetchLectures = async () => {
    setLecturesLoading(true);
    try {
      const result = await axios.get(
        `${serverUrl}/api/course/getcourselecture/${courseId}`,
        { withCredentials: true }
      );
      let fetched = [];
      if (Array.isArray(result.data)) fetched = result.data;
      else if (Array.isArray(result.data.lectures)) fetched = result.data.lectures;
      else if (Array.isArray(result.data.data)) fetched = result.data.data;
      setLectures(fetched);
    } catch (error) {
      // graceful fallback to any populated lectures already in Redux
      const course = courseData.find(c => c._id === courseId);
      const fallback = (course?.lectures || []).filter(l => typeof l === 'object' && l.lectureTitle);
      setLectures(fallback);
    } finally {
      setLecturesLoading(false);
    }
  };

  const fetchCourseData = () => {
    const course = courseData.find(item => item._id === courseId)
    if (course) dispatch(setSelectedCourseData(course))
  }

  const checkEnrollment = () => {
    const verify = userData?.enrolledCourses?.some(c => {
      const enrolledId = typeof c === 'string' ? c : c._id;
      return enrolledId?.toString() === courseId?.toString();
    });
    if (verify) setIsEnrolled(true);
  };

  // FIX: fetch lectures immediately on mount, not waiting for Redux chains
  useEffect(() => {
    fetchCourseData();
    checkEnrollment();
    fetchLectures();
  }, [courseId]);

  useEffect(() => {
    fetchCourseData();
    checkEnrollment();
  }, [courseData]);

  useEffect(() => {
    const getCreator = async () => {
      if (selectedCourseData?.creator) {
        try {
          const result = await axios.post(`${serverUrl}/api/course/getcreator`, { userId: selectedCourseData.creator }, { withCredentials: true });
          setCreatorData(result.data);
        } catch (error) { console.error(error) }
      }
    };
    getCreator();
  }, [selectedCourseData]);

  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const courses = courseData.filter(c => c.creator === creatorData._id && c._id !== courseId);
      setSelectedCreatorCourse(courses);
    }
  }, [creatorData, courseData]);

  const handleEnroll = async () => {
    setEnrollLoading(true)
    try {
      const orderData = await axios.post(serverUrl + "/api/payment/create-order", { courseId, userId: userData._id }, { withCredentials: true });
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: "INR",
        name: "Virtual Courses",
        description: selectedCourseData?.title,
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(serverUrl + "/api/payment/verify-payment", { ...response, courseId, userId: userData._id }, { withCredentials: true });
            setIsEnrolled(true)
            toast.success(verifyRes.data.message);
          } catch (e) { toast.error("Payment verification failed.") }
        },
        modal: { ondismiss: () => setEnrollLoading(false) }
      };
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error("Something went wrong");
      setEnrollLoading(false)
    }
  };

  const handleReview = async () => {
    if (!rating) return toast.error("Please select a rating")
    if (!comment.trim()) return toast.error("Please write a comment")
    try {
      await axios.post(serverUrl + "/api/review/givereview", { rating, comment, courseId }, { withCredentials: true })
      toast.success("Review added!")
      setRating(0); setComment("")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add review")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm">
            <FaArrowLeftLong size={14} /> Back
          </button>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <span className="inline-block text-xs font-black bg-white/10 px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">{selectedCourseData?.category}</span>
              <h1 className="text-3xl lg:text-4xl font-black leading-tight mb-3">{selectedCourseData?.title}</h1>
              <p className="text-white/70 text-base leading-relaxed mb-6">{selectedCourseData?.subTitle}</p>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" size={16} />
                  <span className="font-black text-sm">{avgRating}</span>
                  <span className="text-white/50 text-xs">({selectedCourseData?.reviews?.length || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/60 text-sm">
                  <HiUsers size={16} /><span>{selectedCourseData?.enrolledStudents?.length || 0} students</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/60 text-sm">
                  <HiBookOpen size={16} /><span>{lectures.length || selectedCourseData?.lectures?.length || 0} lectures</span>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${selectedCourseData?.level === 'Beginner' ? 'bg-green-500/20 text-green-300' : selectedCourseData?.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                  {selectedCourseData?.level}
                </span>
              </div>
              {creatorData && (
                <div className="flex items-center gap-3">
                  <img src={creatorData.photoUrl || img} className="w-8 h-8 rounded-full object-cover border border-white/20" alt="" />
                  <span className="text-sm text-white/70">by <span className="text-white font-semibold">{creatorData.name}</span></span>
                </div>
              )}
            </div>

            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <img src={selectedCourseData?.thumbnail || img} className="w-full h-44 object-cover rounded-xl mb-5" alt="" />
                <div className="mb-5">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-black text-black">₹{selectedCourseData?.price}</span>
                    <span className="line-through text-gray-400 text-sm">₹{Math.round((selectedCourseData?.price || 0) * 1.5)}</span>
                    <span className="bg-green-100 text-green-700 text-xs font-black px-2 py-0.5 rounded-full">33% OFF</span>
                  </div>
                </div>
                {!isEnrolled ? (
                  <button onClick={handleEnroll} disabled={enrollLoading} className="w-full bg-black text-white rounded-xl py-4 font-black text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center">
                    {enrollLoading ? <ClipLoader size={20} color="white" /> : "Enroll Now"}
                  </button>
                ) : (
                  <button onClick={() => navigate(`/viewlecture/${courseId}`)} className="w-full bg-green-500 text-white rounded-xl py-4 font-black text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                    <FaPlayCircle size={18} /> Continue Learning
                  </button>
                )}
                <ul className="mt-5 space-y-2.5">
                  {["Full lifetime access", `${lectures.length || 0} lectures`, "Certificate of completion", "Mobile & desktop access"].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-xs text-gray-600">
                      <svg className="w-4 h-4 text-black flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="space-y-6">

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-black text-lg mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-black rounded-full" /> About this course</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{selectedCourseData?.description}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-black text-lg mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-black rounded-full" /> What you'll learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[`Master ${selectedCourseData?.category} from scratch`, "Build real-world projects", "Industry best practices", "Certificate on completion"].map(item => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-black flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* CURRICULUM — uses directly-fetched lectures, always populated */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-black text-lg mb-2 flex items-center gap-2"><span className="w-1 h-5 bg-black rounded-full" /> Course Curriculum</h2>
            <p className="text-sm text-gray-400 mb-5">{lectures.length} lectures</p>

            {lecturesLoading ? (
              <div className="flex items-center justify-center py-8 gap-3">
                <ClipLoader size={20} color="black" />
                <span className="text-sm text-gray-400">Loading lectures...</span>
              </div>
            ) : lectures.length === 0 ? (
              <div className="text-center py-8 text-gray-300 text-sm">No lectures added yet</div>
            ) : (
              <div className="space-y-2">
                {lectures.map((lecture, index) => (
                  <button
                    key={lecture._id || index}
                    disabled={!lecture.isPreviewFree}
                    onClick={() => lecture.isPreviewFree && setSelectedLecture(lecture)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all text-left ${lecture.isPreviewFree
                        ? "hover:bg-gray-50 border-gray-200 cursor-pointer hover:border-gray-300"
                        : "cursor-not-allowed border-gray-100 opacity-60"
                      } ${selectedLecture?._id === lecture._id ? "bg-gray-50 border-gray-400" : ""}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500 flex-shrink-0">{index + 1}</span>
                    <span className="text-gray-400 flex-shrink-0">
                      {lecture.isPreviewFree ? <FaPlayCircle size={16} className="text-black" /> : <FaLock size={14} />}
                    </span>
                    <span className="text-sm font-medium text-gray-800 flex-1">{lecture.lectureTitle}</span>
                    {lecture.isPreviewFree && (
                      <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0">FREE</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedLecture && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-black text-lg mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-black rounded-full" /> Preview: {selectedLecture.lectureTitle}</h2>
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <video src={selectedLecture.videoUrl} controls className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-black text-lg mb-5 flex items-center gap-2"><span className="w-1 h-5 bg-black rounded-full" /> Write a Review</h2>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="transition-transform hover:scale-110">
                  {star <= (hoverRating || rating) ? <FaStar className="text-yellow-400 w-7 h-7" /> : <FaRegStar className="text-gray-300 w-7 h-7" />}
                </button>
              ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." className="w-full border-2 border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white" rows="4" />
            <button onClick={handleReview} className="mt-3 bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors">Submit Review</button>
          </div>

          {creatorData && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-black text-lg mb-5 flex items-center gap-2"><span className="w-1 h-5 bg-black rounded-full" /> Your Instructor</h2>
              <div className="flex items-start gap-5">
                <img src={creatorData.photoUrl || img} className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-200 flex-shrink-0" alt="" />
                <div>
                  <h3 className="font-black text-base">{creatorData.name}</h3>
                  <p className="text-xs text-gray-400 mb-2">{creatorData.email}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{creatorData.description || "Experienced educator passionate about teaching."}</p>
                </div>
              </div>
            </div>
          )}

          {selectedCreatorCourse?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-black text-lg mb-5 flex items-center gap-2"><span className="w-1 h-5 bg-black rounded-full" /> More by {creatorData?.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedCreatorCourse.map((item, index) => (
                  <Card key={index} thumbnail={item.thumbnail} title={item.title} id={item._id} price={item.price} category={item.category} reviews={item.reviews} level={item.level} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ViewCourse