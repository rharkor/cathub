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
      <h1 className="mb-6 text-center">Inscription</h1>
      <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full space-y-2">
          <Input
            label="Nom d'utilisateur:"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-md"
          />
        </div>
        <div className="w-full space-y-2">
          <Input
            label="Email:"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md"
          />
        </div>
        <div className="w-full space-y-2">
          <Input
            label="Mot de passe:"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md"
          />
        </div>
        {error && <div className="text-center text-red-500">{error}</div>}
        <Button type="submit" color="primary" disabled={signUpMutation.isPending} className="w-full">
          {signUpMutation.isPending ? "Inscription..." : "S'inscrire"}
        </Button>
      </Form>
      <p className="text-foreground/70 mt-4 text-center text-sm">
        Déjà un compte ?{" "}
        <Link href="/login" className="hover:text-primary-hover text-primary">
          Se connecter
        </Link>
      </p>
    </div>
  )
}

export default RegisterForm
