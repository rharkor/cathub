"use client"

import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react"
import { Sex } from "@prisma/client"
import { useEffect, useState } from "react"

import { trpc } from "@/lib/trpc/client"

export default function BasicInfos() {
  const utils = trpc.useUtils()
  const [isOpen, setIsOpen] = useState(false)
  const getAccountQuery = trpc.me.get.useQuery()

  //* Auto display the modal if the user doesnt have a gender
  useEffect(() => {
    if (!getAccountQuery.data?.sex) {
      setIsOpen(true)
    }
  }, [getAccountQuery.data?.sex])
  const isDisimissable = getAccountQuery.data?.sex !== null

  return (
    <>
      <Button onPress={() => setIsOpen(true)} color="primary">
        Update profile
      </Button>
      <Modal
        isOpen={isOpen}
        size="2xl"
        onOpenChange={setIsOpen}
        isDismissable={isDisimissable}
        hideCloseButton={!isDisimissable}
      >
        <ModalContent>
          <ModalHeader>Profile</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
              <div className="grid w-full grid-cols-2 gap-2">
                <Input label="Email" isDisabled value={getAccountQuery.data?.email} />
                <Input
                  label="Nom d'utilisateur"
                  isDisabled={getAccountQuery.isLoading}
                  value={getAccountQuery.data?.username}
                />
                <Select label="Sexe">
                  {Object.values(Sex).map((sex) => (
                    <SelectItem key={sex} value={sex}>
                      {sex === "FEMALE" ? "Female" : sex === "MALE" ? "Male" : "Other"}
                    </SelectItem>
                  ))}
                </Select>
                <Input label="Age" type="number" value={getAccountQuery.data?.age?.toString() ?? ""} />
                <Input
                  label="Prix"
                  type="number"
                  value={getAccountQuery.data?.price?.toString() ?? ""}
                  startContent="$"
                />
                <Input label="Localisation" />
              </div>
              <Textarea label="Description" value={getAccountQuery.data?.description ?? ""} />
              <Checkbox isSelected={getAccountQuery.data?.isCathub ?? false}>Enable profile discovery</Checkbox>
            </div>
          </ModalBody>
          <ModalFooter>
            {isDisimissable && (
              <Button
                variant="flat"
                onPress={() => {
                  setIsOpen(false)
                }}
              >
                Annuler
              </Button>
            )}
            <Button color="primary">Enregistrer</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
