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
import { use, useState } from "react"

// 고객 데이터 (실제로는 API에서 가져올 데이터)
const customersData = [
    {
        id: 1,
        name: "김민수",
        phone: "010-1234-5678",
        visitCount: 12,
        memo: "VIP 고객, 정기 방문을 선호하며 항상 예의바르고 친절함. 특별한 요청사항이 있을 때는 미리 연락을 주시는 편.",
        lastVisit: "2024-01-25",
        tags: ["VIP", "정기고객", "추천인"],
        joinDate: "2023-03-15",
        totalSpent: 480000,
        favoriteService: "프리미엄 케어",
        visitHistory: [
            {
                id: 1,
                date: "2024-01-25",
                service: "프리미엄 케어",
                amount: 45000,
                satisfaction: 5,
                memo: "고객이 매우 만족해하셨음. 다음에도 같은 스타일 요청",
                staff: "김미용사",
            },
            {
                id: 2,
                date: "2024-01-10",
                service: "기본 케어",
                amount: 35000,
                satisfaction: 5,
                memo: "평소보다 조금 더 짧게 해달라고 요청하셨음",
                staff: "이미용사",
            },
            {
                id: 3,
                date: "2023-12-28",
                service: "프리미엄 케어",
                amount: 45000,
                satisfaction: 4,
                memo: "연말 모임 준비로 특별 스타일링 요청",
                staff: "김미용사",
            },
            {
                id: 4,
                date: "2023-12-15",
                service: "스페셜 케어",
                amount: 55000,
                satisfaction: 5,
                memo: "새로운 스타일에 도전해보고 싶다고 하셨음",
                staff: "박미용사",
            },
        ],
        preferences: ["오후 시간대 선호", "조용한 환경", "따뜻한 차 선호"],
        detailedMemos: [
            {
                id: 1,
                date: "2024-01-25",
                content: "다음 방문 시 새로운 서비스 추천 예정. 고객이 최근 트렌드에 관심이 많으시다고 하셨음.",
                category: "서비스",
            },
            {
                id: 2,
                date: "2024-01-10",
                content: "만족도가 매우 높음, 지인 추천 의사 있음. 친구분께 명함을 드렸음.",
                category: "추천",
            },
            {
                id: 3,
                date: "2023-12-28",
                content: "연말 선물로 추가 서비스 이용. 가족분들께도 추천해주시겠다고 하셨음.",
                category: "이벤트",
            },
        ],
    },
    {
        id: 2,
        name: "이영희",
        phone: "010-2345-6789",
        visitCount: 8,
        memo: "알레르기 주의 - 특정 제품 사용 금지. 민감한 피부를 가지고 있어 항상 패치 테스트 후 진행.",
        lastVisit: "2024-01-22",
        tags: ["알레르기", "주의고객"],
        joinDate: "2023-06-20",
        totalSpent: 320000,
        favoriteService: "기본 케어",
        visitHistory: [
            {
                id: 1,
                date: "2024-01-22",
                service: "기본 케어",
                amount: 35000,
                satisfaction: 4,
                memo: "새로운 자연 성분 제품 사용, 알레르기 반응 없음",
                staff: "이미용사",
            },
            {
                id: 2,
                date: "2024-01-05",
                service: "기본 케어",
                amount: 35000,
                satisfaction: 4,
                memo: "패치 테스트 후 진행, 안전하게 완료",
                staff: "이미용사",
            },
            {
                id: 3,
                date: "2023-12-20",
                service: "기본 케어",
                amount: 35000,
                satisfaction: 5,
                memo: "평소 사용하던 제품으로 진행, 매우 만족",
                staff: "김미용사",
            },
        ],
        preferences: ["자연 성분 제품", "패치 테스트 필수", "오전 시간대"],
        detailedMemos: [
            {
                id: 1,
                date: "2024-01-22",
                content: "새로운 자연 성분 제품 만족도 높음. 앞으로 이 제품 라인 사용 예정.",
                category: "제품",
            },
            {
                id: 2,
                date: "2024-01-05",
                content: "알레르기 반응 없음, 안전하게 진행. 고객이 안심하고 서비스 받으셨음.",
                category: "건강",
            },
        ],
    },
    {
        id: 3,
        name: "박철수",
        phone: "010-3456-7890",
        visitCount: 15,
        memo: "단골 고객, 항상 만족도 높음. 예약 시간을 잘 지키시고 직원들에게도 친절하심.",
        lastVisit: "2024-01-28",
        tags: ["단골", "만족고객", "추천인"],
        joinDate: "2022-11-10",
        totalSpent: 750000,
        favoriteService: "스페셜 케어",
        visitHistory: [
            {
                id: 1,
                date: "2024-01-28",
                service: "스페셜 케어",
                amount: 55000,
                satisfaction: 5,
                memo: "새해 첫 방문, 올해도 잘 부탁한다고 하셨음",
                staff: "박미용사",
            },
            {
                id: 2,
                date: "2024-01-14",
                service: "프리미엄 케어",
                amount: 45000,
                satisfaction: 5,
                memo: "정기 방문, 항상 만족해하심",
                staff: "김미용사",
            },
            {
                id: 3,
                date: "2023-12-30",
                service: "스페셜 케어",
                amount: 55000,
                satisfaction: 4,
                memo: "연말 모임 준비, 평소보다 더 신경써달라고 요청",
                staff: "박미용사",
            },
        ],
        preferences: ["정기 예약", "같은 스타일 유지", "오후 3시 선호"],
        detailedMemos: [
            {
                id: 1,
                date: "2024-01-28",
                content: "올해도 정기적으로 방문하겠다고 하셨음. 매월 둘째, 넷째 주 예약 선호.",
                category: "예약",
            },
            {
                id: 2,
                date: "2024-01-14",
                content: "지인분께 저희 샵을 추천해주셨음. 감사 인사 전달.",
                category: "추천",
            },
        ],
    },
]

interface CustomerDetailProps {
    params: Promise<{ id: string }>
}

export default function CustomerDetail({ params }: CustomerDetailProps) {
    const { id } = use(params)
    const [customer, setCustomer] = useState(customersData.find((c) => c.id === Number.parseInt(id)))
    const [isEditingMemo, setIsEditingMemo] = useState(false)
    const [editedMemo, setEditedMemo] = useState(customer?.memo || "")
    const [newTag, setNewTag] = useState("")
    const [isAddingTag, setIsAddingTag] = useState(false)
    const [editingMemoId, setEditingMemoId] = useState<number | null>(null)
    const [editingMemoContent, setEditingMemoContent] = useState("")

    if (!customer) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full">
                    <p className="text-gray-600 text-center mb-4">고객을 찾을 수 없습니다.</p>
                    <Link href="/">
                        <button className="w-full px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-md">
                            돌아가기
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    const averageSatisfaction =
        customer.visitHistory?.reduce((sum, visit) => sum + visit.satisfaction, 0) / (customer.visitHistory?.length || 1)

    const handleSaveMemo = () => {
        setCustomer((prev) => (prev ? { ...prev, memo: editedMemo } : null))
        setIsEditingMemo(false)
    }

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

    const handleEditDetailedMemo = (memoId: number, content: string) => {
        setEditingMemoId(memoId)
        setEditingMemoContent(content)
    }

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
                                            <p className="text-xl sm:text-2xl font-bold text-amber-600">{averageSatisfaction.toFixed(1)}</p>
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
                                    {customer.visitHistory?.map((visit, index) => (
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
