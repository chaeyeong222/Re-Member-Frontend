"use client"

import { ArrowLeft, Heart, Calendar, Phone, Tag, FileText, Star, Gift, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { use } from "react"

// 고객 더미 데이터 (실제로는 API에서 가져올 데이터)
const customers = [
    {
        id: 1,
        name: "김민수",
        phone: "010-1234-5678",
        visitCount: 12,
        memo: "VIP 고객, 정기 방문을 선호하며 항상 예의바르고 친절함. 특별한 요청사항이 있을 때는 미리 연락을 주시는 편.",
        lastVisit: "2024-01-25",
        tags: ["VIP", "정기고객", "추천인"],
        joinDate: "2023-03-15",
        totalSpent: 480000,
        favoriteService: "프리미엄 케어",
        visitHistory: [
            { date: "2024-01-25", service: "프리미엄 케어", amount: 45000, satisfaction: 5 },
            { date: "2024-01-10", service: "기본 케어", amount: 35000, satisfaction: 5 },
            { date: "2023-12-28", service: "프리미엄 케어", amount: 45000, satisfaction: 4 },
            { date: "2023-12-15", service: "스페셜 케어", amount: 55000, satisfaction: 5 },
        ],
        preferences: ["오후 시간대 선호", "조용한 환경", "따뜻한 차 선호"],
        notes: [
            { date: "2024-01-25", note: "다음 방문 시 새로운 서비스 추천 예정" },
            { date: "2024-01-10", note: "만족도가 매우 높음, 지인 추천 의사 있음" },
            { date: "2023-12-28", note: "연말 선물로 추가 서비스 이용" },
        ],
    },
    {
        id: 2,
        name: "이영희",
        phone: "010-2345-6789",
        visitCount: 8,
        memo: "알레르기 주의 - 특정 제품 사용 금지. 민감한 피부를 가지고 있어 항상 패치 테스트 후 진행.",
        lastVisit: "2024-01-22",
        tags: ["알레르기", "주의고객"],
        joinDate: "2023-06-20",
        totalSpent: 320000,
        favoriteService: "기본 케어",
        visitHistory: [
            { date: "2024-01-22", service: "기본 케어", amount: 35000, satisfaction: 4 },
            { date: "2024-01-05", service: "기본 케어", amount: 35000, satisfaction: 4 },
            { date: "2023-12-20", service: "기본 케어", amount: 35000, satisfaction: 5 },
        ],
        preferences: ["자연 성분 제품", "패치 테스트 필수", "오전 시간대"],
        notes: [
            { date: "2024-01-22", note: "새로운 자연 성분 제품 만족도 높음" },
            { date: "2024-01-05", note: "알레르기 반응 없음, 안전하게 진행" },
        ],
    },
    // 다른 고객들도 비슷하게 추가...
]

interface CustomerDetailProps {
    params: Promise<{ id: string }>
}

export default function CustomerDetail({ params }: CustomerDetailProps) {
    const { id } = use(params)
    const customer = customers.find((c) => c.id === Number.parseInt(id))

    if (!customer) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center">
                <Card className="bg-white/80 backdrop-blur-sm p-8">
                    <p className="text-gray-600">고객을 찾을 수 없습니다.</p>
                    <Link href="/">
                        <Button className="mt-4 bg-gradient-to-r from-rose-500 to-pink-500">돌아가기</Button>
                    </Link>
                </Card>
            </div>
        )
    }

    const averageSatisfaction =
        customer.visitHistory?.reduce((sum, visit) => sum + visit.satisfaction, 0) / (customer.visitHistory?.length || 1)

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
            <div className="container mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/">
                        <Button variant="outline" className="mb-4 border-rose-200 hover:bg-rose-50 bg-transparent">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            고객 목록으로 돌아가기
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
                            <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
                            <p className="text-gray-600">고객 상세 정보</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 기본 정보 */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Heart className="h-5 w-5 text-rose-500" />
                                    기본 정보
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-700">{customer.phone}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">가입일</p>
                                        <p className="text-gray-700">{customer.joinDate}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">최근 방문</p>
                                        <p className="text-gray-700">{customer.lastVisit}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">고객 태그</p>
                                    <div className="flex flex-wrap gap-2">
                                        {customer.tags.map((tag, index) => (
                                            <Badge key={index} className="bg-rose-100 text-rose-800 hover:bg-rose-200">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 통계 정보 */}
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingUp className="h-5 w-5 text-amber-500" />
                                    통계 정보
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
                                        <p className="text-2xl font-bold text-rose-600">{customer.visitCount}</p>
                                        <p className="text-xs text-gray-600">총 방문 횟수</p>
                                    </div>
                                    <div className="text-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                                        <p className="text-2xl font-bold text-amber-600">{averageSatisfaction.toFixed(1)}</p>
                                        <p className="text-xs text-gray-600">평균 만족도</p>
                                    </div>
                                </div>

                                <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                                    <p className="text-xl font-bold text-emerald-600">?{customer.totalSpent.toLocaleString()}</p>
                                    <p className="text-xs text-gray-600">총 이용 금액</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">선호 서비스</p>
                                    <Badge className="bg-purple-100 text-purple-800">
                                        <Gift className="h-3 w-3 mr-1" />
                                        {customer.favoriteService}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 상세 정보 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* 메모 */}
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-blue-500" />
                                    고객 메모
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">{customer.memo}</p>
                            </CardContent>
                        </Card>

                        {/* 방문 이력 */}
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Calendar className="h-5 w-5 text-green-500" />
                                    최근 방문 이력
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {customer.visitHistory?.map((visit, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{visit.service}</p>
                                                <p className="text-sm text-gray-600">{visit.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">?{visit.amount.toLocaleString()}</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3 w-3 ${
                                                                i < visit.satisfaction ? "text-yellow-400 fill-current" : "text-gray-300"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 고객 선호사항 */}
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Heart className="h-5 w-5 text-pink-500" />
                                    고객 선호사항
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {customer.preferences?.map((preference, index) => (
                                        <div key={index} className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg">
                                            <Star className="h-4 w-4 text-pink-500" />
                                            <span className="text-gray-700">{preference}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 상담 노트 */}
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-indigo-500" />
                                    상담 노트
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {customer.notes?.map((note, index) => (
                                        <div key={index} className="border-l-4 border-indigo-200 pl-4 py-2">
                                            <p className="text-gray-700">{note.note}</p>
                                            <p className="text-xs text-gray-500 mt-1">{note.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
