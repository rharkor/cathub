"use client"

import { setCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

import { useSession } from "@/contexts/use-session"
import { trpc } from "@/lib/trpc/client"

export default function RegisterPage() {
  const { setToken } = useSession()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const signUpMutation = trpc.auth.signUp.useMutation()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    try {
      const { token } = await signUpMutation.mutateAsync({ username, email, password })
      // Store the token in a cookie (expires in 365 days)
      setCookie("token", token, { maxAge: 365 * 24 * 60 * 60, path: "/" })
      setToken(token)
      router.push("/") // Redirect to home or dashboard as needed
    } catch (err) {
      setError((err as Error).message || "Failed to sign up")
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit" disabled={signUpMutation.isPending}>
          Register
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  )
}
