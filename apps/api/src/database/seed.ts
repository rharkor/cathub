import { env } from "@/lib/env"
import { prisma } from "@/lib/prisma"
import { logger } from "@rharkor/logger"

const main = async () => {
  const existingAdmin = await prisma.user.findFirst({
    where: {
      email: env.ADMIN_EMAIL,
    },
  })

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: env.ADMIN_EMAIL,
        username: "admin",
        password: env.ADMIN_PASSWORD,
        role: "ADMIN",
      },
    })
    logger.success("Admin user created successfully")
  } else {
    logger.debug("Admin user already exists")
  }
}

main()
