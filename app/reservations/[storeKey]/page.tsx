"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, Clock, User, Phone, ArrowLeft, Heart, Filter, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

// 예약 상태 타입
type ReservationStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"

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
    PENDING: "대기중",
    CONFIRMED: "확정",
    COMPLETED: "완료",
    CANCELLED: "취소"
}

// 상태별 색상
const statusColor = {
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    CANCELLED: "bg-gray-100 text-gray-800 border-gray-200"
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
        confirmed: reservations.filter(r => r.reservationStatus === "CONFIRMED").length,
        completed: reservations.filter(r => r.reservationStatus === "COMPLETED").length,
        cancelled: reservations.filter(r => r.reservationStatus === "CANCELLED").length
    }

    // 상태 변경
    const handleStatusChange = async (reservationKey: number, newStatus: ReservationStatus) => {
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
                        <p className="text-xs text-amber-600 mb-1">대기중</p>
                        <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-3 sm:p-4">
                        <p className="text-xs text-blue-600 mb-1">확정</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-3 sm:p-4">
                        <p className="text-xs text-green-600 mb-1">완료</p>
                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-3 sm:p-4">
                        <p className="text-xs text-gray-600 mb-1">취소</p>
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
                                <option value="PENDING">대기중</option>
                                <option value="CONFIRMED">확정</option>
                                <option value="COMPLETED">완료</option>
                                <option value="CANCELLED">취소</option>
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
                                            <option value="PENDING">대기중</option>
                                            <option value="CONFIRMED">확정</option>
                                            <option value="COMPLETED">완료</option>
                                            <option value="CANCELLED">취소</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}