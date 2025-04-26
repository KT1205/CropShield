import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export function getUserIdFromRequest(req: Request): string | null {
  try {
    // Read token from cookies
    const token = cookies().get("token")?.value;
    if (!token) return null;

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return decoded.id; // Ensure this matches what was set in login
  } catch (error) {
    return null;
  }
}
