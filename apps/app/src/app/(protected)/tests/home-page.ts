import { Locator, Page } from "@playwright/test"

import { HOME_PAGE_URL } from "@/lib/constants.tests"

class HomePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  get pageUrl(): string {
    return HOME_PAGE_URL
  }

  get navbarHeader(): Locator {
    return this.page.getByTestId("navbar-header")
  }
}

export default HomePage
