"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Heart, User, LogOut, Store as StoreIcon } from "lucide-react"

interface UserInfo {
    id: number
    name: string
    email: string
    storeKey: string
}

interface Store {
    storeKey: number
    storeName: string
    address: string
    phone: string | null
    introduction: string
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
        fetchStores(searchQuery);
    };

    const handleLogout = () => {
        localStorage.removeItem("kakao_token")
        localStorage.removeItem("store_key")
        localStorage.removeItem("user_info")
        router.push("/")
    }

    // 예약하기 버튼 클릭 시 대기열 등록
    const handleReservation = async (storeKey: number) => {
        if (!userInfo) {
            router.push("/"); // 유저 정보가 없으면 로그인 페이지로 리다이렉트
            return;
        }

        const userId = userInfo.id;
        const queueName = `store_queue_${storeKey}`; // 가게별 큐 이름 생성 (예: store_queue_1)

        try {
            const response = await fetch(`${apiUrl}/waiting-room?queue=${queueName}&user_id=${userId}`);

            if (!response.ok) {
                throw new Error("Failed to register for waiting queue");
            }

            const data = await response.json();

            // 응답 데이터에서 rank를 확인하여 페이지 이동 결정
            if (data.number === 0) {
                // 대기 순번이 0이면, 바로 예약 페이지로 이동
                // 백엔드 로직에 따라 랭크 0은 바로 예약 가능한 상태를 의미
                router.push(`/booking?storeKey=${storeKey}`);
            } else {
                // 대기 순번이 0이 아니면, 대기열 페이지로 이동
                // 필요한 경우 대기 순번 정보를 쿼리 파라미터로 넘겨줄 수 있음
                router.push(`/waiting-room?queue=${queueName}&userId=${userId}`);
            }

        } catch (error) {
            console.error("Error during reservation process:", error);
            // 에러 발생 시, 사용자에게 알림을 제공하거나 특정 페이지로 리다이렉트
            alert("예약 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

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
                                        <h3 className="font-bold text-lg text-gray-900">{store.storeName}</h3>
                                        <p className="text-sm text-gray-600">{store.introduction}</p>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {store.address}
                                        </div>
                                    </div>

                                    {/* 가게 번호 추가 */}
                                    {store.phone && (
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="font-semibold text-gray-800">전화번호:</span>
                                            {store.phone}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => handleReservation(store.storeKey)}
                                        className={`w-full py-2 px-4 rounded-xl font-medium transition-colors bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600`}
                                    >
                                        예약하기
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