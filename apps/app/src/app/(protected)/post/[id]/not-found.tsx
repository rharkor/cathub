"use client"

import { Button, Card, CardBody, CardFooter } from "@heroui/react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PostNotFound() {
  return (
    <div className="container mx-auto flex max-w-4xl flex-col items-center justify-center py-16">
      <Card className="w-full">
        <CardBody className="flex flex-col items-center p-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Post introuvable</h1>
          <p className="mb-6 text-lg text-default-500">
            Le post que vous recherchez n&apos;existe pas ou a été supprimé.
          </p>
        </CardBody>
        <CardFooter className="flex justify-center pb-8">
          <Button
            as={Link}
            href="/cathub-profile"
            color="primary"
            variant="flat"
            startContent={<ArrowLeft size={18} />}
          >
            Retour à mon profil
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
