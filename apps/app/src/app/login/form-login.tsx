"use client"

import { Button, Form, Input } from "@heroui/react"
import { setCookie } from "cookies-next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

import { useSession } from "@/contexts/use-session"
import { trpc } from "@/lib/trpc/client"

const LoginForm = () => {
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
    <div className="w-full max-w-md rounded-lg bg-secondary p-8 shadow-lg">
      <h1 className="mb-6 text-center">Connexion</h1>
      <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full space-y-2">
          <label className="block">Email:</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md"
          />
        </div>
        <div className="w-full space-y-2">
          <label className="block">Mot de passe:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md"
          />
        </div>
        {error && <div className="text-center text-sm text-red-500">{error}</div>}
        <Button type="submit" color="primary" disabled={signInMutation.isPending} className="w-full">
          {signInMutation.isPending ? "Connexion..." : "Se connecter"}
        </Button>
      </Form>
      <p className="text-foreground/70 mt-4 text-center text-sm">
        Pas encore de compte ?{" "}
        <Link href="/register" className="hover:text-primary-hover text-primary">
          S&apos;inscrire
        </Link>
      </p>
      <p className="text-foreground/70 mt-4 text-center text-sm">
        Mot de passe oublié ?{" "}
        <Link href="/forgot-password" className="hover:text-primary-hover text-primary">
          Réinitialiser
        </Link>
      </p>
    </div>
  )
}

export default LoginForm
