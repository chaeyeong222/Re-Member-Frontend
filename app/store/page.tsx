"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Heart, User, LogOut, Store as StoreIcon } from "lucide-react"

interface UserInfo {
    userId : number
    socialId: string
    name: string
    email: string
    storeKey: string | null // storeKey가 없을 수도 있으므로 null 타입을 추가했습니다.
}

interface Store {
    storeKey: string
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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

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

    const handleReservation = async (storeKey: string) => {
        if (!userInfo) {
            alert("로그인이 필요합니다.");
            router.push("/");
            return;
        }

        try {
            const queue = `store_queue_${storeKey}`;
            const userId = sessionStorage.getItem("userKey");

            console.log(userId+"현재사용자");
            const checkStatusUrl = `${apiUrl}/enter/checkStatus?queue=${queue}&user_id=${userId}`;
            const response = await fetch(checkStatusUrl);

            if (!response.ok) {
                throw new Error("Failed to check user status");
            }

            const data = await response.json();

            // 응답 데이터의 `isAllowed`와 `redirectUrl`에 따라 페이지를 이동
            if (data.isAllowed) {
                // `isAllowed`가 true일 경우: 바로 예약 페이지로 이동
                router.push(`/booking?storeKey=${storeKey}`);
            } else {
                // `isAllowed`가 false일 경우: 백엔드에서 제공한 대기열 페이지로 이동
                router.push(data.redirectUrl);
            }

        } catch (error) {
            console.error("예약 처리 중 오류 발생:", error);
            alert("예약 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    }

    const handleRegisterStore = async () => {

        if (!userInfo) {
            alert("로그인이 필요합니다.");
            router.push("/");
            return;
        }
        // 객체에서 socialId와 nickname 값 추출
        const socialIdStr = String(userInfo.socialId);
        try {
            // 백엔드 API를 호출하여 해당 socialId로 등록된 가게가 있는지 확인
            const response = await fetch(`${apiUrl}/store/getStore/${encodeURIComponent(socialIdStr)}`);

            if (response.ok) {
                // HTTP 200 OK: 이미 등록된 가게가 있음
                const storeData = await response.json();
                localStorage.setItem("store_key", storeData.storeKey);

                setUserInfo(prev => prev ? { ...prev, storeKey: storeData.storeKey } : prev);

                alert("이미 등록된 가게가 있어 고객 관리 페이지로 이동합니다.");
                router.push("/dashboard");
            } else if (response.status === 404) {
                // HTTP 404 NOT_FOUND: 등록된 가게가 없음
                alert("아직 등록된 가게가 없습니다. 가게 등록 페이지로 이동합니다.");
                router.push("/store/register");
            } else {
                // 그 외 오류
                throw new Error(`Failed to check store status with status: ${response.status}`);
            }
        } catch (error) {
            console.error("가게 등록 상태 확인 중 오류 발생:", error);
            alert("가게 등록 상태 확인 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    const handleManageStore = () => {
        router.push("/dash") // dash/page.tsx로 연결
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
                            {/* 조건부 렌더링 시작 */}
                            {userInfo.storeKey ? (
                                <button
                                    onClick={handleManageStore}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-md hover:from-rose-600 hover:to-pink-600 transition-colors"
                                >
                                    <StoreIcon className="h-4 w-4" />
                                    내 가게 관리하기
                                </button>
                            ) : (
                                <button
                                    onClick={handleRegisterStore}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-md hover:from-rose-600 hover:to-pink-600 transition-colors"
                                >
                                    <StoreIcon className="h-4 w-4" />
                                    내 가게 등록하기
                                </button>
                            )}
                            {/* 조건부 렌더링 끝 */}
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