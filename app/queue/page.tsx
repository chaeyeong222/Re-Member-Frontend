"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Clock, Users, MapPin, Phone, X, CheckCircle, Heart, User, LogOut } from "lucide-react"

interface UserInfo {
    id: number
    name: string
    email: string
    storeKey: string
}

interface Store {
    id: number
    name: string
    category: string
    location: string
    phone: string
    image: string
}

interface QueueInfo {
    queueNumber: number
    totalWaiting: number
    estimatedWaitTime: number
    currentServing: number
}

export default function QueueStatusPage() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [store, setStore] = useState<Store | null>(null)
    const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCancelling, setIsCancelling] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const storeId = searchParams.get("storeId")

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem("kakao_token")
        const storeKey = localStorage.getItem("store_key")
        const userInfoStr = localStorage.getItem("user_info")

        if (!token || !storeKey || !userInfoStr) {
            router.push("/")
            return
        }

        if (!storeId) {
            router.push("/stores")
            return
        }

        try {
            const parsedUserInfo = JSON.parse(userInfoStr)
            setUserInfo(parsedUserInfo)
        } catch (error) {
            console.error("Failed to parse user info:", error)
            router.push("/")
            return
        }

        // Mock store and queue data
        const mockStore: Store = {
            id: Number.parseInt(storeId),
            name: "카페 모카",
            category: "카페",
            location: "강남구 역삼동 123-45",
            phone: "02-1234-5678",
            image: "/cozy-cafe-interior.png",
        }

        const mockQueueInfo: QueueInfo = {
            queueNumber: 7,
            totalWaiting: 12,
            estimatedWaitTime: 25,
            currentServing: 3,
        }

        setStore(mockStore)
        setQueueInfo(mockQueueInfo)
        setIsLoading(false)

        // Simulate real-time updates
        const interval = setInterval(() => {
            setQueueInfo((prev) => {
                if (!prev) return prev

                // Randomly update queue status
                const shouldUpdate = Math.random() > 0.7
                if (shouldUpdate && prev.queueNumber > 1) {
                    return {
                        ...prev,
                        queueNumber: prev.queueNumber - 1,
                        totalWaiting: prev.totalWaiting - 1,
                        estimatedWaitTime: Math.max(5, prev.estimatedWaitTime - 3),
                        currentServing: prev.currentServing + 1,
                    }
                }
                return prev
            })
        }, 10000) // Update every 10 seconds

        return () => clearInterval(interval)
    }, [router, storeId])

    const handleLogout = () => {
        localStorage.removeItem("kakao_token")
        localStorage.removeItem("store_key")
        localStorage.removeItem("user_info")
        router.push("/")
    }

    const handleCancelQueue = async () => {
        setIsCancelling(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        alert("대기가 취소되었습니다.")
        router.push("/stores")
    }

    const handleCallStore = () => {
        if (store?.phone) {
            window.location.href = `tel:${store.phone}`
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-4 text-gray-600">로딩 중...</span>
            </div>
        )
    }

    if (!userInfo || !store || !queueInfo) {
        return null
    }

    const isMyTurn = queueInfo.queueNumber <= 1

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
            {/* Top Navigation */}
            <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-rose-100">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-lg flex items-center justify-center">
                                <Heart className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                    Re:Member
                                </h1>
                                <p className="text-xs text-gray-600">대기 현황</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-rose-400 to-pink-400 rounded-md flex items-center justify-center">
                                    <User className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">{userInfo.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <LogOut className="h-3 w-3" />
                                로그아웃
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Store Info */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <img
                            src={store.image || "/placeholder.svg"}
                            alt={store.name}
                            className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                            <h2 className="font-bold text-xl text-gray-900">{store.name}</h2>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {store.location}
                                </div>
                                <button onClick={handleCallStore} className="flex items-center gap-1 text-rose-600 hover:text-rose-700">
                                    <Phone className="h-4 w-4" />
                                    {store.phone}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Queue Status */}
                {isMyTurn ? (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg p-8 mb-6 text-white text-center">
                        <CheckCircle className="h-16 w-16 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">입장 가능합니다!</h3>
                        <p className="text-green-100">매장으로 입장해 주세요.</p>
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-6 text-center">
                        <div className="w-24 h-24 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl font-bold text-white">{queueInfo.queueNumber}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">현재 대기순번</h3>
                        <p className="text-gray-600 mb-6">총 {queueInfo.totalWaiting}명이 대기 중입니다</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-rose-50 rounded-xl p-4">
                                <Clock className="h-6 w-6 text-rose-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">예상 대기시간</p>
                                <p className="text-xl font-bold text-rose-600">{queueInfo.estimatedWaitTime}분</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4">
                                <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">현재 서빙 번호</p>
                                <p className="text-xl font-bold text-blue-600">{queueInfo.currentServing}번</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                {!isMyTurn && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">진행 상황</span>
                            <span className="text-sm font-medium text-gray-600">
                {Math.max(0, queueInfo.totalWaiting - queueInfo.queueNumber + 1)} / {queueInfo.totalWaiting}
              </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-rose-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                                style={{
                                    width: `${Math.max(10, ((queueInfo.totalWaiting - queueInfo.queueNumber + 1) / queueInfo.totalWaiting) * 100)}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => router.push("/stores")}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-200"
                    >
                        다른 가게 찾기
                    </button>

                    <button
                        onClick={handleCancelQueue}
                        disabled={isCancelling}
                        className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:bg-gray-50 disabled:text-gray-400 flex items-center justify-center gap-2"
                    >
                        {isCancelling ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                                취소 중...
                            </>
                        ) : (
                            <>
                                <X className="h-5 w-5" />
                                대기 취소
                            </>
                        )}
                    </button>
                </div>

                {/* Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
                    <p className="text-sm text-yellow-800">
                        <strong>안내:</strong> 대기순번이 되면 알림을 보내드립니다. 매장 사정에 따라 대기시간이 변경될 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    )
}
