import { Page } from "@playwright/test"

import { LOGIN_PAGE_URL } from "@/lib/constants.tests"

class LoginPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  get pageUrl() {
    return LOGIN_PAGE_URL
  }

  get emailInput() {
    return this.page.locator("input[name=email]")
  }

  get passwordInput() {
    return this.page.locator("input[name=password]")
  }

  get submitButton() {
    return this.page.locator("button[type=submit]")
  }

  get toastError() {
    return this.page.locator("div.Toastify__toast")
  }
}

export default LoginPage
