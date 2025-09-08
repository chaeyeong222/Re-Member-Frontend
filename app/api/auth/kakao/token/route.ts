import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { code } = await request.json();

        // 카카오로 보낼 요청 본문
        const requestBody = new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
            redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
            code,
        });

        const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: requestBody,
        });

        // 응답 상태가 ok가 아닐 때, 응답 전문을 출력
        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error("Failed to get access token:", tokenResponse.status, errorText);
            throw new Error("토큰 획득 실패");
        }

        const tokenData = await tokenResponse.json();
        return NextResponse.json({ access_token: tokenData.access_token });

    } catch (error) {
        console.error("Token exchange error:", error);
        return NextResponse.json({ error: "Failed to exchange token" }, { status: 500 });
    }
}
