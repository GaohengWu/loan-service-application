import {Locator, Page} from "@playwright/test";
import {HomePage} from "./home-page";
import {LoanDetailsPage} from "./loan-details-page";

export class LoginPage {
    readonly page: Page
    readonly url: string = 'https://loan-decision.tl-academy.ee/small-loan'
    readonly loginTitle: Locator
    readonly loginWithUsernamePassword: Locator
    readonly userNameField: Locator
    readonly passwordField: Locator
    readonly loginButton: Locator
    readonly loginSmartID: Locator
    readonly personalIDCodeField: Locator

    readonly usernameError: Locator
    readonly loginError: Locator

    constructor(page: Page) {
        this.page = page;
        this.loginTitle = page.getByTestId('login-popup-title')
        this.loginWithUsernamePassword = page.getByTestId('login-popup-tab-password')
        this.userNameField = page.getByTestId('login-popup-username-input')
        this.passwordField = page.getByTestId('login-popup-password-input')
        this.loginButton = page.getByTestId('login-popup-continue-button')
        this.loginSmartID = page.getByTestId('login-popup-tab-smart-id')
        this.personalIDCodeField = page.getByTestId('login-popup-personal-code-input')
        this.usernameError = page.getByTestId('login-popup-username-error')
        this.loginError = page.getByTestId('login-popup-password-error')
    }

    async signInWithPassword(username: string, password: string) {
        await this.userNameField.fill(username)
        await this.passwordField.fill(password)
        await this.loginButton.click()
        return new LoanDetailsPage(this.page)
    }

    async signInWithSmartID(smartID: string) {
        await this.loginSmartID.click()
        await this.personalIDCodeField.fill(smartID)
        await this.loginButton.click()
        return new LoanDetailsPage(this.page)
    }
}