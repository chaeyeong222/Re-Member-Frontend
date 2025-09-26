"use client"
import { useState } from "react"
import type React from "react"

import { Heart, User, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
    })
    const router = useRouter()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleCompleteSignup = async () => {
        if (!formData.name.trim() || !formData.phone.trim()) {
            alert("이름과 연락처를 모두 입력해주세요.");
            return;
        }

        setIsLoading(true);

        try {
            const signupInfoString = sessionStorage.getItem("signupInfo");

            if (!signupInfoString) {
                alert("회원가입 정보를 찾을 수 없습니다. 다시 시도해주세요.");
                setIsLoading(false);
                return;
            }

            // JSON 문자열을 객체로 변환
            const signupInfo = JSON.parse(signupInfoString);

            const { socialId, nickname } = signupInfo;

            const payload = {
                name: formData.name,
                phone: formData.phone,
                socialId: socialId,
                nickname: nickname,
                email: "",
                id: "",
                token: "mock_token",
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup/customer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // const result = await response.text();
                const userKey = await response.text();
                console.log("회원가입 성공:", userKey);
                alert("회원가입이 완료되었습니다.");

                const userInfo = {
                    id: socialId, // socialId를 id로 사용
                    name: formData.name,
                    phone: formData.phone,
                    userKey : userKey,
                };

                // JSON.stringify()를 사용하여 객체를 문자열로 변환하여 저장
                localStorage.setItem("user_info", JSON.stringify(userInfo));

                // 페이지 이동
                router.push("/store");

            } else {
                const errorData = await response.text();
                console.error("회원가입 실패:", errorData);
                alert("회원가입에 실패했습니다. 다시 시도해주세요. (" + response.status + ")");
            }

        } catch (error) {
            console.error("회원가입 실패:", error);
            alert("네트워크 오류 또는 데이터 처리 오류로 회원가입에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

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
                    <p className="text-gray-600">추가 정보를 입력해주세요</p>
                </div>

                {/* Signup Form */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
                    <div className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                이름
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="이름을 입력해주세요"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone Input */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                연락처
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="010-0000-0000"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complete Signup Button */}
                <button
                    onClick={handleCompleteSignup}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-rose-300 disabled:to-pink-300 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            처리 중...
                        </>
                    ) : (
                        "로그인 완료하기"
                    )}
                </button>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">입력하신 정보는 안전하게 보호됩니다.</p>
                </div>
            </div>
        </div>
    )
}
