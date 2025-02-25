"use server"
import { cookies } from "next/headers";

export async function storeToken(tokenName:string, tokenValue:string) {
    const cookiesStore =await cookies();
    cookiesStore.set(tokenName, tokenValue);
}

export async function getToken(tokenName:string) {
    const cookiesStore = await cookies();
    return cookiesStore.get(tokenName)?.value || null;
}

export async function deleteToken(tokenName:string) {
    const cookiesStore =await cookies();
    cookiesStore.delete(tokenName);
}
