import { expect, Page } from "@playwright/test"
import bcrypt from "bcrypt"

import { GOOD_USERNAME, HOME_PAGE_URL, LOGIN_PAGE_URL, USER_EMAIL, USER_PASSWORD } from "@/lib/constants.tests"
import { prisma } from "@/lib/prisma"

import ProfilePage from "../(protected)/profile/tests/profile-page"
import LoginPage from "../login/tests/login-page"

class DefaultPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async connection() {
    const loginPage = new LoginPage(this.page)
    const hashedPassword = await bcrypt.hash(USER_PASSWORD, 10)

    await prisma.user.upsert({
      where: {
        email: USER_EMAIL,
      },
      update: {
        email: USER_EMAIL,
        password: hashedPassword,
        username: GOOD_USERNAME,
        sex: null,
      },
      create: {
        email: USER_EMAIL,
        password: hashedPassword,
        username: GOOD_USERNAME,
        sex: null,
      },
    })

    await this.page.goto(LOGIN_PAGE_URL)
    await this.page.waitForURL(LOGIN_PAGE_URL)

    await loginPage.emailInput.fill(USER_EMAIL)
    await loginPage.passwordInput.fill(USER_PASSWORD)
    await loginPage.submitButton.click()

    await this.page.waitForURL(HOME_PAGE_URL)
  }

  async goToProfile() {
    const profilePage = new ProfilePage(this.page)
    await this.page.goto(profilePage.pageUrl)
    await expect(this.page).toHaveURL(profilePage.pageUrl)
  }
}

export default DefaultPage
