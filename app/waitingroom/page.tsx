"use client"

import { useState, useEffect } from "react"
import { Heart, Clock, Users, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function QueuePage() {
    const [waitingRank, setWaitingRank] = useState<number>(0) // 초기 대기 순번
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
    const [isLoading, setIsLoading] = useState(false)
    const [queue, setQueue] = useState<string>("")
    const [userId, setUserId] = useState<string>("")

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        setQueue(urlParams.get("queue") || "")
        setUserId(urlParams.get("user_id") || "")
    }, [])

    const fetchWaitingRank = async () => {
        if (!queue || !userId) return

        setIsLoading(true)
        try {
            const queryParam = new URLSearchParams({ queue: queue, user_id: userId })
            const response = await fetch("/api/v1/queue/rank?" + queryParam)
            const data = await response.json()

            if (data.rank < 0) {
                await fetch("/api/v1/queue/touch?" + queryParam)
                setWaitingRank(0)
                setLastUpdated(new Date())

                const newUrl = window.location.origin + window.location.pathname + window.location.search
                window.location.href = newUrl
                return
            }

            setWaitingRank(data.rank)
            setLastUpdated(new Date())
        } catch (error) {
            console.error("대기 순번 조회 실패:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (queue && userId) {
            fetchWaitingRank()

            const interval = setInterval(() => {
                if (queue && userId) {
                    fetchWaitingRank()
                }
            }, 3000)

            return () => clearInterval(interval)
        }
    }, [queue, userId])

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
                    </div>
                </div>

                {/* Queue Content */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white text-center">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <Clock className="h-6 w-6" />
                                <h2 className="text-2xl font-bold">접속량이 많습니다</h2>
                            </div>
                            <p className="text-amber-100">잠시만 기다려주세요</p>
                        </div>

                        {/* Queue Info */}
                        <div className="p-8 text-center space-y-6">
                            {waitingRank > 0 ? (
                                <>
                                    {/* Current Rank */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center gap-2 text-gray-600">
                                            <Users className="h-5 w-5" />
                                            <span className="text-lg">현재 대기 순번</span>
                                        </div>

                                        <div className="relative">
                                            <div className="text-6xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                                {waitingRank}
                                            </div>
                                            <div className="text-lg text-gray-600 mt-2">번째</div>

                                            {isLoading && (
                                                <div className="absolute -top-2 -right-2">
                                                    <RefreshCw className="h-6 w-6 text-rose-500 animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>대기 진행률</span>
                                            <span>대기중</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-3 rounded-full w-0 animate-pulse"></div>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="space-y-3 text-gray-600">
                                        <p className="text-lg">서버의 접속량이 많아 시간이 걸릴 수 있습니다.</p>
                                        <p>페이지를 새로고침하지 마시고 잠시만 기다려주세요.</p>
                                    </div>
                                </>
                            ) : (
                                /* Success State */
                                <div className="space-y-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto">
                                        <Heart className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">대기 완료!</h3>
                                        <p className="text-gray-600">곧 예약 페이지로 이동합니다...</p>
                                    </div>
                                    <div className="w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto"></div>
                                </div>
                            )}

                            {/* Last Updated */}
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500">마지막 업데이트: {lastUpdated.toLocaleTimeString("ko-KR")}</p>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-t border-gray-200">
                            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                대기 중 안내사항
                            </h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• 대기 순번은 3초마다 자동으로 업데이트됩니다</li>
                                <li>• 페이지를 새로고침하면 대기 순번이 초기화될 수 있습니다</li>
                                <li>• 대기가 완료되면 자동으로 예약 페이지로 이동합니다</li>
                                <li>• 문의사항은 고객센터로 연락해주세요</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
