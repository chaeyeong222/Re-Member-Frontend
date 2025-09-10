"use client";

import { useEffect, useState } from "react";
// useRouter와 useSearchParams를 next/navigation에서 import하는 대신 브라우저 기본 API를 사용하도록 변경합니다.
// import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Heart } from "lucide-react";

export default function KakaoCallbackPage() {
    // const searchParams = useSearchParams();
    // const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("카카오 로그인 처리 중...");

    useEffect(() => {
        const handleCallback = async () => {
            // window.location.search를 사용하여 URL 파라미터를 직접 파싱합니다.
            const searchParams = new URLSearchParams(window.location.search);
            const code = searchParams.get('code');
            const error = searchParams.get('error');

            if (error) {
                setStatus("error");
                setMessage("로그인이 취소되었습니다. 다시 시도해주세요.");
                // router.push 대신 window.location.href를 사용합니다.
                setTimeout(() => window.location.href = `${window.location.origin}/`, 2000);
                return;
            }

            if (!code) {
                setStatus("error");
                setMessage("인증 코드가 없습니다. 다시 시도해주세요.");
                setTimeout(() => window.location.href = `${window.location.origin}/`, 2000);
                return;
            }

            try {
                setMessage("회원 정보를 확인하는 중...");
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/kakao/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "로그인 처리 중 서버에서 오류가 발생했습니다.");
                }

                const data = await response.json();

                console.log(data);
                if (data.isNewUser) {
                    // 신규 회원 -> 회원가입 페이지로 이동
                    setMessage("환영합니다! 회원가입 페이지로 이동합니다.");
                    sessionStorage.setItem('signupInfo', JSON.stringify({
                        socialId: data.socialId,
                        nickname: data.nickname
                    }));
                    setTimeout(() => window.location.href = `${window.location.origin}/signup`, 1500);

                } else {
                    // 기존 회원 -> 대시보드로 이동
                    setMessage("로그인 완료! 대시보드로 이동합니다.");
                    // JWT를 사용하지 않으므로 쿠키 설정 로직을 제거합니다.
                    // 대신 sessionStorage에 사용자 정보를 저장하여 로그인 상태를 유지합니다.
                    sessionStorage.setItem('socialId', data.socialId);
                    sessionStorage.setItem('nickname', data.nickname);
                    setTimeout(() => window.location.href = `${window.location.origin}/dashboard`, 1500);
                }

                setStatus("success");

            } catch (error: any) {
                console.error("로그인 처리 오류:", error);
                setStatus("error");
                setMessage(error.message || "로그인 처리 중 오류가 발생했습니다.");
                setTimeout(() => window.location.href = `${window.location.origin}/`, 3000);
            }
        };

        handleCallback();
    }, []); // 의존성 배열에서 searchParams와 router를 제거합니다.

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Heart className="w-8 h-8 text-rose-500 fill-current" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                        Re:Member
                    </h1>
                </div>

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

                <p className="text-gray-700 text-lg font-medium">{message}</p>
                {status === "error" && <p className="text-sm text-gray-500 mt-4">잠시 후 로그인 페이지로 돌아갑니다.</p>}
            </div>
        </div>
    );
}

