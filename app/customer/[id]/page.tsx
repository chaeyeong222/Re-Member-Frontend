"use client"

import {
    ArrowLeft,
    Heart,
    Calendar,
    Phone,
    Tag,
    FileText,
    Star,
    Gift,
    Clock,
    TrendingUp,
    Edit,
    Save,
    X,
    Plus,
} from "lucide-react"
import Link from "next/link"
import { use, useState, useEffect } from "react"

// 고객 데이터 타입 정의
interface Customer {
    id: number
    name: string
    phone: string
    visitCount: number
    memo: string
    lastVisit: string
    tags: string[]
    joinDate: string
    totalSpent: number
    favoriteService: string
    visitHistory: VisitHistory[]
    preferences: string[]
    detailedMemos: DetailedMemo[]
}

interface VisitHistory {
    id: number
    date: string
    service: string
    amount: number
    satisfaction: number
    memo: string
    staff: string
}

interface DetailedMemo {
    id: number
    date: string
    content: string
    category: string
}

interface CustomerDetailProps {
    params: { id: string }
}

// API에서 고객 데이터를 가져오는 함수
const fetchCustomer = async (id: string): Promise<Customer | null> => {
    try {
        const response = await fetch(`http://localhost:8090/customer/${id}/userHistory`)
        if (!response.ok) {
            if (response.status === 404) {
                console.error("고객을 찾을 수 없습니다.")
                return null
            }
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: Customer = await response.json()
        return data
    } catch (error) {
        console.error("고객 데이터 불러오기 실패:", error)
        return null
    }
}

export default function CustomerDetail({ params }: CustomerDetailProps) {
    const { id } = params
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // 메모 수정 관련 상태
    const [isEditingMemo, setIsEditingMemo] = useState(false)
    const [editedMemo, setEditedMemo] = useState("")

    // 태그 추가/삭제 관련 상태
    const [newTag, setNewTag] = useState("")
    const [isAddingTag, setIsAddingTag] = useState(false)

    // 상세 메모 수정 관련 상태
    const [editingMemoId, setEditingMemoId] = useState<number | null>(null)
    const [editingMemoContent, setEditingMemoContent] = useState("")

    // 컴포넌트 마운트 시 데이터 불러오기
    useEffect(() => {
        const getCustomerData = async () => {
            setIsLoading(true)
            const data = await fetchCustomer(id)
            setCustomer(data)
            setEditedMemo(data?.memo || "") // 메모 상태 초기화
            setIsLoading(false)
        }
        getCustomerData()
    }, [id])

    // 고객 데이터가 없을 경우
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
                <div className="flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-4 text-gray-600">데이터를 불러오는 중...</span>
                </div>
            </div>
        )
    }

    if (!customer) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <p className="text-gray-600 mb-4">고객을 찾을 수 없습니다.</p>
                    <Link href="/">
                        <button className="w-full px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-md hover:from-rose-600 hover:to-pink-600 transition-colors">
                            <ArrowLeft className="h-4 w-4 inline mr-2" />
                            고객 목록으로 돌아가기
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    // 통계 계산
    const averageSatisfaction =
        customer.visitHistory?.reduce((sum, visit) => sum + visit.satisfaction, 0) / (customer.visitHistory?.length || 1)

    // 메모 저장 핸들러
    const handleSaveMemo = () => {
        // 서버에 저장하는 API 호출 로직 추가 (예: PUT or PATCH)
        setCustomer((prev) => (prev ? { ...prev, memo: editedMemo } : null))
        setIsEditingMemo(false)
    }

    // 태그 추가 핸들러
    const handleAddTag = () => {
        if (newTag.trim() && customer) {
            setCustomer((prev) =>
                prev
                    ? {
                        ...prev,
                        tags: [...prev.tags, newTag.trim()],
                    }
                    : null,
            )
            setNewTag("")
            setIsAddingTag(false)
        }
    }

    // 태그 삭제 핸들러
    const handleRemoveTag = (tagToRemove: string) => {
        setCustomer((prev) =>
            prev
                ? {
                    ...prev,
                    tags: prev.tags.filter((tag) => tag !== tagToRemove),
                }
                : null,
        )
    }

    // 상세 메모 수정 핸들러
    const handleEditDetailedMemo = (memoId: number, content: string) => {
        setEditingMemoId(memoId)
        setEditingMemoContent(content)
    }

    // 상세 메모 저장 핸들러
    const handleSaveDetailedMemo = () => {
        if (customer && editingMemoId) {
            setCustomer((prev) =>
                prev
                    ? {
                        ...prev,
                        detailedMemos: prev.detailedMemos?.map((memo) =>
                            memo.id === editingMemoId ? { ...memo, content: editingMemoContent } : memo,
                        ),
                    }
                    : null,
            )
            setEditingMemoId(null)
            setEditingMemoContent("")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
            <div className="container mx-auto p-3 sm:p-4 lg:p-6">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <Link href="/">
                        <button className="mb-4 px-3 sm:px-4 py-2 border border-rose-200 hover:bg-rose-50 bg-transparent rounded-md flex items-center gap-2 transition-colors text-sm">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">고객 목록으로 돌아가기</span>
                            <span className="sm:hidden">돌아가기</span>
                        </button>
                    </Link>

                    <div className="flex items-center gap-3 sm:gap-4 mb-2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
                            <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{customer.name}</h1>
                            <p className="text-gray-600 text-sm sm:text-base">고객 상세 정보</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                    {/* 기본 정보 */}
                    <div className="xl:col-span-1 space-y-4 sm:space-y-6">
                        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
                            <div className="p-4 sm:p-6">
                                <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold mb-4">
                                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500" />
                                    기본 정보
                                </h2>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                        <span className="text-gray-700 text-sm sm:text-base">{customer.phone}</span>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500">가입일</p>
                                            <p className="text-gray-700 text-sm sm:text-base">{customer.joinDate}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500">최근 방문</p>
                                            <p className="text-gray-700 text-sm sm:text-base">{customer.lastVisit}</p>
                                        </div>
                                    </div>

                                    <hr className="border-gray-200" />

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-700">고객 태그</p>
                                            <button
                                                onClick={() => setIsAddingTag(true)}
                                                className="p-1 hover:bg-rose-50 rounded transition-colors"
                                            >
                                                <Plus className="h-4 w-4 text-rose-500" />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {customer.tags.map((tag, index) => (
                                                <div key={index} className="group relative">
                          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                            <Tag className="h-3 w-3 mr-1" />
                              {tag}
                              <button
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                                                </div>
                                            ))}

                                            {isAddingTag && (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="text"
                                                        value={newTag}
                                                        onChange={(e) => setNewTag(e.target.value)}
                                                        placeholder="새 태그"
                                                        className="px-2 py-1 text-xs border border-rose-200 rounded focus:outline-none focus:ring-1 focus:ring-rose-400"
                                                        onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                                                    />
                                                    <button onClick={handleAddTag} className="p-1 hover:bg-green-50 rounded transition-colors">
                                                        <Save className="h-3 w-3 text-green-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsAddingTag(false)
                                                            setNewTag("")
                                                        }}
                                                        className="p-1 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <X className="h-3 w-3 text-red-600" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 통계 정보 */}
                        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
                            <div className="p-4 sm:p-6">
                                <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold mb-4">
                                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                                    통계 정보
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <div className="text-center p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
                                            <p className="text-xl sm:text-2xl font-bold text-rose-600">{customer.visitCount}</p>
                                            <p className="text-xs text-gray-600">총 방문 횟수</p>
                                        </div>
                                        <div className="text-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                                            <p className="text-xl sm:text-2xl font-bold text-amber-600">
                                                {averageSatisfaction.toFixed(1)}
                                            </p>
                                            <p className="text-xs text-gray-600">평균 만족도</p>
                                        </div>
                                    </div>

                                    <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                                        <p className="text-lg sm:text-xl font-bold text-emerald-600">
                                            ₩{customer.totalSpent.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-600">총 이용 금액</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">선호 서비스</p>
                                        <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            <Gift className="h-3 w-3 mr-1" />
                                            {customer.favoriteService}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 상세 정보 */}
                    <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                        {/* 메모 */}
                        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                                        고객 메모
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setIsEditingMemo(true)
                                            setEditedMemo(customer.memo)
                                        }}
                                        className="p-2 hover:bg-blue-50 rounded transition-colors"
                                    >
                                        <Edit className="h-4 w-4 text-blue-500" />
                                    </button>
                                </div>

                                {isEditingMemo ? (
                                    <div className="space-y-3">
                                        <textarea
                                            value={editedMemo}
                                            onChange={(e) => setEditedMemo(e.target.value)}
                                            className="w-full p-3 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                                            rows={4}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSaveMemo}
                                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2"
                                            >
                                                <Save className="h-4 w-4" />
                                                저장
                                            </button>
                                            <button
                                                onClick={() => setIsEditingMemo(false)}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all flex items-center gap-2"
                                            >
                                                <X className="h-4 w-4" />
                                                취소
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{customer.memo}</p>
                                )}
                            </div>
                        </div>

                        {/* 방문 이력 */}
                        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
                            <div className="p-4 sm:p-6">
                                <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold mb-4">
                                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                                    방문 이력 (최신순)
                                </h2>
                                <div className="space-y-3 sm:space-y-4">
                                    {customer.visitHistory?.map((visit) => (
                                        <div key={visit.id} className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0 mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-medium text-gray-900 text-sm sm:text-base">{visit.service}</p>
                                                        <span className="text-xs text-gray-500">by {visit.staff}</span>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-gray-600">{visit.date}</p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                                                        ₩{visit.amount.toLocaleString()}
                                                    </p>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3 w-3 ${
                                                                    i < visit.satisfaction ? "text-yellow-400 fill-current" : "text-gray-300"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 bg-white/50 p-2 rounded">{visit.memo}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 상세 메모 */}
                        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
                            <div className="p-4 sm:p-6">
                                <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold mb-4">
                                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
                                    상세 메모 (최신순)
                                </h2>
                                <div className="space-y-3">
                                    {customer.detailedMemos?.map((memo) => (
                                        <div
                                            key={memo.id}
                                            className="border-l-4 border-indigo-200 pl-3 sm:pl-4 py-2 bg-indigo-50/30 rounded-r-lg"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700">
                            {memo.category}
                          </span>
                                                    <p className="text-xs text-gray-500">{memo.date}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleEditDetailedMemo(memo.id, memo.content)}
                                                    className="p-1 hover:bg-indigo-100 rounded transition-colors"
                                                >
                                                    <Edit className="h-3 w-3 text-indigo-500" />
                                                </button>
                                            </div>

                                            {editingMemoId === memo.id ? (
                                                <div className="space-y-2">
                          <textarea
                              value={editingMemoContent}
                              onChange={(e) => setEditingMemoContent(e.target.value)}
                              className="w-full p-2 text-sm border border-indigo-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none"
                              rows={3}
                          />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleSaveDetailedMemo}
                                                            className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-all flex items-center gap-1"
                                                        >
                                                            <Save className="h-3 w-3" />
                                                            저장
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingMemoId(null)
                                                                setEditingMemoContent("")
                                                            }}
                                                            className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-all flex items-center gap-1"
                                                        >
                                                            <X className="h-3 w-3" />
                                                            취소
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-700 text-sm sm:text-base">{memo.content}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 고객 선호사항 */}
                        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
                            <div className="p-4 sm:p-6">
                                <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold mb-4">
                                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
                                    고객 선호사항
                                </h2>
                                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                    {customer.preferences?.map((preference, index) => (
                                        <div key={index} className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg">
                                            <Star className="h-4 w-4 text-pink-500 flex-shrink-0" />
                                            <span className="text-gray-700 text-sm sm:text-base">{preference}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}