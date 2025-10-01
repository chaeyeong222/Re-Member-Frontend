"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, Clock, MapPin, Phone, User, Heart, ChevronLeft, Loader2 } from "lucide-react"

interface Store {
    storeKey: number
    storeName: string
    phone: string
    address: string
    introduction: string
}

export default function ReservationPage() {
    const params = useParams()
    const router = useRouter()

    // storeKey 추출 (useParams 또는 URL 파싱)
    const [storeKey, setStoreKey] = useState<string>("")

    useEffect(() => {
        const storeKeyFromParams = params.storeKey as string

        if (storeKeyFromParams) {
            setStoreKey(storeKeyFromParams)
        } else {
            // URL에서 직접 추출: /booking/3 → "3"
            const pathname = window.location.pathname
            const matches = pathname.match(/\/booking\/(\d+)/)
            if (matches && matches[1]) {
                setStoreKey(matches[1])
            }
        }
    }, [params])

    const [store, setStore] = useState<Store | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState<string>("")
    const [customerName, setCustomerName] = useState("")
    const [customerPhone, setCustomerPhone] = useState("")
    const [specialRequests, setSpecialRequests] = useState("")

    const availableTimes = [
        "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
        "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
        "19:00", "19:30", "20:00", "20:30", "21:00",
    ]

    // 가게 정보 가져오기
    useEffect(() => {
        const fetchStore = async () => {
            console.log('storeKey:', storeKey)

            if (!storeKey) {
                console.log('storeKey가 없습니다.')
                return
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'
            const url = `${apiUrl}/store/getStore/${storeKey}`
            console.log('API URL:', url)

            try {
                setLoading(true)
                const response = await fetch(url)
                console.log('response status:', response.status)

                if (!response.ok) {
                    throw new Error('가게 정보를 찾을 수 없습니다.')
                }

                const data = await response.json()
                console.log('가게 데이터:', data)
                setStore(data)
            } catch (err) {
                console.error('에러:', err)
                setError(err instanceof Error ? err.message : '가게 정보를 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }

        if (storeKey) {
            fetchStore()
        }
    }, [storeKey])

    const handleReservation = () => {
        if (!selectedDate || !selectedTime || !customerName || !customerPhone) {
            alert("모든 필수 정보를 입력해주세요.")
            return
        }

        alert(
            `예약이 완료되었습니다!\n날짜: ${selectedDate.toLocaleDateString("ko-KR")}\n시간: ${selectedTime}\n고객명: ${customerName}`,
        )

        router.push("/store")
    }

    const handleGoBack = () => {
        router.push("/store")
    }

    // 로딩 상태
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-rose-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">가게 정보를 불러오는 중...</p>
                    <p className="text-sm text-gray-500 mt-2">storeKey: {storeKey || 'loading...'}</p>
                </div>
            </div>
        )
    }

    // 에러 상태
    if (error || !store) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center">
                <div className="max-w-md mx-4 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold text-rose-600 mb-4">오류</h2>
                    <p className="text-gray-700 mb-4">{error || '가게 정보를 찾을 수 없습니다.'}</p>
                    <p className="text-sm text-gray-500 mb-4">storeKey: {storeKey || 'undefined'}</p>
                    <Button onClick={handleGoBack} className="w-full">
                        돌아가기
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
            <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-rose-100">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleGoBack}
                            className="text-rose-600 hover:bg-rose-50/50"
                            aria-label="뒤로가기"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                Re:Member
                            </h1>
                        </div>
                        <div className="w-10"></div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg p-4">
                        <div className="flex items-center space-x-3">
                            <MapPin className="w-6 h-6" />
                            <div className="flex-1">
                                <CardTitle className="text-xl">{store.storeName}</CardTitle>
                                <CardDescription className="text-rose-100">{store.address}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                            {store.phone && (
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-rose-500" />
                                    <span>{store.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-rose-500" />
                                <span>영업시간: 10:00 - 22:00</span>
                            </div>
                        </div>
                        {store.introduction && (
                            <div className="text-sm text-gray-600 pt-2 border-t border-rose-100">
                                <p>{store.introduction}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <CalendarDays className="w-5 h-5 text-rose-500" />
                                    <span className="text-gray-900">날짜 선택</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    disabled={(date) => date < new Date()}
                                    className="rounded-md border border-rose-200 w-full"
                                />
                            </CardContent>
                        </Card>

                        {selectedDate && (
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Clock className="w-5 h-5 text-amber-500" />
                                        <span className="text-gray-900">시간 선택</span>
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        {selectedDate.toLocaleDateString("ko-KR")} 이용 가능한 시간
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-5 gap-2">
                                        {availableTimes.map((time) => (
                                            <Button
                                                key={time}
                                                variant={selectedTime === time ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setSelectedTime(time)}
                                                className={
                                                    selectedTime === time
                                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-md"
                                                        : "border-amber-200 text-gray-700 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300"
                                                }
                                            >
                                                {time}
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div>
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="w-5 h-5 text-blue-500" />
                                    <span className="text-gray-900">예약 정보</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600">예약에 필요한 정보를 입력해주세요</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="customerName" className="text-gray-700 font-medium">
                                            고객명 <span className="text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="customerName"
                                            placeholder="이름을 입력하세요"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customerPhone" className="text-gray-700 font-medium">
                                            연락처 <span className="text-rose-500">*</span>
                                        </Label>
                                        <Input
                                            id="customerPhone"
                                            placeholder="010-1234-5678"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="specialRequests" className="text-gray-700 font-medium">
                                        특별 요청사항
                                    </Label>
                                    <Textarea
                                        id="specialRequests"
                                        placeholder="알레르기, 특별한 요청사항이 있으시면 입력해주세요"
                                        value={specialRequests}
                                        onChange={(e) => setSpecialRequests(e.target.value)}
                                        rows={3}
                                        className="border-rose-200 focus:border-rose-400 focus:ring-rose-400 resize-none"
                                    />
                                </div>

                                {selectedDate && selectedTime && customerName && (
                                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200">
                                        <h4 className="font-semibold text-rose-900 mb-2 flex items-center gap-2">
                                            <Heart className="w-4 h-4" />
                                            예약 요약
                                        </h4>
                                        <div className="space-y-1 text-sm text-rose-800">
                                            <p>
                                                <strong>가게:</strong> {store.storeName}
                                            </p>
                                            <p>
                                                <strong>날짜:</strong> {selectedDate.toLocaleDateString("ko-KR")}
                                            </p>
                                            <p>
                                                <strong>시간:</strong> {selectedTime}
                                            </p>
                                            <p>
                                                <strong>고객명:</strong> {customerName}
                                            </p>
                                            {customerPhone && (
                                                <p>
                                                    <strong>연락처:</strong> {customerPhone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={handleReservation}
                                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-3 text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
                                    size="lg"
                                >
                                    예약하기
                                </Button>

                                <p className="text-xs text-gray-500 text-center">예약 완료 후 확인 문자를 발송해드립니다.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}