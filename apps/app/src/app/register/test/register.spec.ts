import { expect, test } from "@playwright/test"

import { prisma } from "@/lib/prisma"

import RegisterPage from "./RegisterPage"

test.beforeAll(async () => {
  await prisma.user.deleteMany({
    where: {
      email: "hellokitty@gmail.com",
    },
  })
})

test.describe("user can signup", () => {
  test("user can sign up", async ({ page }) => {
    const registerPage = new RegisterPage(page)

    await page.goto(registerPage.pageUrl)
    await page.waitForURL(registerPage.pageUrl)

    await registerPage.usernameInput.fill("Hello Kitty")
    await registerPage.emailInput.fill("hellokitty@gmail.com")
    await registerPage.passwordInput.fill("Hellokittybg33!")
    await registerPage.submitButton.click()

    await page.waitForURL("http://localhost:3000/")
    await expect(page).toHaveURL("http://localhost:3000/")
  })

  test("user can't sign up, user already exist", async ({ page }) => {
    const registerPage = new RegisterPage(page)

    await page.goto(registerPage.pageUrl)
    await page.waitForURL(registerPage.pageUrl)

    await registerPage.usernameInput.fill("Hello Kitty")
    await registerPage.emailInput.fill("hellokitty@gmail.com")
    await registerPage.passwordInput.fill("Hellokittybg33!")
    await registerPage.submitButton.click()

    await registerPage.toastError.waitFor()
    await expect(registerPage.toastError).toBeVisible()

    await page.waitForURL("http://localhost:3000/register")
    await expect(page).toHaveURL("http://localhost:3000/register")
  })

  test("user can't sign up, invalid credentials", async ({ page }) => {
    const registerPage = new RegisterPage(page)

    await page.goto(registerPage.pageUrl)
    await page.waitForURL(registerPage.pageUrl)

    await registerPage.usernameInput.fill("Hello Kitty")
    await registerPage.emailInput.fill("hellokitty@gmail.com")
    await registerPage.passwordInput.fill("hello")

    await expect(registerPage.minCharacter).not.toBeChecked()
    await expect(registerPage.containNumber).not.toBeChecked()
    await expect(registerPage.containLowercase).toBeChecked()
    await expect(registerPage.containUppercase).not.toBeChecked()
    await expect(registerPage.containSpecialCharacter).not.toBeChecked()
  })
})
