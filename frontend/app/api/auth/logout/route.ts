import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const res = NextResponse.json({ message: "Logged out successfully" });

    res.headers.set(
      "Set-Cookie",
      [
        "token=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 UTC;",
        "username=; Path=/; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 UTC;"
      ].join(", ")
    );

    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
