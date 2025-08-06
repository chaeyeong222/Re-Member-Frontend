"use client"

import { ArrowLeft, Heart, Calendar, Phone, Tag, FileText, Star, Gift, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { use } from "react"

// �� ���� ������ (�����δ� API���� ������ ������)
const customers = [
    {
        id: 1,
        name: "��μ�",
        phone: "010-1234-5678",
        visitCount: 12,
        memo: "VIP ��, ���� �湮�� ��ȣ�ϸ� �׻� ���ǹٸ��� ģ����. Ư���� ��û������ ���� ���� �̸� ������ �ֽô� ��.",
        lastVisit: "2024-01-25",
        tags: ["VIP", "�����", "��õ��"],
        joinDate: "2023-03-15",
        totalSpent: 480000,
        favoriteService: "�����̾� �ɾ�",
        visitHistory: [
            { date: "2024-01-25", service: "�����̾� �ɾ�", amount: 45000, satisfaction: 5 },
            { date: "2024-01-10", service: "�⺻ �ɾ�", amount: 35000, satisfaction: 5 },
            { date: "2023-12-28", service: "�����̾� �ɾ�", amount: 45000, satisfaction: 4 },
            { date: "2023-12-15", service: "����� �ɾ�", amount: 55000, satisfaction: 5 },
        ],
        preferences: ["���� �ð��� ��ȣ", "������ ȯ��", "������ �� ��ȣ"],
        notes: [
            { date: "2024-01-25", note: "���� �湮 �� ���ο� ���� ��õ ����" },
            { date: "2024-01-10", note: "�������� �ſ� ����, ���� ��õ �ǻ� ����" },
            { date: "2023-12-28", note: "���� ������ �߰� ���� �̿�" },
        ],
    },
    {
        id: 2,
        name: "�̿���",
        phone: "010-2345-6789",
        visitCount: 8,
        memo: "�˷����� ���� - Ư�� ��ǰ ��� ����. �ΰ��� �Ǻθ� ������ �־� �׻� ��ġ �׽�Ʈ �� ����.",
        lastVisit: "2024-01-22",
        tags: ["�˷�����", "���ǰ�"],
        joinDate: "2023-06-20",
        totalSpent: 320000,
        favoriteService: "�⺻ �ɾ�",
        visitHistory: [
            { date: "2024-01-22", service: "�⺻ �ɾ�", amount: 35000, satisfaction: 4 },
            { date: "2024-01-05", service: "�⺻ �ɾ�", amount: 35000, satisfaction: 4 },
            { date: "2023-12-20", service: "�⺻ �ɾ�", amount: 35000, satisfaction: 5 },
        ],
        preferences: ["�ڿ� ���� ��ǰ", "��ġ �׽�Ʈ �ʼ�", "���� �ð���"],
        notes: [
            { date: "2024-01-22", note: "���ο� �ڿ� ���� ��ǰ ������ ����" },
            { date: "2024-01-05", note: "�˷����� ���� ����, �����ϰ� ����" },
        ],
    },
    // �ٸ� ���鵵 ����ϰ� �߰�...
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
                    <p className="text-gray-600">���� ã�� �� �����ϴ�.</p>
                    <Link href="/">
                        <Button className="mt-4 bg-gradient-to-r from-rose-500 to-pink-500">���ư���</Button>
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
                            �� ������� ���ư���
                        </Button>
                    </Link>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
                            <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
                            <p className="text-gray-600">�� �� ����</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* �⺻ ���� */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Heart className="h-5 w-5 text-rose-500" />
                                    �⺻ ����
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
                                        <p className="text-sm text-gray-500">������</p>
                                        <p className="text-gray-700">{customer.joinDate}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">�ֱ� �湮</p>
                                        <p className="text-gray-700">{customer.lastVisit}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700">�� �±�</p>
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

                        {/* ��� ���� */}
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <TrendingUp className="h-5 w-5 text-amber-500" />
                                    ��� ����
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
                                        <p className="text-2xl font-bold text-rose-600">{customer.visitCount}</p>
                                        <p className="text-xs text-gray-600">�� �湮 Ƚ��</p>
                                    </div>
                                    <div className="text-center p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                                        <p className="text-2xl font-bold text-amber-600">{averageSatisfaction.toFixed(1)}</p>
                                        <p className="text-xs text-gray-600">��� ������</p>
                                    </div>
                                </div>

                                <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                                    <p className="text-xl font-bold text-emerald-600">?{customer.totalSpent.toLocaleString()}</p>
                                    <p className="text-xs text-gray-600">�� �̿� �ݾ�</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">��ȣ ����</p>
                                    <Badge className="bg-purple-100 text-purple-800">
                                        <Gift className="h-3 w-3 mr-1" />
                                        {customer.favoriteService}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* �� ���� */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* �޸� */}
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-blue-500" />
                                    �� �޸�
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">{customer.memo}</p>
                            </CardContent>
                        </Card>

                        {/* �湮 �̷� */}
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Calendar className="h-5 w-5 text-green-500" />
                                    �ֱ� �湮 �̷�
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

                        {/* �� ��ȣ���� */}
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Heart className="h-5 w-5 text-pink-500" />
                                    �� ��ȣ����
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

                        {/* ��� ��Ʈ */}
                        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-indigo-500" />
                                    ��� ��Ʈ
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
