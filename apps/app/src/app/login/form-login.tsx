"use client"

import { authSchemas } from "@cathub/api-routes/schemas"
import { Button } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { setCookie } from "cookies-next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import FormField from "@/components/ui/form"
import { useSession } from "@/contexts/use-session"
import { trpc } from "@/lib/trpc/client"

const LoginForm = () => {
  const { setToken } = useSession()
  const router = useRouter()

  const form = useForm<z.infer<ReturnType<typeof authSchemas.signInSchema>>>({
    resolver: zodResolver(authSchemas.signInSchema()),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signInMutation = trpc.auth.signIn.useMutation()

  const handleSubmit = async (data: z.infer<ReturnType<typeof authSchemas.signInSchema>>) => {
    const { token } = await signInMutation.mutateAsync(data)
    // Store the token in a cookie (expires in 365 days)
    setCookie("token", token, { maxAge: 365 * 24 * 60 * 60, path: "/" })
    setToken(token)
    router.push("/") // Redirect to home or dashboard as appropriate
  }

  return (
    <div className="w-full max-w-md rounded-lg bg-secondary p-8 shadow-lg">
      <h1 className="mb-6 text-center text-xl font-medium">Connexion</h1>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <FormField form={form} name="email" type="email" required className="w-full rounded-md" label="Email" />
        <FormField
          form={form}
          name="password"
          type="password"
          required
          className="w-full rounded-md"
          label="Mot de passe"
        />
        <Button type="submit" color="primary" isLoading={signInMutation.isPending} className="w-full">
          {signInMutation.isPending ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-foreground/70">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-primary hover:text-primary-hover">
          S&apos;inscrire
        </Link>
      </p>
      {/* <p className="mt-2 text-center text-sm text-foreground/70">
        Mot de passe oublié ?{" "}
        <Link href="/forgot-password" className="text-primary hover:text-primary-hover">
          Réinitialiser
        </Link>
      </p> */}
    </div>
  )
}

export default LoginForm
