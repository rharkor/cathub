"use client"

import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react"
import Image from "next/image"
import { useEffect, useState } from "react"

export function EasterEgg() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Check if mouse is in top right corner (within 50px of corner)
      const isTopRight = e.clientX > window.innerWidth - 50 && e.clientY < 50

      // Check if Control key is pressed
      if (isTopRight && e.ctrlKey) {
        setIsOpen(true)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <ModalHeader>Oups la boulette</ModalHeader>
        <ModalBody>
          <Image src="/goat.png" alt="Le goat" className="w-full max-w-md rounded-md" width={500} height={375} />
          <Image
            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmM0ZWJ4YTN0ZjIxdmRudmlveXY1M2RkMjJiOGdjMWM3cm9jamtnbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QAgG5sDYr7sbC9tYDB/giphy.gif"
            alt="Oups la boulette"
            className="w-full max-w-md rounded-md"
            width={500}
            height={375}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EasterEgg
