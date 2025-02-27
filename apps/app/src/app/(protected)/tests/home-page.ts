import { Page } from "@playwright/test"

import { HOME_PAGE_URL } from "@/lib/constants.tests"

class HomePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  get pageUrl() {
    return HOME_PAGE_URL
  }
}

export default HomePage
