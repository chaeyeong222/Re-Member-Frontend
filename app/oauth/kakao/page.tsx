"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Heart, CheckCircle2, XCircle } from "lucide-react";

export default function KakaoCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("카카오 로그인 처리 중...");

    useEffect(() => {
        const handleKakaoCallback = async () => {
            const code = searchParams.get('code');
            const error = searchParams.get('error');

            // 에러 파라미터가 있으면 로그인 취소로 간주
            if (error) {
                setStatus("error");
                setMessage("로그인이 취소되었습니다. 다시 시도해 주세요.");
                setTimeout(() => router.push("/"), 2000);
                return;
            }

            // code 파라미터가 없으면 비정상적인 접근으로 간주
            if (!code) {
                setStatus("error");
                setMessage("비정상적인 접근입니다. 메인 페이지로 돌아갑니다.");
                setTimeout(() => router.push("/"), 2000);
                return;
            }

            try {
                setMessage("회원 정보를 확인하는 중...");
                const response = await fetch("/api/auth/kakao-login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code }),
                });

                // HTTP 상태 코드에 따라 분기 처리
                if (response.ok) { // HTTP 200 OK (기존 회원)
                    const data = await response.json();

                    // JWT 토큰을 쿠키에 저장
                    // 'store.js'와 같은 유틸리티 파일에 아래 로직을 분리하는 것이 좋습니다.
                    // 예: setCookie('accessToken', data.accessToken);
                    //     setCookie('refreshToken', data.refreshToken);
                    //
                    // 여기서는 설명 목적을 위해 주석 처리합니다.
                    console.log("기존 회원 로그인 성공", data);

                    setStatus("success");
                    setMessage(`로그인 성공! ${data.nickname}님 환영합니다.`);
                    setTimeout(() => router.push("/store"), 1500);

                } else if (response.status === 202) { // HTTP 202 Accepted (신규 회원)
                    const data = await response.json();

                    // 신규 회원 정보를 세션 스토리지에 임시 저장 (가입 페이지에서 사용)
                    sessionStorage.setItem("socialUser", JSON.stringify(data));

                    setStatus("success");
                    setMessage("신규 회원입니다. 추가 정보를 입력해 주세요.");
                    setTimeout(() => router.push("/signup"), 1500);

                } else { // 기타 오류 (4xx, 5xx 등)
                    const errorText = await response.text();
                    throw new Error(`로그인 실패: ${errorText}`);
                }
            } catch (error: any) {
                console.error("로그인 처리 중 오류 발생:", error);
                setStatus("error");
                setMessage(error.message || "로그인 처리 중 오류가 발생했습니다.");
                setTimeout(() => router.push("/"), 3000);
            }
        };

        handleKakaoCallback();
    }, [searchParams, router]);

    // UI 렌더링
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
                    {status === "success" && <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />}
                    {status === "error" && <XCircle className="w-12 h-12 text-red-500 mx-auto" />}
                </div>

                <p className="text-gray-700 text-lg font-medium">{message}</p>
                {status === "error" && <p className="text-sm text-gray-500 mt-4">잠시 후 홈 화면으로 돌아갑니다.</p>}
            </div>
        </div>
    );
}