"use client"
import { useState, useEffect } from "react"
import { Heart, Users, Shield, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function KakaoLoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("kakao_token")
        const storeKey = localStorage.getItem("store_key")
        if (token && storeKey) {
            router.push("/dashboard")
        }
    }, [router])

    const handleKakaoLogin = async () => {
        setIsLoading(true)

        try {
            const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`

            window.location.href = kakaoAuthUrl
        } catch (error) {
            console.error("Login failed:", error)
            alert("로그인에 실패했습니다. 다시 시도해주세요.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Re:Member
                    </h1>
                    <p className="text-gray-600">소중한 고객을 기억하는 스마트한 방법</p>
                </div>

                {/* Features */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                                <Users className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">고객 관리</h3>
                                <p className="text-sm text-gray-600">고객 정보를 체계적으로 관리하세요</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">간편 로그인</h3>
                                <p className="text-sm text-gray-600">이름과 연락처로 간편하게 로그인</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">스마트 관리</h3>
                                <p className="text-sm text-gray-600">예약부터 내역관리까지 한번에</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kakao Login Button */}
                <button
                    onClick={handleKakaoLogin}
                    disabled={isLoading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-yellow-900 font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-900"></div>
                            로그인 중...
                        </>
                    ) : (
                        <>
                            <div className="w-6 h-6 bg-yellow-900 rounded-md flex items-center justify-center">
                                <span className="text-yellow-400 text-xs font-bold">K</span>
                            </div>
                            카카오로 시작하기
                        </>
                    )}
                </button>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        로그인하면 <span className="text-rose-600 font-medium">이용약관</span> 및{" "}
                        <span className="text-rose-600 font-medium">개인정보처리방침</span>에 동의하게 됩니다.
                    </p>
                </div>
            </div>
        </div>
    )
}
