import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "deskly_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30;

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET no está configurado");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(accountId: string): Promise<string> {
  return new SignJWT({ accountId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.accountId === "string" ? payload.accountId : null;
  } catch {
    return null;
  }
}
