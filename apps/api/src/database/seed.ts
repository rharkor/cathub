import { hashSync } from "bcrypt"

import { env } from "@/lib/env"
import { prisma } from "@/lib/prisma"
import { Post, Role, Sex } from "@prisma/client"
import { logger } from "@rharkor/logger"

// Import des données mockées prédéfinies
import creatorMockData from "./mock/creator_mock"
import userMockData from "./mock/user_mock"

/**
 * Type pour les données de fichier
 */
type FileData = {
  key: string
  filetype: string
  bucket: string
  endpoint: string
}

/**
 * Fonction pour créer ou récupérer un fichier
 */
const createOrGetFile = async (fileData: FileData) => {
  if (!fileData) return null

  const existingFile = await prisma.file.findUnique({
    where: { key: fileData.key },
  })

  if (existingFile) {
    return existingFile
  }

  return prisma.file.create({
    data: fileData,
  })
}

/**
 * Fonction pour créer des utilisateurs mockés à partir des données prédéfinies
 */
const createMockUsers = async (): Promise<{ idMapping: Map<string, string> }> => {
  logger.info("Création des utilisateurs mockés à partir des données prédéfinies...")

  const allUserData = [...userMockData.usersMock, ...creatorMockData.creatorsMock]
  // Stocke la correspondance entre les anciens IDs (du mock) et les nouveaux IDs (générés par Prisma)
  const idMapping = new Map<string, string>()

  for (const userData of allUserData) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    })

    if (existingUser) {
      // Ajouter à la map de correspondance des IDs
      idMapping.set(userData.id, existingUser.id)
      logger.debug(`Utilisateur déjà existant: ${userData.username}`)
      continue
    }

    // Créer le fichier de profil si nécessaire
    let profilePictureFile = null
    if (userData.profilePicture) {
      profilePictureFile = await createOrGetFile(userData.profilePicture)
    }

    const description = userData.description

    // Créer l'utilisateur (sans spécifier l'ID, laissant Prisma le générer)
    const user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashSync(userData.password, 10), // Hasher le mot de passe
        role: userData.role as Role,
        isCathub: userData.isCathub,
        sex: userData.sex as Sex | null,
        description: description,
        price: userData.price,
        age: userData.age,
        profilePictureId: profilePictureFile?.id || null,
      },
    })

    // Ajouter à la map de correspondance des IDs
    idMapping.set(userData.id, user.id)

    logger.debug(`Utilisateur mock créé: ${user.username}`)
  }

  logger.success(`${idMapping.size} utilisateurs mockés créés ou récupérés avec succès`)
  return { idMapping }
}

/**
 * Fonction pour créer des posts mockés à partir des données prédéfinies
 */
const createMockPosts = async (userIdMapping: Map<string, string>): Promise<Post[]> => {
  logger.info("Création des posts mockés à partir des données prédéfinies...")

  const mockPosts: Post[] = []
  // Stocke la correspondance entre les anciens IDs de posts et les nouveaux
  const postIdMapping = new Map<string, string>()

  for (const postData of creatorMockData.postsMock) {
    // Obtenir le nouvel ID de l'utilisateur
    const newUserId = userIdMapping.get(postData.userId)
    if (!newUserId) {
      logger.warn(`Utilisateur avec l'ID ${postData.userId} non trouvé, post ignoré`)
      continue
    }

    // Vérifier si le post existe déjà (en vérifiant par texte et userId)
    const existingPost = await prisma.post.findFirst({
      where: {
        text: postData.text,
        userId: newUserId,
      },
    })

    if (existingPost) {
      mockPosts.push(existingPost)
      postIdMapping.set(postData.id, existingPost.id)
      logger.debug(`Post déjà existant: '${postData.text.substring(0, 30)}...'`)
      continue
    }

    // Créer le fichier image si nécessaire
    let imageFile = null
    if (postData.image) {
      imageFile = await createOrGetFile(postData.image)
    }

    // Créer le post (sans spécifier l'ID, laissant Prisma le générer)
    const post = await prisma.post.create({
      data: {
        text: postData.text,
        category: postData.category,
        userId: newUserId,
        imageId: imageFile?.id || null,
        createdAt: postData.createdAt,
      },
    })

    postIdMapping.set(postData.id, post.id)
    mockPosts.push(post)
  }

  logger.success(`${mockPosts.length} posts mockés créés ou récupérés avec succès`)
  return mockPosts
}

const main = async () => {
  // Créer l'utilisateur admin s'il n'existe pas
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

  // Créer des données mockées
  try {
    // Vérifier si des données mockées existent déjà
    const mockDataExists = await prisma.user.findFirst({
      where: {
        email: { in: [...userMockData.usersMock, ...creatorMockData.creatorsMock].map((u) => u.email) },
      },
    })

    if (!mockDataExists) {
      logger.info("Création des données mockées...")

      // Créer des utilisateurs mockés
      const { idMapping: userIdMapping } = await createMockUsers()

      // Créer des posts mockés
      await createMockPosts(userIdMapping)

      logger.success("Toutes les données mockées ont été créées avec succès")
    } else {
      logger.info("Des données mockées existent déjà dans la base de données")
    }
  } catch (error) {
    logger.error("Erreur lors de la création des données mockées", error)
  }
}

main()
