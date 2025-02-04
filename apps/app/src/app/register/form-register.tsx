"use client"

import { Button, Form, Input } from "@heroui/react"
import { setCookie } from "cookies-next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

import { useSession } from "@/contexts/use-session"
import { trpc } from "@/lib/trpc/client"

const RegisterForm = () => {
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
    <div className="w-full max-w-md rounded-lg bg-secondary p-8 shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold text-foreground">Inscription</h1>
      <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full space-y-2">
          <label className="block text-sm font-medium text-foreground">Nom d&apos;utilisateur:</label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-md"
          />
        </div>
        <div className="w-full space-y-2">
          <label className="block text-sm font-medium text-foreground">Email:</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md"
          />
        </div>
        <div className="w-full space-y-2">
          <label className="block text-sm font-medium text-foreground">Mot de passe:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md"
          />
        </div>
        {error && <div className="text-center text-sm text-red-500">{error}</div>}
        <Button type="submit" color="primary" disabled={signUpMutation.isPending} className="w-full">
          {signUpMutation.isPending ? "Inscription..." : "S'inscrire"}
        </Button>
      </Form>
      <p className="mt-4 text-center text-sm text-foreground/70">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-primary hover:text-primary-hover">
          Se connecter
        </Link>
      </p>
    </div>
  )
}

export default RegisterForm
