"use client"

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
import { env } from "@/lib/env"
import { trpc } from "@/lib/trpc/client"

// Schéma étendu avec confirmation de mot de passe
const registerSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const { setToken } = useSession()
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const signUpMutation = trpc.auth.signUp.useMutation()

  const handleSubmit = async (data: RegisterFormValues) => {
    // Envoyer seulement les champs nécessaires à l'API
    const { username, email, password } = data;
    
    const { token } = await signUpMutation.mutateAsync({
      username,
      email,
      password,
    })
    
    // Store the token in a cookie (expires in 365 days)
    setCookie("token", token, {
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
      secure: env.NEXT_PUBLIC_ENV === "production",
      domain: env.NEXT_PUBLIC_DOMAIN_COOKIES,
    })
    setToken(token)
    router.push("/") // Redirect to home or dashboard as needed
  }

  return (
    <div className="w-full max-w-md rounded-lg bg-secondary p-8 shadow-lg">
      <h1 className="mb-4 text-center text-2xl font-medium">Inscription</h1>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <div className="w-full space-y-2">
          <FormField form={form} name="username" type="text" label="Nom d'utilisateur" autoComplete="none" required />
        </div>
        <div className="w-full space-y-2">
          <FormField form={form} name="email" autoComplete="username" type="email" label="Email" required />
        </div>
        <div className="w-full space-y-2">
          <FormField
            form={form}
            name="password"
            passwordStrength
            type="password-eye-slash"
            label="Mot de passe"
            required
          />
        </div>
        <div className="w-full space-y-2">
          <FormField
            form={form}
            name="confirmPassword"
            type="password-eye-slash"
            label="Confirmer le mot de passe"
            required
          />
        </div>
        <Button type="submit" color="primary" isLoading={signUpMutation.isPending} className="w-full">
          {signUpMutation.isPending ? "Inscription..." : "S'inscrire"}
        </Button>
      </form>
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
