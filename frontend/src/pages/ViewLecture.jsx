import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle, FaCheckCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";
import { HiChevronLeft, HiChevronRight, HiBookOpen, HiPencil, HiX } from 'react-icons/hi';

function ViewLecture() {
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);
  const selectedCourse = courseData?.find((course) => course._id === courseId);
  const lectures = selectedCourse?.lectures || [];

  const [selectedLecture, setSelectedLecture] = useState(lectures[0] || null);
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const navigate = useNavigate();

  const currentIndex = lectures.findIndex(l => l._id === selectedLecture?._id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < lectures.length - 1;

  const markComplete = () => {
    if (selectedLecture) {
      setCompletedLectures(prev => {
        const next = new Set(prev);
        if (next.has(selectedLecture._id)) next.delete(selectedLecture._id);
        else next.add(selectedLecture._id);
        return next;
      });
    }
  };

  const goNext = () => { if (hasNext) setSelectedLecture(lectures[currentIndex + 1]); };
  const goPrev = () => { if (hasPrev) setSelectedLecture(lectures[currentIndex - 1]); };

  const progress = lectures.length > 0 ? Math.round((completedLectures.size / lectures.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-black text-white px-6 py-4 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-4 min-w-0">
          <button onClick={() => navigate("/")} className="text-white/60 hover:text-white transition-colors flex-shrink-0">
            <FaArrowLeftLong size={16} />
          </button>
          <div className="min-w-0">
            <p className="text-white/50 text-xs font-medium truncate">{selectedCourse?.category}</p>
            <h1 className="font-black text-sm truncate">{selectedCourse?.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-white/70 text-xs font-bold">{progress}%</span>
          </div>

          {/* Notes toggle */}
          <button
            onClick={() => setShowNotes(p => !p)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-colors ${showNotes ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <HiPencil size={14} /> Notes
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video + Controls */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${showNotes ? 'mr-0' : ''}`}>
          {/* Video */}
          <div className="bg-black flex-shrink-0">
            <div className="max-w-5xl mx-auto">
              <div className="aspect-video">
                {selectedLecture?.videoUrl ? (
                  <video
                    key={selectedLecture._id}
                    src={selectedLecture.videoUrl}
                    controls
                    className="w-full h-full"
                    onEnded={markComplete}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40">
                    <div className="text-center">
                      <FaPlayCircle size={48} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Select a lecture to start</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lecture info & controls */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-6 py-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-400 font-semibold mb-1">
                    Lecture {currentIndex + 1} of {lectures.length}
                  </p>
                  <h2 className="text-xl font-black text-black">{selectedLecture?.lectureTitle}</h2>
                </div>

                <button
                  onClick={markComplete}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all flex-shrink-0 ${completedLectures.has(selectedLecture?._id)
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'
                    }`}
                >
                  <FaCheckCircle size={16} />
                  {completedLectures.has(selectedLecture?._id) ? 'Completed' : 'Mark Complete'}
                </button>
              </div>

              {/* Prev / Next */}
              <div className="flex gap-3">
                <button
                  onClick={goPrev}
                  disabled={!hasPrev}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:border-black hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <HiChevronLeft size={18} /> Previous
                </button>
                <button
                  onClick={goNext}
                  disabled={!hasNext}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next <HiChevronRight size={18} />
                </button>
              </div>

              {/* Course info */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { label: "Category", value: selectedCourse?.category },
                  { label: "Level", value: selectedCourse?.level },
                  { label: "Total Lectures", value: lectures.length },
                ].map(item => (
                  <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                    <p className="text-xs text-gray-400 font-medium mb-1">{item.label}</p>
                    <p className="font-black text-sm text-black">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notes Panel */}
        {showNotes && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="font-black text-sm flex items-center gap-2">
                <HiPencil size={16} /> My Notes
              </h3>
              <button onClick={() => setShowNotes(false)} className="text-gray-400 hover:text-black transition-colors">
                <HiX size={18} />
              </button>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`Take notes for "${selectedLecture?.lectureTitle}"...`}
              className="flex-1 p-5 text-sm resize-none focus:outline-none text-gray-700 leading-relaxed"
            />
            <div className="px-5 py-3 border-t border-gray-200">
              <p className="text-xs text-gray-400">{notes.length} characters</p>
            </div>
          </div>
        )}

        {/* Sidebar - Lecture List */}
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 hidden lg:flex">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="font-black text-sm flex items-center gap-2">
              <HiBookOpen size={16} /> Course Content
            </h3>
            <p className="text-xs text-gray-400 mt-1">{completedLectures.size}/{lectures.length} completed</p>
            {/* Mini progress */}
            <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {lectures.map((lecture, index) => (
              <button
                key={lecture._id || index}
                onClick={() => setSelectedLecture(lecture)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 ${selectedLecture?._id === lecture._id ? 'bg-gray-50 border-r-2 border-black' : ''}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black transition-colors ${completedLectures.has(lecture._id)
                  ? 'bg-green-500 text-white'
                  : selectedLecture?._id === lecture._id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-500'
                  }`}>
                  {completedLectures.has(lecture._id) ? '✓' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-tight truncate ${selectedLecture?._id === lecture._id ? 'text-black' : 'text-gray-600'}`}>
                    {lecture.lectureTitle}
                  </p>
                </div>
                {selectedLecture?._id === lecture._id && (
                  <FaPlayCircle size={12} className="text-black flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewLecture;