import { expect, test } from "@playwright/test"

import { BAD_PASSWORD, INVALID_CREDENTIALS, USER_EMAIL, USER_PASSWORD } from "@/lib/constants.tests"

import HomePage from "../../(protected)/tests/home-page"
import LoginPage from "./login-page"

test.describe("Login page", () => {
  test("not logged user can navigate to home", async ({ page }) => {
    const homePage = new HomePage(page)

    await page.goto(homePage.pageUrl)
    await page.waitForURL(homePage.pageUrl)
    await expect(page).toHaveURL(homePage.pageUrl)
  })

  test("user can login", async ({ page }) => {
    const loginPage = new LoginPage(page)
    const homePage = new HomePage(page)

    await page.goto(loginPage.pageUrl)
    await page.waitForURL(loginPage.pageUrl)

    await loginPage.emailInput.fill(USER_EMAIL)
    await loginPage.passwordInput.fill(USER_PASSWORD)
    await loginPage.submitButton.click()

    await page.waitForURL(homePage.pageUrl)
    await expect(page).toHaveURL(homePage.pageUrl)
  })

  test("user can't login because of bad credentials", async ({ page }) => {
    const loginPage = new LoginPage(page)

    await page.goto(loginPage.pageUrl)
    await page.waitForURL(loginPage.pageUrl)

    await loginPage.emailInput.fill(USER_EMAIL)
    await loginPage.passwordInput.fill(BAD_PASSWORD)
    await loginPage.submitButton.click()

    await loginPage.toastError.waitFor()
    await expect(loginPage.toastError).toBeVisible()
    await expect(loginPage.toastError).toHaveText(INVALID_CREDENTIALS)
  })
})
