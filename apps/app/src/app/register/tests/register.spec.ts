import { expect, test } from "@playwright/test"

import HomePage from "@/app/(protected)/tests/home-page"
import { BAD_PASSWORD, GOOD_USERNAME, USER_ALREADY_EXISTS, USER_EMAIL, USER_PASSWORD } from "@/lib/constants.tests"
import { prisma } from "@/lib/prisma"

import RegisterPage from "./register-page"

test.beforeAll(async () => {
  await prisma.user.deleteMany({
    where: {
      email: USER_EMAIL,
    },
  })
})

test.describe("register page", () => {
  test("user can sign up", async ({ page }) => {
    const registerPage = new RegisterPage(page)
    const homePage = new HomePage(page)

    await page.goto(registerPage.pageUrl)
    await page.waitForURL(registerPage.pageUrl)

    await registerPage.usernameInput.fill(GOOD_USERNAME)
    await registerPage.emailInput.fill(USER_EMAIL)
    await registerPage.passwordInput.fill(USER_PASSWORD)
    await registerPage.submitButton.click()

    await page.waitForURL(homePage.pageUrl)
    await expect(page).toHaveURL(homePage.pageUrl)
  })

  test("user can't sign up, user already exist", async ({ page }) => {
    const registerPage = new RegisterPage(page)

    await page.goto(registerPage.pageUrl)
    await page.waitForURL(registerPage.pageUrl)

    await registerPage.usernameInput.fill(GOOD_USERNAME)
    await registerPage.emailInput.fill(USER_EMAIL)
    await registerPage.passwordInput.fill(USER_PASSWORD)
    await registerPage.submitButton.click()

    await registerPage.toastError.waitFor()
    await expect(registerPage.toastError).toBeVisible()
    await expect(registerPage.toastError).toHaveText(USER_ALREADY_EXISTS)

    await page.waitForURL(registerPage.pageUrl)
    await expect(page).toHaveURL(registerPage.pageUrl)
  })

  test("user can't sign up, invalid credentials", async ({ page }) => {
    const registerPage = new RegisterPage(page)

    await page.goto(registerPage.pageUrl)
    await page.waitForURL(registerPage.pageUrl)

    await registerPage.usernameInput.fill(GOOD_USERNAME)
    await registerPage.emailInput.fill(USER_EMAIL)
    await registerPage.passwordInput.fill(BAD_PASSWORD)

    await expect(registerPage.minCharacter).not.toBeChecked()
    await expect(registerPage.containNumber).not.toBeChecked()
    await expect(registerPage.containLowercase).toBeChecked()
    await expect(registerPage.containUppercase).not.toBeChecked()
    await expect(registerPage.containSpecialCharacter).not.toBeChecked()
  })
})
