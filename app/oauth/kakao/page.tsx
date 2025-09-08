"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Heart } from "lucide-react";

export default function KakaoCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("카카오 로그인 처리 중...");

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code');
            const error = searchParams.get('error');

            if (error) {
                setStatus("error");
                setMessage("로그인이 취소되었습니다.");
                setTimeout(() => router.push("/"), 2000);
                return;
            }

            if (!code) {
                setStatus("error");
                setMessage("인증 코드가 없습니다.");
                setTimeout(() => router.push("/"), 2000);
                return;
            }

            try {
                // 1. 카카오로부터 받은 code로 access token 요청
                setMessage("카카오 사용자 정보를 가져오는 중...");
                const tokenResponse = await fetch("/api/auth/kakao/token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code }),
                });

                if (!tokenResponse.ok) throw new Error("토큰 획득 실패");
                const { access_token } = await tokenResponse.json();

                // 2. access token으로 사용자 정보 요청
                const userResponse = await fetch("/api/auth/kakao/user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ access_token }),
                });

                if (!userResponse.ok) throw new Error("사용자 정보 조회 실패");
                const userData = await userResponse.json();

                // 3. 사용자 ID로 회원 여부 확인
                setMessage("회원 정보를 확인하는 중...");
                const memberCheckResponse = await fetch("/api/auth/check-member", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ kakao_id: userData.id }),
                });

                if (!memberCheckResponse.ok) throw new Error("회원 확인 실패");
                const { isExistingMember } = await memberCheckResponse.json();

                // 4. 회원 상태에 따라 페이지 이동
                if (isExistingMember) {
                    setMessage("로그인 완료! 가게 목록으로 이동합니다.");
                    setTimeout(() => router.push("/store"), 1000);
                } else {
                    setMessage("회원가입 페이지로 이동합니다.");
                    setTimeout(() => router.push("/signup"), 1000);
                }

                setStatus("success");

            } catch (error) {
                console.error("로그인 처리 오류:", error);
                setStatus("error");
                setMessage("로그인 처리 중 오류가 발생했습니다.");
                setTimeout(() => router.push("/"), 3000);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                {/* 로고 및 타이틀 */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Heart className="w-8 h-8 text-rose-500 fill-current" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                        Re:Member
                    </h1>
                </div>

                {/* 상태 아이콘 */}
                <div className="mb-6">
                    {status === "loading" && <Loader2 className="w-12 h-12 text-rose-500 animate-spin mx-auto" />}
                    {status === "success" && (
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* 메시지 */}
                <p className="text-gray-700 text-lg font-medium">{message}</p>
                {status === "error" && <p className="text-sm text-gray-500 mt-4">잠시 후 로그인 페이지로 돌아갑니다.</p>}
            </div>
        </div>
    );
}