import { Page } from "@playwright/test"

class RegisterPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  get pageUrl() {
    return "http://localhost:3000/register"
  }

  get usernameInput() {
    return this.page.locator("input[name=username]")
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

  get minCharacter() {
    return this.page.getByTestId("min-character")
  }

  get containNumber() {
    return this.page.getByTestId("contain-number")
  }

  get containLowercase() {
    return this.page.getByTestId("contain-lowercase")
  }

  get containUppercase() {
    return this.page.getByTestId("contain-uppercase")
  }

  get containSpecialCharacter() {
    return this.page.getByTestId("contain-special-character")
  }
}

export default RegisterPage
