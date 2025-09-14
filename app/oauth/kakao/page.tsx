// app/oauth/kakao/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2, Heart } from "lucide-react";

export default function KakaoCallbackPage() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("카카오 로그인 처리 중...");

    useEffect(() => {
        const handleCallback = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const code = searchParams.get('code');
            const error = searchParams.get('error');
            console.log("들어오나ㅣㅏㅏㅏ");
            console.log(code);
            if (error) {
                setStatus("error");
                setMessage("로그인이 취소되었습니다. 다시 시도해주세요.");
                setTimeout(() => window.location.href = `${window.location.origin}/`, 2000);
                return;
            }

            if (!code) {
                setStatus("error");
                setMessage("인증 코드가 없습니다. 다시 시도해주세요.");
                setTimeout(() => window.location.href = `${window.location.origin}/`, 2000);
                return;
            }

            // console.log(code);
            try {
                // 1. Next.js API 라우트로 인증 코드를 보내 카카오 토큰을 받습니다. (JSON 형식)
                // setMessage("카카오 토큰을 교환하는 중...");
                // const tokenResponse = await fetch(`/api/auth/kakao`, {
                //     method: "POST",
                //     headers: { "Content-Type": "application/json" },
                //     body: JSON.stringify({ code }),
                // });

                // if (!tokenResponse.ok) {
                //     const errorData = await tokenResponse.json();
                //     throw new Error(errorData.error || "토큰 획득 실패");
                // }
                //
                // const tokenData = await tokenResponse.json();
                // const { access_token } = tokenData;

                // 2. 백엔드(스프링) API로 받은 액세스 토큰을 보내 회원 정보를 확인합니다. (JSON 형식)
                setMessage("회원 정보를 확인하는 중...");
                const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/kakao/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: code }),
                });

                if (!backendResponse.ok) {
                    const errorData = await backendResponse.json();
                    throw new Error(errorData.error || "로그인 처리 중 서버에서 오류가 발생했습니다.");
                }

                const data = await backendResponse.json();


                console.log("서버 응답 데이터:", data);
                console.log(data.isNewUser +"신규?");

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
                    sessionStorage.setItem('socialId', data.socialId);
                    sessionStorage.setItem('nickname', data.nickname);
                    // setTimeout(() => window.location.href = `${window.location.origin}/dashboard`, 1500);
                }

                setStatus("success");

            } catch (error: any) {
                console.error("로그인 처리 오류:", error);
                setStatus("error");
                setMessage(error.message || "로그인 처리 중 오류가 발생했습니다.");
                // setTimeout(() => window.location.href = `${window.location.origin}/`, 3000);
            }
        };

        handleCallback();
    }, []);

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