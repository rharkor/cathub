import { expect, test } from "@playwright/test"

import DefaultPage from "@/app/tests/default-page"
import { GOOD_USERNAME, USER_EMAIL } from "@/lib/constants.tests"
import { prisma } from "@/lib/prisma"

import ProfilePage from "./profile-page"

test.beforeEach(async ({ page }) => {
  const defaultPage = new DefaultPage(page)

  await defaultPage.connection()
  await defaultPage.goToProfile()
})

test.describe("Profile page", () => {
  test("user can view all infos", async ({ page }) => {
    const profilePage = new ProfilePage(page)

    await expect(profilePage.avatar).toBeVisible()
    await expect(profilePage.basicinfos).toBeVisible()
    await expect(profilePage.creatorProfile).toBeVisible()
  })

  test("user has good infos", async ({ page }) => {
    const profilePage = new ProfilePage(page)

    await expect(profilePage.basicinfos).toBeVisible()

    await expect(profilePage.basicInfosEmail).toHaveValue(USER_EMAIL)
    await expect(profilePage.basicInfosUsername).toHaveValue(GOOD_USERNAME)
  })

  test("user can create a creator profile", async ({ page }) => {
    const profilePage = new ProfilePage(page)

    await expect(profilePage.creatorProfile).toBeVisible()

    await profilePage.creatorButton.click()
    await page.waitForURL(profilePage.cathubPageUrl)

    await prisma.user.findMany({
      where: {
        username: GOOD_USERNAME,
      },
    })

    await profilePage.cathubProfileModal.waitFor()
    await expect(profilePage.cathubProfileModal).toBeVisible()

    await page.pause()

    await profilePage.sexSelect.click()

    await profilePage.sexSelectValue.first().click()
    await profilePage.cathubProfileModal.getByRole("button", { name: "Enregistrer" }).click()

    await expect(page.getByText("Homme")).toBeVisible()
  })
})
