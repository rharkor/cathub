"use client"

import { Button, Form, Input } from "@heroui/react"
import Link from "next/link"
import React, { useState } from "react"

const FormForgotPassword = () => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (newPassword !== confirmNewPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg bg-secondary p-8 shadow-lg">
      <h1 className="mb-6 text-center text-2xl font-bold text-foreground">Inscription</h1>
      <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full space-y-2">
          <label className="block text-sm font-medium text-foreground">Nouveau mot de passe:</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full rounded-md"
          />
        </div>
        <div className="w-full space-y-2">
          <label className="block text-sm font-medium text-foreground">Confirmer nouveau mot de passe:</label>
          <Input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            className="w-full rounded-md"
          />
        </div>
        {error && <div className="text-center text-sm text-red-500">{error}</div>}
        <Button type="submit" color="primary" className="w-full">
          Réinitialiser mon mot de passe
        </Button>
      </Form>
      <p className="text-foreground/70 mt-4 text-center text-sm">
        Retour à la page de connexion{" "}
        <Link href="/login" className="hover:text-primary-hover text-primary">
          clique ici !
        </Link>
      </p>
    </div>
  )
}

export default FormForgotPassword
