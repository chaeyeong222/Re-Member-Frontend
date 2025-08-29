"use client"
import { useState, useEffect } from "react"
import { Search, Users, Calendar, Eye, Edit, Trash2, Plus, Heart, Star } from "lucide-react"
import Link from "next/link"

// Define the type for customer data
interface Customer {
  id: number
  name: string
  phone: string
  visitCount: number
  memo: string
  lastVisit: string
  tags: string[]
  joinDate: string
  totalSpent: number
  favoriteService: string
}

// Function to fetch customers from the API
const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch("http://localhost:8090/customer/getCustomers")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: Customer[] = await response.json()
    return data
  } catch (error) {
    console.error("Failed to fetch customers:", error)
    return [] // Return an empty array on error
  }
}

export default function CustomerDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data on component mount
  useEffect(() => {
    const getCustomers = async () => {
      const data = await fetchCustomers()
      setCustomers(data)
      setIsLoading(false)
    }
    getCustomers()
  }, [])

  const filteredCustomers = customers.filter(
      (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phone.includes(searchTerm),
  )

  const totalCustomers = customers.length
  const totalReservations = customers.reduce((sum, customer) => sum + customer.visitCount, 0)

  const getVisitBadgeColor = (count: number) => {
    if (count >= 15) return "bg-rose-100 text-rose-800"
    if (count >= 10) return "bg-amber-100 text-amber-800"
    return "bg-orange-100 text-orange-800"
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
        <div className="container mx-auto p-3 sm:p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl flex items-center justify-center">
                <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Re:Member
              </h1>
            </div>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg ml-10 sm:ml-13">Re:Member 고객관리시스템</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600">총 고객 수</h3>
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-lg">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalCustomers}명</div>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  +2명 이번 주
                </p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600">총 예약 수</h3>
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{totalReservations}회</div>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  +15회 이번 달
                </p>
              </div>
            </div>
          </div>

          {/* Customer Management Section */}
          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg border-0">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500" />
                  소중한 고객 목록
                </h2>
                {/* Search and Add Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="고객명 또는 전화번호로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full px-3 py-2 text-sm border border-rose-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                    />
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-sm rounded-md shadow-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap">
                    <Plus className="h-4 w-4" />
                    고객 추가
                  </button>
                </div>
              </div>

              {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-4 text-gray-600">데이터를 불러오는 중...</span>
                  </div>
              ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                        <tr className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">이름</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">전화번호</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">방문 횟수</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">최근 방문</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">메모</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-rose-50/50 transition-colors border-b border-rose-100/50">
                              <td className="py-3 px-4">
                                <Link
                                    href={`/customer/${customer.id}`}
                                    className="font-medium text-gray-900 hover:text-rose-600 transition-colors cursor-pointer"
                                >
                                  {customer.name}
                                </Link>
                              </td>
                              <td className="py-3 px-4 text-gray-600">{customer.phone}</td>
                              <td className="py-3 px-4">
                            <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVisitBadgeColor(customer.visitCount)}`}
                            >
                              {customer.visitCount}회
                            </span>
                              </td>
                              <td className="py-3 px-4 text-gray-600 text-sm">{customer.lastVisit}</td>
                              <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{customer.memo}</td>
                              <td className="py-3 px-4">
                                <div className="flex justify-center gap-2">
                                  <Link href={`/customer/${customer.id}`}>
                                    <button className="p-1 hover:bg-rose-50 hover:border-rose-300 bg-transparent border border-rose-200 rounded transition-colors">
                                      <Eye className="h-4 w-4 text-rose-600" />
                                      <span className="sr-only">상세보기</span>
                                    </button>
                                  </Link>
                                  <button className="p-1 hover:bg-amber-50 hover:border-amber-300 bg-transparent border border-amber-200 rounded transition-colors">
                                    <Edit className="h-4 w-4 text-amber-600" />
                                    <span className="sr-only">수정</span>
                                  </button>
                                  <button className="p-1 hover:bg-red-50 hover:border-red-300 bg-transparent border border-red-200 rounded transition-colors">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                    <span className="sr-only">삭제</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                      {filteredCustomers.map((customer) => (
                          <Link key={customer.id} href={`/customer/${customer.id}`}>
                            <div className="bg-gradient-to-r from-white to-rose-50/30 rounded-lg border border-rose-100 p-4 hover:shadow-md transition-all cursor-pointer">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg hover:text-rose-600 transition-colors">
                                    {customer.name}
                                  </h3>
                                  <p className="text-gray-600 text-sm">{customer.phone}</p>
                                </div>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVisitBadgeColor(customer.visitCount)}`}
                                >
                                {customer.visitCount}회
                              </span>
                              </div>
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>최근 방문: {customer.lastVisit}</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">{customer.memo}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {customer.tags.slice(0, 2).map((tag, index) => (
                                      <span
                                          key={index}
                                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-700"
                                      >
                                      {tag}
                                    </span>
                                  ))}
                                  {customer.tags.length > 2 && (
                                      <span className="text-xs text-gray-500">+{customer.tags.length - 2}</span>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <button
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                      }}
                                      className="p-2 hover:bg-amber-50 hover:border-amber-300 bg-transparent border border-amber-200 rounded transition-colors"
                                  >
                                    <Edit className="h-4 w-4 text-amber-600" />
                                    <span className="sr-only">수정</span>
                                  </button>
                                  <button
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                      }}
                                      className="p-2 hover:bg-red-50 hover:border-red-300 bg-transparent border border-red-200 rounded transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                    <span className="sr-only">삭제</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </Link>
                      ))}
                    </div>

                    {filteredCustomers.length === 0 && (
                        <div className="text-center py-8">
                          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">검색 결과가 없습니다.</p>
                        </div>
                    )}
                  </>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}