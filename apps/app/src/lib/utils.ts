import { Category } from "@prisma/client"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

import { fileSchemaMinimal } from "./schemas"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (
  imageFile: Pick<z.infer<ReturnType<typeof fileSchemaMinimal>>, "bucket" | "endpoint" | "key"> | undefined | null
) => {
  if (!imageFile) {
    return imageFile
  }

  const { bucket, endpoint, key } = imageFile
  if (key.startsWith("https://") || key.startsWith("http://")) return key
  return "https://" + bucket + "." + endpoint + "/" + key
}

export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    [Category.KINKY_KITTENS]: "Chatons coquins",
    [Category.TABBY_TEASES]: "Taquineries tigrées",
    [Category.FELINE_FETISH]: "Fétichisme félin",
    [Category.SULTRY_STRAYS]: "Chats errants sensuels",
    [Category.WHISKER_WONDERS]: "Merveilles à moustaches",
  }
  return labels[category] || category
}
