import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value;
    
    const public_paths = [
        "/", 
        "/auth/login",
        "/auth/register",
        "/products",
        "/store"
    ];

    const url = req.nextUrl.clone();
    const isPublicPath = public_paths.some(path => 
        url.pathname === path || url.pathname.startsWith(path + "/")
    );
    
    if (token && (url.pathname === "/auth/login" || url.pathname === "/auth/register")) {
        url.pathname = "/";
        return NextResponse.redirect(url);
    }
    
    if (!token && !isPublicPath) {
        url.pathname = "/auth/login";
        url.searchParams.set("redirect", req.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/checkout/:path*",
        "/orders/:path*",
        "/profile/:path*",
        "/cart/:path*",
        "/notifications/:path*",
        "/auth/login",
        "/auth/register",
    ],
};

