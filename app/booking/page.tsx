"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin, Phone, User, Heart } from 'lucide-react'

export default function ReservationPage() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState<string>("")
    const [customerName, setCustomerName] = useState("")
    const [customerPhone, setCustomerPhone] = useState("")
    const [specialRequests, setSpecialRequests] = useState("")

    // 선택된 날짜에 따른 이용 가능한 시간대
    const availableTimes = [
        "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
        "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
        "19:00", "19:30", "20:00", "20:30", "21:00"
    ]

    const handleReservation = () => {
        if (!selectedDate || !selectedTime || !customerName || !customerPhone) {
            alert("모든 필수 정보를 입력해주세요.")
            return
        }

        alert(`예약이 완료되었습니다!\n날짜: ${selectedDate.toLocaleDateString('ko-KR')}\n시간: ${selectedTime}\n고객명: ${customerName}`)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-rose-100">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                Re:Member
                            </h1>
                        </div>
                        <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200">
                            예약하기
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* 선택된 가게 정보 */}
                <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg p-4">
                        <div className="flex items-center space-x-3">
                            <MapPin className="w-6 h-6" />
                            <div>
                                <CardTitle className="text-xl">뷰티살롱 로즈가든</CardTitle>
                                <CardDescription className="text-rose-100">
                                    서울시 강남구 테헤란로 123길 45
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-rose-500" />
                                <span>02-1234-5678</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-rose-500" />
                                <span>영업시간: 10:00 - 22:00</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* 날짜 및 시간 선택 */}
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
                                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                    className="rounded-md border border-rose-200 w-full"
                                    classNames={{
                                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                        month: "space-y-4",
                                        caption: "flex justify-center pt-1 relative items-center",
                                        caption_label: "text-sm font-medium text-gray-900",
                                        nav: "space-x-1 flex items-center",
                                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-rose-50 rounded-md",
                                        nav_button_previous: "absolute left-1",
                                        nav_button_next: "absolute right-1",
                                        table: "w-full border-collapse space-y-1",
                                        head_row: "flex",
                                        head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                                        row: "flex w-full mt-2",
                                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-rose-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-rose-50 rounded-md",
                                        day_selected: "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:bg-gradient-to-r hover:from-rose-600 hover:to-pink-600 focus:bg-gradient-to-r focus:from-rose-500 focus:to-pink-500",
                                        day_today: "bg-rose-100 text-rose-900",
                                        day_outside: "text-gray-400 opacity-50",
                                        day_disabled: "text-gray-400 opacity-50",
                                        day_range_middle: "aria-selected:bg-rose-100 aria-selected:text-rose-900",
                                        day_hidden: "invisible",
                                    }}
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
                                        {selectedDate.toLocaleDateString('ko-KR')} 이용 가능한 시간
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

                    {/* 예약 정보 입력 */}
                    <div>
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="w-5 h-5 text-blue-500" />
                                    <span className="text-gray-900">예약 정보</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    예약에 필요한 정보를 입력해주세요
                                </CardDescription>
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

                                {/* 예약 요약 */}
                                {selectedDate && selectedTime && customerName && (
                                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200">
                                        <h4 className="font-semibold text-rose-900 mb-2 flex items-center gap-2">
                                            <Heart className="w-4 h-4" />
                                            예약 요약
                                        </h4>
                                        <div className="space-y-1 text-sm text-rose-800">
                                            <p><strong>날짜:</strong> {selectedDate.toLocaleDateString('ko-KR')}</p>
                                            <p><strong>시간:</strong> {selectedTime}</p>
                                            <p><strong>고객명:</strong> {customerName}</p>
                                            {customerPhone && <p><strong>연락처:</strong> {customerPhone}</p>}
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

                                <p className="text-xs text-gray-500 text-center">
                                    예약 완료 후 확인 문자를 발송해드립니다.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
