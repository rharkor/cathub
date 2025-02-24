import { expect, test } from "@playwright/test"


// test.beforeAll(async ({ page }) => {
// todo: delete the user
//   await server
// })

test.describe("user can signup and login", () => {
  test("user can sign up", async ({ page }) => {
    await page.goto("http://localhost:3000/register")

    await expect(page).toHaveURL(/register/)

    const usernameInput = page.locator("input[name=username]")
    await usernameInput.fill("Hello Kitty")

    const emailInput = page.locator("input[name=email]")
    await emailInput.fill("hellokitty@gmail.com")

    const passwordInput = page.locator("input[name=password]")
    await passwordInput.fill("Hellokittybg33!")

    await page.locator("button[type=submit]").click()

    await expect(page).toHaveURL("http://localhost:3000/")
  })

  //todo : création non possible

  //todo : connexion non possible

  //todo : connexion possible
})
