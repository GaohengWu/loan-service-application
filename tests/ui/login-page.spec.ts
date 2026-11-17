import {HomePage} from "../pages/home-page";
import {expect, test} from "@playwright/test";
import {LoginPage} from "../pages/login-page";

let homePage: HomePage
let loginPage: LoginPage

test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.open()
    await homePage.calculateLoanAmount.click()
    await homePage.applyLoan.click()
    loginPage = new LoginPage(page)
})

test('Click Apply Now -> Login page is available', async ({}) => {
    //Verify Login Page is available now
    await expect(loginPage.loginTitle).toBeVisible()
    await expect(loginPage.loginTitle).toHaveText('Login')
    await expect(loginPage.loginWithUsernamePassword).toBeVisible()
    await expect(loginPage.userNameField).toBeVisible()
    await expect(loginPage.passwordField).toBeVisible()
    await expect(loginPage.loginButton).toBeVisible()
    await expect(loginPage.loginSmartID).toBeVisible()
})

test('username+password or valid personal ID code inserted -> Continue button is enabled', async ({}) => {

    //Verify by default login(Continue) button is disabled
    await expect(loginPage.loginButton).toBeDisabled()

    await loginPage.userNameField.fill('anna')
    await expect(loginPage.loginButton).toBeDisabled()

    await loginPage.passwordField.fill('Tallinn1')
    await expect(loginPage.loginButton).toBeEnabled()

    //Switch to Smart-ID login tab
    await loginPage.loginSmartID.click()
    await expect(loginPage.loginButton).toBeDisabled()

    await loginPage.personalIDCodeField.fill('39112310001')
    await expect(loginPage.loginButton).toBeEnabled()
})

test('Check the error messages related to username and login', async ({}) => {
    await loginPage.userNameField.fill('123')
    await expect(loginPage.usernameError).toBeVisible()
    await expect(loginPage.usernameError).toHaveText('Username can only contain letters, spaces, hyphens and apostrophes')

    await loginPage.passwordField.fill('123xyz$%^')
    await expect(loginPage.loginButton).toBeDisabled()

    await loginPage.userNameField.fill('Gao')
    await expect(loginPage.loginButton).toBeEnabled()

    await loginPage.loginButton.click()
    await expect(loginPage.loginError).toBeVisible()
    await expect(loginPage.loginError).toHaveText('Incorrect username or password')
})

test('User can not login with invalid personal ID code', async ({}) => {
    await loginPage.loginSmartID.click()
    await loginPage.personalIDCodeField.fill('391')
    await expect(loginPage.loginButton).toBeDisabled()

    await loginPage.personalIDCodeField.fill('39112310001')
    await expect(loginPage.loginButton).toBeEnabled()
})

test('A user can login with correct username and correct password', async ({}) => {
    const loanDetailsPage = await loginPage.signInWithPassword('anna', 'Tallinn1')
    await expect(loanDetailsPage.loanDetailsTitle).toBeVisible()
})

test('A user can login with valid personal ID code', async ({}) => {
    const loanDetailsPage = await loginPage.signInWithSmartID('39001010001')
    await expect(loanDetailsPage.loanDetailsTitle).toBeVisible()
})
