import React, { useState, useEffect } from 'react'
import logo from "../assets/logo.jpg"
import { IoMdPerson } from "react-icons/io"
import { GiHamburgerMenu } from "react-icons/gi"
import { GiSplitCross } from "react-icons/gi"
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { HiAcademicCap, HiUser, HiLogout, HiViewGrid } from 'react-icons/hi'

function Nav() {
  const [showHam, setShowHam] = useState(false)
  const [showPro, setShowPro] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)

  // Change navbar bg on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('#profile-dropdown') && !e.target.closest('#profile-btn')) {
        setShowPro(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      dispatch(setUserData(null))
      toast.success("Logged out successfully")
      navigate("/login")
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  return (
    <>
      {/* ── DESKTOP NAVBAR ── */}
      <div className={`w-full h-[70px] fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-10 transition-all duration-300 ${scrolled ? 'bg-black shadow-lg' : 'bg-black'}`}>

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer flex-shrink-0"
          onClick={() => navigate("/")}
        >
          <img src={logo} className="w-9 h-9 rounded-lg border border-white/20 object-cover" alt="logo" />
          <span className="text-white font-black text-base tracking-wider hidden sm:block">VIRTUAL COURSES</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-2">
          <button onClick={() => navigate("/allcourses")} className="text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
            Courses
          </button>
          {userData && (
            <button onClick={() => navigate("/enrolledcourses")} className="text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
              My Learning
            </button>
          )}
          {userData?.role === "educator" && (
            <button onClick={() => navigate("/dashboard")} className="text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
              Dashboard
            </button>
          )}
        </div>

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center gap-3">
          {!userData ? (
            <>
              <button onClick={() => navigate("/login")} className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
                Login
              </button>
              <button onClick={() => navigate("/signup")} className="bg-white text-black text-sm font-black px-5 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                Sign Up
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                id="profile-btn"
                onClick={() => setShowPro(p => !p)}
                className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 transition-all"
              >
                {userData.photoUrl
                  ? <img src={userData.photoUrl} className="w-7 h-7 rounded-lg object-cover border border-white/20" alt="" />
                  : <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white font-black text-sm">
                    {userData?.name?.slice(0, 1).toUpperCase()}
                  </div>
                }
                <span className="text-white text-sm font-semibold max-w-[100px] truncate">{userData.name}</span>
                <svg className={`w-4 h-4 text-white/50 transition-transform duration-200 ${showPro ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {showPro && (
                <div id="profile-dropdown" className="absolute right-0 top-[calc(100%+8px)] w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-100 mb-1">
                    <p className="font-black text-sm text-black truncate">{userData.name}</p>
                    <p className="text-xs text-gray-400 truncate">{userData.email}</p>
                  </div>

                  <button onClick={() => { navigate("/profile"); setShowPro(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors font-medium">
                    <HiUser size={16} className="text-gray-400" /> My Profile
                  </button>
                  <button onClick={() => { navigate("/enrolledcourses"); setShowPro(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors font-medium">
                    <HiAcademicCap size={16} className="text-gray-400" /> My Courses
                  </button>
                  {userData?.role === "educator" && (
                    <button onClick={() => { navigate("/dashboard"); setShowPro(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors font-medium">
                      <HiViewGrid size={16} className="text-gray-400" /> Dashboard
                    </button>
                  )}

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">
                      <HiLogout size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden text-white p-1" onClick={() => setShowHam(p => !p)}>
          <GiHamburgerMenu size={24} />
        </button>
      </div>

      {/* ── MOBILE MENU ── */}
      <div className={`fixed inset-0 bg-black z-50 flex flex-col transition-transform duration-300 ${showHam ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Mobile header */}
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={logo} className="w-8 h-8 rounded-lg border border-white/20" alt="" />
            <span className="text-white font-black tracking-wider">VIRTUAL COURSES</span>
          </div>
          <button onClick={() => setShowHam(false)} className="text-white/60 hover:text-white">
            <GiSplitCross size={24} />
          </button>
        </div>

        {/* Mobile user info */}
        {userData && (
          <div className="px-6 py-5 border-b border-white/10 flex items-center gap-4">
            {userData.photoUrl
              ? <img src={userData.photoUrl} className="w-12 h-12 rounded-xl object-cover border-2 border-white/20" alt="" />
              : <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white font-black text-lg">
                {userData?.name?.slice(0, 1).toUpperCase()}
              </div>
            }
            <div>
              <p className="text-white font-black">{userData.name}</p>
              <p className="text-white/50 text-xs capitalize">{userData.role}</p>
            </div>
          </div>
        )}

        {/* Mobile links */}
        <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {[
            { label: "Home", path: "/" },
            { label: "All Courses", path: "/allcourses" },
            ...(userData ? [{ label: "My Courses", path: "/enrolledcourses" }] : []),
            ...(userData ? [{ label: "My Profile", path: "/profile" }] : []),
            ...(userData?.role === "educator" ? [{ label: "Dashboard", path: "/dashboard" }] : []),
            ...(userData?.role === "educator" ? [{ label: "Manage Courses", path: "/courses" }] : []),
          ].map(item => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setShowHam(false) }}
              className="w-full text-left px-4 py-3.5 text-white text-base font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile bottom */}
        <div className="px-4 py-6 border-t border-white/10 space-y-3">
          {!userData ? (
            <>
              <button onClick={() => { navigate("/login"); setShowHam(false) }} className="w-full border-2 border-white/20 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors">
                Login
              </button>
              <button onClick={() => { navigate("/signup"); setShowHam(false) }} className="w-full bg-white text-black py-3.5 rounded-xl font-black text-sm hover:bg-gray-100 transition-colors">
                Sign Up Free
              </button>
            </>
          ) : (
            <button onClick={() => { handleLogout(); setShowHam(false) }} className="w-full bg-red-500/20 text-red-400 border border-red-500/30 py-3.5 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
              <HiLogout size={18} /> Logout
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default Nav