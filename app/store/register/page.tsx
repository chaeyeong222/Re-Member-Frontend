"use client"

import type React from "react"
import { useState, useEffect } from "react" // useEffect 추가
import { Heart, Store, MapPin, Mail, FileText, User, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

interface StoreSignDto {
    storeName: string
    address: string
    email: string
    introduction: string
    socialId: string
}

export default function StoreRegister() {
    const [formData, setFormData] = useState<Omit<StoreSignDto, "socialId">>({
        storeName: "",
        address: "",
        email: "",
        introduction: "",
    })

    const [socialId, setSocialId] = useState<string | null>(null) // socialId 상태 추가
    const [errors, setErrors] = useState<Partial<Omit<StoreSignDto, "socialId">>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    // 컴포넌트 마운트 시 sessionStorage에서 socialId 가져오기
    useEffect(() => {
        const storedSocialId = sessionStorage.getItem("socialId") // 'socialId'라는 키로 저장된 값을 가져옴
        if (storedSocialId) {
            setSocialId(storedSocialId)
        } else {
            // socialId가 없는 경우, 사용자에게 안내 또는 로그인 페이지로 리디렉션
            setSubmitError("로그인 정보가 없습니다. 다시 로그인해주세요.")
        }
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        if (errors[name as keyof Omit<StoreSignDto, "socialId">]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<Omit<StoreSignDto, "socialId">> = {}

        if (!formData.storeName.trim()) {
            newErrors.storeName = "가게명을 입력해주세요"
        }
        if (!formData.address.trim()) {
            newErrors.address = "주소를 입력해주세요"
        }
        if (!formData.email.trim()) {
            newErrors.email = "이메일을 입력해주세요"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "올바른 이메일 형식을 입력해주세요"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm() || !socialId) { // socialId가 있는지 추가 확인
            setSubmitError("로그인 정보가 없습니다. 다시 로그인해주세요.")
            return
        }

        setIsSubmitting(true)
        setSubmitError(null)

        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/store/register`

            // 전송할 최종 데이터 객체
            const finalData: StoreSignDto = {
                ...formData,
                socialId: socialId,
            }

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(finalData),
            })

            if (!response.ok) {
                // HTTP 상태 코드가 200번대가 아닌 경우 에러 처리
                const errorData = await response.text()
                throw new Error(errorData || "서버 오류가 발생했습니다.")
            }

            // 성공적으로 응답을 받은 경우
            console.log("가게 등록 성공:", await response.text())
            setIsSuccess(true)
        } catch (error: any) {
            console.error("가게 등록 실패:", error)
            setSubmitError(error.message || "가게 등록 중 오류가 발생했습니다. 다시 시도해주세요.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">가게 등록 완료!</h2>
                    <p className="text-gray-600 mb-6">
                        <strong>{formData.storeName}</strong>이 성공적으로 등록되었습니다.
                        <br />
                        승인 후 서비스를 이용하실 수 있습니다.
                    </p>
                    <Link href="/store">
                        <button className="w-full px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg">
                            메인으로 돌아가기
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
            <div className="container mx-auto p-4 lg:p-6">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/">
                        <button className="mb-6 px-4 py-2 border border-rose-200 hover:bg-rose-50 bg-transparent rounded-md flex items-center gap-2 transition-colors text-sm">
                            <ArrowLeft className="h-4 w-4" />
                            메인으로 돌아가기
                        </button>
                    </Link>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl flex items-center justify-center">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                Re:Member
                            </h1>
                        </div>
                        <p className="text-gray-600 text-lg">가게 등록하기</p>
                        <p className="text-gray-500 text-sm mt-2">따뜻한 고객 관리 시스템과 함께하세요</p>
                    </div>
                </div>

                {/* Registration Form */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white">
                            <div className="flex items-center gap-3">
                                <Store className="h-6 w-6" />
                                <div>
                                    <h2 className="text-xl font-bold">가게 정보 등록</h2>
                                    <p className="text-rose-100 text-sm">고객 관리를 시작하기 위한 기본 정보를 입력해주세요</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
                            {/* Store Name */}
                            <div className="space-y-2">
                                <label htmlFor="storeName" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Store className="h-4 w-4 text-rose-500" />
                                    가게명 <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="storeName"
                                    name="storeName"
                                    value={formData.storeName}
                                    onChange={handleInputChange}
                                    placeholder="예: 멍멍 미용실"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        errors.storeName
                                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                                            : "border-rose-200 focus:ring-rose-400 focus:border-rose-400"
                                    }`}
                                />
                                {errors.storeName && (
                                    <p className="text-red-500 text-sm flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                        {errors.storeName}
                                    </p>
                                )}
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label htmlFor="address" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <MapPin className="h-4 w-4 text-amber-500" />
                                    주소 <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="예: 서울시 강남구 테헤란로 123길 45"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        errors.address
                                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                                            : "border-rose-200 focus:ring-rose-400 focus:border-rose-400"
                                    }`}
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-sm flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Mail className="h-4 w-4 text-blue-500" />
                                    이메일 <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="예: store@example.com"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        errors.email
                                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                                            : "border-rose-200 focus:ring-rose-400 focus:border-rose-400"
                                    }`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm flex items-center gap-1">
                                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Introduction */}
                            <div className="space-y-2">
                                <label htmlFor="introduction" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <FileText className="h-4 w-4 text-green-500" />
                                    가게 소개 <span className="text-gray-400">(선택사항)</span>
                                </label>
                                <textarea
                                    id="introduction"
                                    name="introduction"
                                    value={formData.introduction}
                                    onChange={handleInputChange}
                                    placeholder="가게에 대한 간단한 소개를 작성해주세요..."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 resize-none transition-all"
                                />
                            </div>

                            {/* Social ID Display (읽기 전용) */}
                            <div className="space-y-2">
                                <label htmlFor="socialId" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <User className="h-4 w-4 text-purple-500" />
                                    가게 대표 ID
                                </label>
                                <input
                                    type="text"
                                    id="socialId"
                                    value={socialId || "로그인 정보 없음"}
                                    readOnly
                                    className="w-full px-4 py-3 border border-rose-200 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
                                />
                            </div>

                            {/* Submit Error Message */}
                            {submitError && (
                                <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm text-center">
                                    {submitError}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !socialId} // socialId가 없으면 버튼 비활성화
                                    className="w-full px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            등록 중...
                                        </>
                                    ) : (
                                        <>
                                            <Store className="h-5 w-5" />
                                            가게 등록하기
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200">
                                <h3 className="font-semibold text-rose-900 mb-2 flex items-center gap-2">
                                    <Heart className="h-4 w-4" />
                                    등록 후 안내사항
                                </h3>
                                <ul className="text-sm text-rose-800 space-y-1">
                                    <li>• 등록 후 관리자 승인까지 1-2일 소요됩니다</li>
                                    <li>• 승인 완료 시 등록하신 이메일로 안내드립니다</li>
                                    <li>• 문의사항은 고객센터로 연락해주세요</li>
                                </ul>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}