import { Token } from "@/types"

const BASE_URL = `http://localhost:8000/articles`

export const tokenService = {
    getToken:async (username:string, password:string):Promise<Token> => {
        const res = await fetch(`${BASE_URL}/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        });
        if (!res.ok) throw new Error("Token não recebido com sucesso.");
        return res.json();
    },

    getNewToken: async(refreshToken:string):Promise<Token> => {
        const res = await fetch(`${BASE_URL}/token/refresh/`, {
        method: "POST", 
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
        })
        if (!res.ok) throw new Error("Token não recebido com sucesso.");
        return res.json();
    }
}