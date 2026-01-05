import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const publicPaths = ["/", "/login"];
    if (publicPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    const session = await getServerSession(authConfig);

    if (!session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/home/:path*",
    ],
};
