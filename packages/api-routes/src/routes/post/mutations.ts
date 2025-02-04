import { apiInputFromSchema } from "@/lib/types";
import { postSchema } from "./schemas";
import { prisma } from "@/lib/prisma";

export async function createPost({ input }: apiInputFromSchema<typeof postSchema>) {

}
