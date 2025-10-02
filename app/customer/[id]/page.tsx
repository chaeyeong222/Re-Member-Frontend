"use client"

import {
    ArrowLeft,
    Heart,
    Calendar,
    Phone,
    FileText,
    Clock,
    TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
// @ts-ignore
import { type PageProps } from 'next';
// 인터페이스 정의
interface VisitHistory {
    id: number
    visitDate: string // 서버에서 Timestamp (ISO String)
    amount: number
    memo: string
}

interface Customer {
    customerKey: number
    customerName: string
    customerPhone: string
    visitCnt: number
    memo: string | null // null 가능성을 추가
    lastVisit: string // 서버에서 Timestamp (ISO String)
    joinDate: string // 서버에서 Timestamp (ISO String)
}

// Next.js App Router Props 타입 (이 부분이 Next.js에서 기대하는 타입과 일치해야 함)
// interface CustomerDetailProps {
//     params: { id: string }
// }
type CustomerPageParams = {
    id: string; // [id] 폴더 이름과 일치
};
type CustomerDetailProps = PageProps<CustomerPageParams>;
// 날짜 포맷팅 유틸리티 함수
const formatDate = (timestamp: string | null): string => {
    if (!timestamp) return "-"
    try {
        // Z가 붙어있지 않으면 UTC로 해석되지 않도록 처리
        const date = new Date(timestamp.endsWith('Z') ? timestamp : `${timestamp}Z`)
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    } catch (e) {
        return "-"
    }
}

export default function CustomerDetail({ params }: CustomerDetailProps) {
    const { id } = params
    const [visitHistories, setVisitHistories] = useState<VisitHistory[]>([])
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090"

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            setError(null)

            try {
                // 1. 고객 기본 정보 가져오기
                const customerResponse = await fetch(`${apiUrl}/customer/${id}`)
                if (!customerResponse.ok) {
                    throw new Error(`고객 정보 로드 실패: ${customerResponse.status}`)
                }
                const customerData: Customer = await customerResponse.json()

                // 2. 방문 이력 가져오기
                const historyResponse = await fetch(`${apiUrl}/customer/${id}/customerHistory`)
                if (!historyResponse.ok) {
                    throw new Error(`방문 이력 로드 실패: ${historyResponse.status}`)
                }
                const historyData: VisitHistory[] = await historyResponse.json()

                // 3. 데이터 정리 및 상태 업데이트

                // 방문 이력 날짜 포맷 변환 (Timestamp → 한국어 날짜)
                const formattedHistories = historyData
                    // 최신순 정렬 (서버에서 정렬되지 않았을 경우를 대비)
                    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
                    .map(history => ({
                        ...history,
                        visitDate: formatDate(history.visitDate)
                    }))

                // 고객 기본 정보 날짜 포맷 변환 및 통계 계산
                const lastVisitDate = formattedHistories[0]?.visitDate || formatDate(customerData.lastVisit)
                const joinDate = formatDate(customerData.joinDate)

                setCustomer({
                    ...customerData,
                    visitCnt: formattedHistories.length, // 이력 데이터로 횟수 재계산
                    lastVisit: lastVisitDate,
                    joinDate: joinDate,
                    // customerData.memo가 null일 경우 빈 문자열로 처리
                    memo: customerData.memo || null
                })
                setVisitHistories(formattedHistories)

            } catch (err) {
                console.error("데이터 불러오기 실패:", err)
                // 404 에러일 경우를 대비하여 에러 메시지 분기 처리
                setError(err instanceof Error && err.message.includes("404") ? "고객을 찾을 수 없습니다." : "데이터를 불러오는데 실패했습니다.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [id, apiUrl]) // 의존성 배열에 id와 apiUrl 포함

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
                <div className="flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                    <span className="ml-4 text-gray-600">데이터를 불러오는 중...</span>
                </div>
            </div>
        )
    }

    if (error || !customer) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <p className="text-gray-600 mb-4">{error || "고객 정보를 찾을 수 없습니다."}</p>
                    <Link href="/store" passHref>
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
    const totalAmount = visitHistories.reduce((sum, visit) => sum + Number(visit.amount), 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
            <div className="container mx-auto p-3 sm:p-4 lg:p-6">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <Link href="/store" passHref>
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
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{customer.customerName}</h1>
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
                                        <span className="text-gray-700 text-sm sm:text-base">{customer.customerPhone}</span>
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
                                    <div className="text-center p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
                                        <p className="text-xl sm:text-2xl font-bold text-rose-600">{customer.visitCnt}회</p>
                                        <p className="text-xs text-gray-600">총 방문 횟수</p>
                                    </div>

                                    <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                                        <p className="text-lg sm:text-xl font-bold text-emerald-600">
                                            ₩{totalAmount.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-600">총 이용 금액</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 상세 정보 */}
                    <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                        {/* 메모 */}
                        {customer.memo && (
                            <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
                                <div className="p-4 sm:p-6">
                                    <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold mb-4">
                                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                                        고객 메모
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{customer.memo}</p>
                                </div>
                            </div>
                        )}

                        {/* 방문 이력 */}
                        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
                            <div className="p-4 sm:p-6">
                                <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold mb-4">
                                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                                    방문 이력 (최신순)
                                </h2>

                                {visitHistories.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">방문 이력이 없습니다.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {visitHistories.map((visit) => (
                                            <div key={visit.id} className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0 mb-2">
                                                    <div className="flex-1">
                                                        <p className="text-xs sm:text-sm text-gray-600">{visit.visitDate}</p>
                                                    </div>
                                                    <div className="text-left sm:text-right">
                                                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                                                            ₩{visit.amount.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                {visit.memo && (
                                                    <p className="text-sm text-gray-600 bg-white/50 p-2 rounded">{visit.memo}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}