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
      <h1 className="mb-6 text-center">Inscription</h1>
      <Form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full space-y-2">
          <Input
            label="Nouveau mot de passe:"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full rounded-md"
          />
        </div>
        <div className="w-full space-y-2">
          <Input
            label="Confirmer nouveau mot de passe:"
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
      <p className="mt-4 text-center">
        Retour à la page de connexion{" "}
        <Link href="/login" className="text-primary hover:text-primary-hover">
          clique ici !
        </Link>
      </p>
    </div>
  )
}

export default FormForgotPassword
