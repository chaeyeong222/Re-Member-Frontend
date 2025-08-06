"use client"

import { useState } from "react"
import { Search, Users, Calendar, Eye, Edit, Trash2, Plus, Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// 확장된 더미 고객 데이터
const customers = [
  {
    id: 1,
    name: "김민수",
    phone: "010-1234-5678",
    visitCount: 12,
    memo: "VIP 고객, 정기 방문",
    lastVisit: "2024-01-25",
    tags: ["VIP", "정기고객", "추천인"],
    joinDate: "2023-03-15",
    totalSpent: 480000,
    favoriteService: "프리미엄 케어",
  },
  {
    id: 2,
    name: "이영희",
    phone: "010-2345-6789",
    visitCount: 8,
    memo: "알레르기 주의 - 특정 제품 사용 금지",
    lastVisit: "2024-01-22",
    tags: ["알레르기", "주의고객"],
    joinDate: "2023-06-20",
    totalSpent: 320000,
    favoriteService: "기본 케어",
  },
  {
    id: 3,
    name: "박철수",
    phone: "010-3456-7890",
    visitCount: 15,
    memo: "단골 고객, 항상 만족도 높음",
    lastVisit: "2024-01-28",
    tags: ["단골", "만족고객", "추천인"],
    joinDate: "2022-11-10",
    totalSpent: 750000,
    favoriteService: "스페셜 케어",
  },
  {
    id: 4,
    name: "정수진",
    phone: "010-4567-8901",
    visitCount: 3,
    memo: "신규 고객, 서비스에 관심 많음",
    lastVisit: "2024-01-20",
    tags: ["신규고객", "관심고객"],
    joinDate: "2024-01-05",
    totalSpent: 150000,
    favoriteService: "체험 케어",
  },
  {
    id: 5,
    name: "최동훈",
    phone: "010-5678-9012",
    visitCount: 7,
    memo: "예약 변경을 자주 하지만 충성도 높음",
    lastVisit: "2024-01-24",
    tags: ["변경빈번", "충성고객"],
    joinDate: "2023-08-12",
    totalSpent: 280000,
    favoriteService: "기본 케어",
  },
  {
    id: 6,
    name: "한소영",
    phone: "010-6789-0123",
    visitCount: 20,
    memo: "장기 고객, 지인 추천을 많이 해주심",
    lastVisit: "2024-01-26",
    tags: ["장기고객", "추천왕", "VIP"],
    joinDate: "2022-05-08",
    totalSpent: 1200000,
    favoriteService: "프리미엄 케어",
  },
]

export default function CustomerDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter(
      (customer) => customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phone.includes(searchTerm),
  )

  const totalCustomers = customers.length
  const totalReservations = customers.reduce((sum, customer) => sum + customer.visitCount, 0)

  const getVisitBadgeColor = (count: number) => {
    if (count >= 15) return "bg-rose-100 text-rose-800 hover:bg-rose-200"
    if (count >= 10) return "bg-amber-100 text-amber-800 hover:bg-amber-200"
    return "bg-orange-100 text-orange-800 hover:bg-orange-200"
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Re:Member
              </h1>
            </div>
            <p className="text-gray-600 text-lg ml-13">따뜻한 고객 관리 시스템</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">총 고객 수</CardTitle>
                <div className="p-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{totalCustomers}명</div>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  +2명 이번 주
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">총 예약 수</CardTitle>
                <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{totalReservations}회</div>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  +15회 이번 달
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Customer Management Section */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  소중한 고객 목록
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="고객명 또는 전화번호로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64 border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    고객 추가
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-100">
                      <TableHead className="font-semibold text-gray-700">이름</TableHead>
                      <TableHead className="font-semibold text-gray-700">전화번호</TableHead>
                      <TableHead className="font-semibold text-gray-700">방문 횟수</TableHead>
                      <TableHead className="font-semibold text-gray-700">최근 방문</TableHead>
                      <TableHead className="font-semibold text-gray-700">메모</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id} className="hover:bg-rose-50/50 transition-colors border-rose-100/50">
                          <TableCell className="font-medium text-gray-900">{customer.name}</TableCell>
                          <TableCell className="text-gray-600">{customer.phone}</TableCell>
                          <TableCell>
                            <Badge className={getVisitBadgeColor(customer.visitCount)}>{customer.visitCount}회</Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">{customer.lastVisit}</TableCell>
                          <TableCell className="text-gray-600 max-w-xs truncate">{customer.memo}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Link href={`/customer/${customer.id}`}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-rose-50 hover:border-rose-300 bg-transparent border-rose-200"
                                >
                                  <Eye className="h-4 w-4 text-rose-600" />
                                  <span className="sr-only">상세보기</span>
                                </Button>
                              </Link>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-amber-50 hover:border-amber-300 bg-transparent border-amber-200"
                              >
                                <Edit className="h-4 w-4 text-amber-600" />
                                <span className="sr-only">수정</span>
                              </Button>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300 bg-transparent border-red-200"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                                <span className="sr-only">삭제</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredCustomers.length === 0 && (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">검색 결과가 없습니다.</p>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
