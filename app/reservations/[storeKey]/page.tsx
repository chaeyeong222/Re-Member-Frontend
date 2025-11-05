"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, Clock, User, Phone, ArrowLeft, Heart, Filter, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

// 예약 상태 타입
type ReservationStatus = "PENDING" | "RESERVED" | "COMPLETED" | "CANCELED"

interface Reservation {
    reservationKey: number
    customerId: number
    storeKey: number
    reservationName: string
    reservationDateTime: string // "2025-01-30T14:00:00"
    reservationStatus: ReservationStatus
    amount?: number | null
    memo?: string | null
    customer?: {
        customerName: string
        customerPhone: string
    }
}

// 상태별 한글 표시
const statusText = {
    PENDING: "예약 확정 대기중",
    RESERVED: "예약 확정",
    COMPLETED: "방문 완료",
    CANCELED: "예약 취소"
}

// 상태별 색상
const statusColor = {
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    RESERVED: "bg-blue-100 text-blue-800 border-blue-200",
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    CANCELED: "bg-gray-100 text-gray-800 border-gray-200"
}

export default function ReservationManagement() {
    const params = useParams()
    const router = useRouter()
    const storeKey = params.storeKey as string

    const [reservations, setReservations] = useState<Reservation[]>([])
    const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 필터 상태
    const [statusFilter, setStatusFilter] = useState<ReservationStatus | "ALL">("ALL")
    const [dateFilter, setDateFilter] = useState<"TODAY" | "WEEK" | "ALL">("ALL")

    // 완료 모달 상태
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
    const [completeAmount, setCompleteAmount] = useState("")
    const [completeMemo, setCompleteMemo] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090"

    // 예약 목록 조회
    useEffect(() => {
        const fetchReservations = async () => {
            if (!storeKey) {
                setError("가게 정보를 찾을 수 없습니다.")
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const response = await fetch(`${apiUrl}/reservations/store/${storeKey}`)

                if (!response.ok) {
                    throw new Error("예약 목록을 불러오는데 실패했습니다.")
                }

                const data: Reservation[] = await response.json()
                setReservations(data)
                setFilteredReservations(data)
            } catch (err) {
                console.error("예약 목록 조회 실패:", err)
                setError(err instanceof Error ? err.message : "예약 목록을 불러오는데 실패했습니다.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchReservations()
    }, [storeKey, apiUrl])

    // 필터 적용
    useEffect(() => {
        let filtered = [...reservations]

        // 상태 필터
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(r => r.reservationStatus === statusFilter)
        }

        // 날짜 필터
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (dateFilter === "TODAY") {
            filtered = filtered.filter(r => {
                const reservedDate = new Date(r.reservationDateTime)
                reservedDate.setHours(0, 0, 0, 0)
                return reservedDate.getTime() === today.getTime()
            })
        } else if (dateFilter === "WEEK") {
            const weekLater = new Date(today)
            weekLater.setDate(weekLater.getDate() + 7)
            filtered = filtered.filter(r => {
                const reservedDate = new Date(r.reservationDateTime)
                return reservedDate >= today && reservedDate <= weekLater
            })
        }

        setFilteredReservations(filtered)
    }, [statusFilter, dateFilter, reservations])

    // 통계 계산
    const stats = {
        total: reservations.length,
        pending: reservations.filter(r => r.reservationStatus === "PENDING").length,
        reserved: reservations.filter(r => r.reservationStatus === "RESERVED").length,
        completed: reservations.filter(r => r.reservationStatus === "COMPLETED").length,
        cancelled: reservations.filter(r => r.reservationStatus === "CANCELED").length
    }

    // 상태 변경
    const handleStatusChange = async (reservationKey: number, newStatus: ReservationStatus) => {
        const reservation = reservations.find(r => r.reservationKey === reservationKey)
        if (!reservation) return

        // 완료로 변경 시 모달 열기
        if (newStatus === "COMPLETED") {
            setSelectedReservation(reservation)
            setCompleteAmount(reservation.amount?.toString() || "0")
            setCompleteMemo(reservation.memo || "")
            setIsCompleteModalOpen(true)
            return
        }

        // 취소로 변경 시 확인 후 처리
        if (newStatus === "CANCELED") {
            if (!confirm("예약을 취소하시겠습니까?")) {
                return
            }
            await handleCancel(reservationKey)
            return
        }

        // 그 외 상태 변경 (대기중, 확정)
        try {
            const response = await fetch(`${apiUrl}/reservations/${reservationKey}/status?status=${newStatus}`, {
                method: "PUT"
            })

            if (!response.ok) {
                throw new Error("상태 변경에 실패했습니다.")
            }

            const updatedReservation: Reservation = await response.json()

            // 로컬 상태 업데이트
            setReservations(reservations.map(r =>
                r.reservationKey === reservationKey ? updatedReservation : r
            ))

            alert("예약 상태가 변경되었습니다.")
        } catch (err) {
            console.error("상태 변경 실패:", err)
            alert("상태 변경에 실패했습니다.")
        }
    }

    // 예약 완료 처리 (+ 고객 히스토리 자동 추가)
    const handleComplete = async () => {
        if (!selectedReservation) return

        setIsSubmitting(true)
        try {
            const requestData = {
                amount: Number(completeAmount) || 0,
                memo: completeMemo,
                customerId: selectedReservation.customerId,
                customerName: selectedReservation.customer?.customerName,
                customerPhone: selectedReservation.customer?.customerPhone
            }

            const response = await fetch(`${apiUrl}/reservations/${selectedReservation.reservationKey}/complete`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData)
            })

            if (!response.ok) {
                throw new Error("예약 완료 처리에 실패했습니다.")
            }

            const updatedReservation: Reservation = await response.json()

            // 로컬 상태 업데이트
            setReservations(reservations.map(r =>
                r.reservationKey === selectedReservation.reservationKey ? updatedReservation : r
            ))

            // 모달 닫기 및 초기화
            setIsCompleteModalOpen(false)
            setSelectedReservation(null)
            setCompleteAmount("")
            setCompleteMemo("")
            alert("예약이 완료되었으며 고객 히스토리에 추가되었습니다.")
        } catch (err) {
            console.error("예약 완료 처리 실패:", err)
            alert("예약 완료 처리에 실패했습니다.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // 예약 취소
    const handleCancel = async (reservationKey: number) => {
        try {
            const response = await fetch(`${apiUrl}/reservations/${reservationKey}/cancel`, {
                method: "PUT"
            })

            if (!response.ok) {
                throw new Error("예약 취소에 실패했습니다.")
            }

            const updatedReservation: Reservation = await response.json()

            // 로컬 상태 업데이트
            setReservations(reservations.map(r =>
                r.reservationKey === reservationKey ? updatedReservation : r
            ))

            alert("예약이 취소되었습니다.")
        } catch (err) {
            console.error("예약 취소 실패:", err)
            alert("예약 취소에 실패했습니다.")
        }
    }

    // 날짜 포맷팅
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Seoul"
        })
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "Asia/Seoul"
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-rose-500 animate-spin mx-auto mb-4" />
                    <span className="text-gray-600">예약 목록을 불러오는 중...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center">
                <div className="max-w-md mx-4 bg-white rounded-lg shadow-lg p-6 text-center">
                    <h2 className="text-xl font-bold text-rose-600 mb-4">오류</h2>
                    <p className="text-gray-700 mb-4">{error}</p>
                    <Link href={`/dashboard/${storeKey}`}>
                        <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-md hover:from-rose-600 hover:to-pink-600">
                            대시보드로 돌아가기
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
            <div className="container mx-auto p-3 sm:p-4 lg:p-6">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <Link href={`/dashboard/${storeKey}`}>
                        <button className="mb-4 px-4 py-2 border border-rose-200 hover:bg-rose-50 bg-transparent rounded-md flex items-center gap-2 transition-colors text-sm">
                            <ArrowLeft className="h-4 w-4" />
                            대시보드로 돌아가기
                        </button>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center">
                            <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            예약 관리
                        </h1>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg ml-10 sm:ml-13">가게 예약 현황</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-3 sm:p-4">
                        <p className="text-xs text-gray-600 mb-1">전체</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-3 sm:p-4">
                        <p className="text-xs text-amber-600 mb-1">예약 확정 대기중</p>
                        <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-3 sm:p-4">
                        <p className="text-xs text-blue-600 mb-1">예약 확정</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.reserved}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-3 sm:p-4">
                        <p className="text-xs text-green-600 mb-1">방문 완료</p>
                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-3 sm:p-4">
                        <p className="text-xs text-gray-600 mb-1">예약 취소</p>
                        <p className="text-2xl font-bold text-gray-600">{stats.cancelled}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-4 w-4 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">필터</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* 날짜 필터 */}
                        <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-2">날짜</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setDateFilter("TODAY")}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                                        dateFilter === "TODAY"
                                            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    오늘
                                </button>
                                <button
                                    onClick={() => setDateFilter("WEEK")}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                                        dateFilter === "WEEK"
                                            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    이번주
                                </button>
                                <button
                                    onClick={() => setDateFilter("ALL")}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                                        dateFilter === "ALL"
                                            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    전체
                                </button>
                            </div>
                        </div>

                        {/* 상태 필터 */}
                        <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-2">상태</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | "ALL")}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400"
                            >
                                <option value="ALL">전체</option>
                                <option value="PENDING">예약 확정 대기</option>
                                <option value="RESERVED">예약 확정</option>
                                <option value="COMPLETED">방문 완료</option>
                                <option value="CANCELED">예약 취소</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Reservation List */}
                <div className="space-y-4">
                    {filteredReservations.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-8 text-center">
                            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">예약이 없습니다.</p>
                        </div>
                    ) : (
                        filteredReservations.map((reservation) => (
                            <div key={reservation.reservationKey} className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-4 sm:p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    {/* 예약 정보 */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        {formatDateTime(reservation.reservationDateTime)}
                                                    </span>
                                                </div>
                                                {reservation.reservationName && (
                                                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                                                        <User className="h-4 w-4" />
                                                        <span className="font-medium">{reservation.reservationName}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <User className="h-4 w-4" />
                                                    <span>{reservation.customer?.customerName || "고객 정보 없음"}</span>
                                                </div>
                                                {reservation.customer?.customerPhone && (
                                                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                                                        <Phone className="h-4 w-4" />
                                                        <span>{reservation.customer.customerPhone}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColor[reservation.reservationStatus]}`}>
                                                {statusText[reservation.reservationStatus]}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 상태 변경 */}
                                    <div className="lg:w-48">
                                        <label className="block text-sm text-gray-600 mb-2">상태 변경</label>
                                        <select
                                            value={reservation.reservationStatus}
                                            onChange={(e) => handleStatusChange(reservation.reservationKey, e.target.value as ReservationStatus)}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            <option value="PENDING">예약 확정 대기중</option>
                                            <option value="RESERVED">예약 확정</option>
                                            <option value="COMPLETED">방문 완료</option>
                                            <option value="CANCELED">예약 취소</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 예약 완료 모달 */}
                {isCompleteModalOpen && selectedReservation && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                예약 완료 처리
                            </h3>

                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">고객명</p>
                                <p className="font-medium text-gray-900">{selectedReservation.customer?.customerName}</p>
                                <p className="text-sm text-gray-600 mt-2 mb-1">예약 일시</p>
                                <p className="font-medium text-gray-900">{formatDateTime(selectedReservation.reservationDateTime)}</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        이용 금액 (원) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={completeAmount}
                                        onChange={(e) => setCompleteAmount(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        메모
                                    </label>
                                    <textarea
                                        value={completeMemo}
                                        onChange={(e) => setCompleteMemo(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                                        placeholder="방문 관련 메모를 입력하세요"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-sm text-blue-800">
                                    예약 완료 시 고객 히스토리에 자동으로 추가됩니다.
                                </p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setIsCompleteModalOpen(false)
                                        setSelectedReservation(null)
                                        setCompleteAmount("")
                                        setCompleteMemo("")
                                    }}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleComplete}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-md transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "처리 중..." : "완료 처리"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}