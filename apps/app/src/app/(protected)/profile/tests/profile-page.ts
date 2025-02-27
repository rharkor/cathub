import { Locator, Page } from "@playwright/test"

import { CATHUB_PROFILE_PAGE_URL, PROFILE_PAGE_URL } from "@/lib/constants.tests"

class ProfilePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  get pageUrl() {
    return PROFILE_PAGE_URL
  }

  get cathubPageUrl() {
    return CATHUB_PROFILE_PAGE_URL
  }

  get avatar(): Locator {
    return this.page.getByTestId("profile-avatar")
  }

  get basicinfos(): Locator {
    return this.page.getByTestId("profile-basicinfos")
  }

  get creatorProfile(): Locator {
    return this.page.getByTestId("profile-creator-profile")
  }

  get basicInfosEmail(): Locator {
    return this.page.getByTestId("profile-basicinfos-email")
  }

  get basicInfosUsername(): Locator {
    return this.page.getByTestId("input-username")
  }

  get creatorButton(): Locator {
    return this.page.getByRole("button", {
      name: "Profil créateur",
    })
  }

  get cathubProfileModal(): Locator {
    return this.page.getByTestId("cathub-profile-modal")
  }

  get sexSelect(): Locator {
    return this.page.getByTestId("cathub-profile-sex")
  }

  get sexSelectValue(): Locator {
    return this.page.getByTestId("cathub-profile-sex-value")
  }
}

export default ProfilePage
