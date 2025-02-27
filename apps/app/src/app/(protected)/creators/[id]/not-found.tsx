"use client"

import { Button, Card, CardBody, CardFooter } from "@heroui/react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreatorNotFound() {
  return (
    <div className="container mx-auto flex max-w-4xl flex-col items-center justify-center py-16">
      <Card className="w-full">
        <CardBody className="flex flex-col items-center p-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Créateur introuvable</h1>
          <p className="mb-6 text-lg text-default-500">
            Le créateur que vous recherchez n&apos;existe pas ou a désactivé son profil.
          </p>
        </CardBody>
        <CardFooter className="flex justify-center pb-8">
          <Button as={Link} href="/creators" color="primary" variant="flat" startContent={<ArrowLeft size={18} />}>
            Retour à la liste des créateurs
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
