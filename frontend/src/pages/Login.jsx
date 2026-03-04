import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md"
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../utils/Firebase'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogin = async () => {
        if (!email || !password) return toast.error("Please fill all fields")
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/auth/login", { email, password }, { withCredentials: true })
            dispatch(setUserData(result.data))
            navigate("/")
            toast.success("Welcome back!")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    const googleLogin = async () => {
        try {
            const response = await signInWithPopup(auth, provider)
            const { displayName: name, email } = response.user
            const result = await axios.post(serverUrl + "/api/auth/googlesignup", { name, email, role: "" }, { withCredentials: true })
            dispatch(setUserData(result.data))
            navigate("/")
            toast.success("Welcome!")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Google login failed")
        }
    }

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-black flex-col justify-between p-16 relative overflow-hidden">
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }} />

                {/* Top */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <img src={logo} className="w-10 h-10 rounded-md border border-white/20" alt="" />
                        <span className="text-white font-bold text-xl tracking-wider">VIRTUAL COURSES</span>
                    </div>
                </div>

                {/* Center quote */}
                <div className="relative z-10">
                    <div className="text-6xl text-white/20 font-serif leading-none mb-4">"</div>
                    <p className="text-white text-2xl font-light leading-relaxed mb-6">
                        Knowledge is the only asset that grows when you share it.
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">AJ</div>
                        <div>
                            <p className="text-white font-medium text-sm">Alex Johnson</p>
                            <p className="text-white/50 text-xs">Senior Educator, 10k+ students</p>
                        </div>
                    </div>
                </div>

                {/* Bottom stats */}
                <div className="relative z-10 flex gap-10">
                    {[["10k+", "Students"], ["200+", "Courses"], ["4.9", "Rating"]].map(([num, label]) => (
                        <div key={label}>
                            <div className="text-white text-3xl font-bold">{num}</div>
                            <div className="text-white/50 text-sm">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <img src={logo} className="w-8 h-8 rounded-md" alt="" />
                        <span className="font-bold text-lg tracking-wider">VIRTUAL COURSES</span>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-black tracking-tight mb-2">Welcome back</h1>
                        <p className="text-gray-500 text-base">Sign in to continue your learning journey</p>
                    </div>

                    {/* Google button */}
                    <button
                        onClick={googleLogin}
                        className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3.5 mb-6 hover:border-black hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 group"
                    >
                        <img src={google} alt="" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-gray-400 text-sm font-medium">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleLogin() }} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-black mb-2">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors duration-200 bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-black">Password</label>
                                <button type="button" onClick={() => navigate("/forgotpassword")} className="text-sm text-gray-500 hover:text-black transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={show ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition-colors duration-200 bg-gray-50 focus:bg-white pr-12"
                                />
                                <button type="button" onClick={() => setShow(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                                    {show ? <MdRemoveRedEye size={20} /> : <MdOutlineRemoveRedEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white rounded-xl py-3.5 font-bold text-sm hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? <ClipLoader size={20} color="white" /> : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{" "}
                        <button onClick={() => navigate("/signup")} className="text-black font-bold hover:underline">
                            Sign up free
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login