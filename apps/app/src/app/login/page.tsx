"use client"

import { setCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

import { useSession } from "@/contexts/use-session"
import { trpc } from "@/lib/trpc/client"

export default function LoginPage() {
  const { setToken } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const signInMutation = trpc.auth.signIn.useMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    try {
      const { token } = await signInMutation.mutateAsync({ email, password })
      // Store the token in a cookie (expires in 365 days)
      setCookie("token", token, { maxAge: 365 * 24 * 60 * 60, path: "/" })
      setToken(token)
      router.push("/") // Redirect to home or dashboard as appropriate
    } catch (err) {
      setError((err as Error).message || "Failed to sign in")
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit" disabled={signInMutation.isPending}>
          Login
        </button>
      </form>
      <p>
        Don&apos;t have an account? <a href="/register">Register</a>
      </p>
    </div>
  )
}
