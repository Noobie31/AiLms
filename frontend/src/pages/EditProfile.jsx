import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6"
import { HiCamera, HiUser, HiMail, HiPencil } from 'react-icons/hi'

function EditProfile() {
  const { userData } = useSelector(state => state.user)
  const [name, setName] = useState(userData?.name || "")
  const [description, setDescription] = useState(userData?.description || "")
  const [photoUrl, setPhotoUrl] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(userData?.photoUrl || null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhotoUrl(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const updateProfile = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty")
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      if (photoUrl) formData.append("photoUrl", photoUrl)

      const result = await axios.post(serverUrl + "/api/user/updateprofile", formData, { withCredentials: true })
      dispatch(setUserData(result.data))
      toast.success("Profile updated!")
      navigate("/profile")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate("/profile")} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm">
            <FaArrowLeftLong size={14} /> Back to Profile
          </button>
          <h1 className="text-3xl font-black">Edit Profile</h1>
          <p className="text-white/50 text-sm mt-1">Update your personal information</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              {previewUrl ? (
                <img src={previewUrl} className="w-24 h-24 rounded-2xl object-cover border-4 border-gray-100" alt="" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-black flex items-center justify-center text-white text-3xl font-black border-4 border-gray-100">
                  {userData?.name?.slice(0, 1).toUpperCase()}
                </div>
              )}
              <label htmlFor="photoUpload" className="absolute -bottom-2 -right-2 w-9 h-9 bg-black rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors shadow-lg">
                <HiCamera size={16} className="text-white" />
              </label>
              <input id="photoUpload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>
            <p className="text-xs text-gray-400 mt-4 font-medium">Click the camera icon to change photo</p>
            {photoUrl && (
              <button onClick={() => { setPhotoUrl(null); setPreviewUrl(userData?.photoUrl || null); }} className="text-xs text-red-500 hover:text-red-700 mt-1 font-medium">
                Remove new photo
              </button>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); updateProfile() }} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-black text-black mb-2 flex items-center gap-2">
                <HiUser size={16} /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white font-medium"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-black text-black mb-2 flex items-center gap-2">
                <HiMail size={16} /> Email
              </label>
              <input
                type="email"
                value={userData?.email}
                readOnly
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed font-medium"
              />
              <p className="text-xs text-gray-400 mt-1.5">Email cannot be changed</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-black text-black mb-2 flex items-center gap-2">
                <HiPencil size={16} /> Bio
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell others about yourself..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-400 mt-1.5">{description.length}/300 characters</p>
            </div>

            {/* Role (read-only) */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${userData?.role === 'educator' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                {userData?.role === 'educator' ? '👨‍🏫' : '🎓'}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Account Type</p>
                <p className="text-sm font-black capitalize text-black">{userData?.role}</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">Cannot be changed</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 border-2 border-gray-200 text-gray-600 rounded-xl py-3.5 font-bold text-sm hover:border-black hover:text-black transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
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

export default EditProfile