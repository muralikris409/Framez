"use server"
import { cookies } from "next/headers";

export async function storeToken(tokenName: string, tokenValue: string) {
    try {
        const cookiesStore = await cookies();
        if (!cookiesStore) {
            throw new Error("Failed to access the cookies store.");
        }
        cookiesStore.set(tokenName, tokenValue);
    } catch (error) {
        console.error(`Error storing token '${tokenName}':`, error);
        throw new Error(`Failed to store token '${tokenName}'.`);
    }
}

export async function getToken(tokenName: string) {
    try {
        const cookiesStore = await cookies();
        if (!cookiesStore) {
            throw new Error("Failed to access the cookies store.");
        }
        return cookiesStore.get(tokenName)?.value || null;
    } catch (error) {
        console.error(`Error retrieving token '${tokenName}':`, error);
        throw new Error(`Failed to retrieve token '${tokenName}'.`);
    }
}

export async function deleteToken(tokenName: string) {
    try {
        const cookiesStore = await cookies();
        if (!cookiesStore) {
            throw new Error("Failed to access the cookies store.");
        }
        cookiesStore.delete(tokenName);
    } catch (error) {
        console.error(`Error deleting token '${tokenName}':`, error);
        throw new Error(`Failed to delete token '${tokenName}'.`);
    }
}
