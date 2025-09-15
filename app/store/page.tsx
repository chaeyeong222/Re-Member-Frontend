"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Star, Clock, Filter, Heart, User, LogOut } from "lucide-react"

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
    rating: number
    reviewCount: number
    waitTime: number
    image: string
    description: string
    isOpen: boolean
}

export default function StoreSearchPage() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("전체")
    const [stores, setStores] = useState<Store[]>([])
    const router = useRouter()

    const categories = ["전체", "카페", "음식점", "미용실", "병원", "쇼핑", "기타"]

    useEffect(() => {
        // Check authentication
        // const token = localStorage.getItem("kakao_token")
        // const storeKey = localStorage.getItem("store_key")
        const userInfoStr = localStorage.getItem("user_info")

        // if (!token || !storeKey || !userInfoStr) {
        //     router.push("/")
        //     return
        // }

        if(!userInfoStr){
            router.push("/")
            return;
        }

        try {
            const parsedUserInfo = JSON.parse(userInfoStr)
            setUserInfo(parsedUserInfo)
        } catch (error) {
            console.error("Failed to parse user info:", error)
            router.push("/")
            return
        }

        // Mock store data
        setStores([
            {
                id: 1,
                name: "카페 모카",
                category: "카페",
                location: "강남구 역삼동",
                rating: 4.5,
                reviewCount: 128,
                waitTime: 15,
                image: "/cozy-cafe-interior.png",
                description: "아늑한 분위기의 스페셜티 커피 전문점",
                isOpen: true,
            },
            {
                id: 2,
                name: "맛있는 파스타",
                category: "음식점",
                location: "서초구 서초동",
                rating: 4.2,
                reviewCount: 89,
                waitTime: 25,
                image: "/italian-restaurant-pasta.png",
                description: "정통 이탈리안 파스타와 피자 전문점",
                isOpen: true,
            },
            {
                id: 3,
                name: "헤어살롱 블루",
                category: "미용실",
                location: "강남구 신사동",
                rating: 4.8,
                reviewCount: 256,
                waitTime: 45,
                image: "/modern-hair-salon.png",
                description: "트렌디한 헤어 디자인 전문 살롱",
                isOpen: false,
            },
            {
                id: 4,
                name: "스마일 치과",
                category: "병원",
                location: "서초구 방배동",
                rating: 4.6,
                reviewCount: 167,
                waitTime: 30,
                image: "/modern-dental-clinic.png",
                description: "첨단 장비를 갖춘 치과 전문 병원",
                isOpen: true,
            },
        ])

        setIsLoading(false)
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem("kakao_token")
        localStorage.removeItem("store_key")
        localStorage.removeItem("user_info")
        router.push("/")
    }

    const handleReservation = (storeId: number) => {
        router.push(`/queue?storeId=${storeId}`)
    }

    const filteredStores = stores.filter((store) => {
        const matchesSearch =
            store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            store.location.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "전체" || store.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-4 text-gray-600">로딩 중...</span>
            </div>
        )
    }

    if (!userInfo) {
        return null
    }

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
                                <p className="text-xs text-gray-600">가게 찾기</p>
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
                {/* Search and Filter Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
                    <div className="space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="가게명 또는 지역으로 검색하세요"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                        selectedCategory === category
                                            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Store List */}
                <div className="space-y-4">
                    {filteredStores.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
                            <p className="text-gray-500">검색 결과가 없습니다.</p>
                        </div>
                    ) : (
                        filteredStores.map((store) => (
                            <div key={store.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                                <div className="flex">
                                    <img src={store.image || "/placeholder.svg"} alt={store.name} className="w-32 h-32 object-cover" />
                                    <div className="flex-1 p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">{store.name}</h3>
                                                <p className="text-sm text-gray-600">{store.description}</p>
                                            </div>
                                            <div
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    store.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {store.isOpen ? "영업중" : "영업종료"}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                {store.location}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                {store.rating} ({store.reviewCount})
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                대기 {store.waitTime}분
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleReservation(store.id)}
                                            disabled={!store.isOpen}
                                            className={`w-full py-2 px-4 rounded-xl font-medium transition-colors ${
                                                store.isOpen
                                                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600"
                                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            }`}
                                        >
                                            {store.isOpen ? "예약하기" : "영업종료"}
                                        </button>
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
