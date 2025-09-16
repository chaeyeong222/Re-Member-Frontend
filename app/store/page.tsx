"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Star, Clock, Heart, User, LogOut, Store as StoreIcon } from "lucide-react"

interface UserInfo {
    // storeKey: number
    id: number
    name: string
    email: string
    storeKey: string
}

interface Store {
    storeKey: number
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
    const [stores, setStores] = useState<Store[]>([])
    const router = useRouter()

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    useEffect(() => {
        const userInfoStr = localStorage.getItem("user_info")

        if (!userInfoStr) {
            router.push("/")
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

        // 컴포넌트 로드 시 전체 가게 목록을 불러옵니다.
        fetchStores("");
    }, [router]);

    const fetchStores = async (query: string) => {
        setIsLoading(true);
        try {
            const url = query ?
                `${apiUrl}/store/findStore?storeName=${encodeURIComponent(query)}` :
                `${apiUrl}/store/getStoreList`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch stores");
            }
            const data = await response.json();
            setStores(data);
        } catch (error) {
            console.error("Error fetching stores:", error);
            setStores([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        // 검색 버튼 클릭 시 검색어를 기반으로 fetchStores 함수 호출
        fetchStores(searchQuery);
    };

    const handleLogout = () => {
        localStorage.removeItem("kakao_token")
        localStorage.removeItem("store_key")
        localStorage.removeItem("user_info")
        router.push("/")
    }

    const handleReservation = (storeKey: number) => {
        router.push(`/queue?storeKey=${storeKey}`)
    }

    const handleRegisterStore = () => {
        router.push("/store/register")
    }

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
                            <button
                                onClick={handleRegisterStore}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-md hover:from-rose-600 hover:to-pink-600 transition-colors"
                            >
                                <StoreIcon className="h-4 w-4" />
                                내 가게 등록하기
                            </button>
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
                {/* Search Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
                    <div className="relative flex items-center">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="가게명으로 검색하세요"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                            className="w-full pl-10 pr-24 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:from-rose-600 hover:to-pink-600 transition-colors"
                        >
                            검색
                        </button>
                    </div>
                </div>

                {/* Store List */}
                <div className="space-y-4">
                    {stores.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
                            <p className="text-gray-500">검색 결과가 없습니다.</p>
                        </div>
                    ) : (
                        stores.map((store) => (
                            <div key={store.storeKey} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden p-4">
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{store.name}</h3>
                                        <p className="text-sm text-gray-600">{store.description}</p>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600">
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
                                        onClick={() => handleReservation(store.storeKey)}
                                        disabled={!store.isOpen}
                                        className={`w-full py-2 px-4 rounded-xl font-medium transition-colors ${
                                            store.isOpen
                                                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600"
                                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        {store.isOpen ? "예약하기" : "예약 불가"}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}