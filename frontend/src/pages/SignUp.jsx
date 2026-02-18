import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md"
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../utils/Firebase'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function SignUp() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("student")
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSignUp = async () => {
        if (!name || !email || !password) return toast.error("Please fill all fields")
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/auth/signup", { name, email, password, role }, { withCredentials: true })
            dispatch(setUserData(result.data))
            navigate("/")
            toast.success("Account created successfully!")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Signup failed")
        } finally {
            setLoading(false)
        }
    }

    const googleSignUp = async () => {
        try {
            const response = await signInWithPopup(auth, provider)
            const { displayName: name, email } = response.user
            const result = await axios.post(serverUrl + "/api/auth/googlesignup", { name, email, role }, { withCredentials: true })
            dispatch(setUserData(result.data))
            navigate("/")
            toast.success("Account created!")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Google signup failed")
        }
    }

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-black flex-col justify-between p-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }} />

                <div className="relative z-10 flex items-center gap-3">
                    <img src={logo} className="w-10 h-10 rounded-md border border-white/20" alt="" />
                    <span className="text-white font-bold text-xl tracking-wider">VIRTUAL COURSES</span>
                </div>

                <div className="relative z-10 space-y-6">
                    <h2 className="text-5xl font-black text-white leading-tight">
                        Start your<br />learning<br />journey<br />today.
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed">
                        Join thousands of learners mastering new skills every day.
                    </p>
                    <div className="space-y-4">
                        {[
                            "Access 200+ expert-led courses",
                            "Learn at your own pace",
                            "Get certified & boost your career",
                            "Join a community of 10k+ learners"
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-white/80 text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 flex gap-10">
                    {[["10k+", "Students"], ["200+", "Courses"], ["4.9★", "Rating"]].map(([num, label]) => (
                        <div key={label}>
                            <div className="text-white text-2xl font-bold">{num}</div>
                            <div className="text-white/50 text-xs">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <img src={logo} className="w-8 h-8 rounded-md" alt="" />
                        <span className="font-bold text-lg tracking-wider">VIRTUAL COURSES</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-black tracking-tight mb-2">Create account</h1>
                        <p className="text-gray-500">Join us and start learning today</p>
                    </div>

                    {/* Role selector */}
                    <div className="flex gap-3 mb-6">
                        {["student", "educator"].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all duration-200 capitalize ${role === r
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                                    }`}
                            >
                                {r === "student" ? "🎓 Student" : "👨‍🏫 Educator"}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={googleSignUp}
                        className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3.5 mb-5 hover:border-black hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700"
                    >
                        <img src={google} alt="" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-4 mb-5">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-gray-400 text-sm font-medium">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleSignUp() }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={show ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50 focus:bg-white pr-12"
                                />
                                <button type="button" onClick={() => setShow(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                                    {show ? <MdRemoveRedEye size={20} /> : <MdOutlineRemoveRedEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white rounded-xl py-3.5 font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center mt-2"
                        >
                            {loading ? <ClipLoader size={20} color="white" /> : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-5">
                        Already have an account?{" "}
                        <button onClick={() => navigate("/login")} className="text-black font-bold hover:underline">
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp