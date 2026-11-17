import {HomePage} from "../pages/home-page";
import {LoginPage} from "../pages/login-page";
import {expect, test} from "@playwright/test";
import {LoanDetailsPage} from "../pages/loan-details-page";
import { IncomePage} from "../pages/income-page";

let homePage: HomePage
let loginPage: LoginPage
let loanDetailsPage: LoanDetailsPage
let incomePage: IncomePage

test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.open()
    await homePage.calculateLoanAmount.click()
    await homePage.applyLoan.click()
    loginPage = new LoginPage(page)
    loanDetailsPage = new LoanDetailsPage(page)
    await loginPage.signInWithSmartID('39001010001')
    incomePage = new IncomePage(page)
})

test('Login with default loan Amount&Period -> loan details are matching', async ({}) => {
    //Verify that Amount 1500, Period (month) 12 months, Monthly payment 128.41 EUR
    await expect(loanDetailsPage.loanAmount).toHaveText('500 €')
    await expect(loanDetailsPage.monthlyPayment).toHaveText('42.8 €')
    await expect(loanDetailsPage.period).toHaveText('12 months')
})

test('Default status of Loan Details page', async ({}) => {
    //Verify that Amount 1500, Period (month) 12 months, Monthly payment 128.41 EUR
    await expect(loanDetailsPage.fullNameField).toBeVisible()
    await expect(loanDetailsPage.languageOptions).toBeVisible()
    await expect(loanDetailsPage.languageOptions).toContainText('English')
    await expect(loanDetailsPage.continueButton).toBeVisible()
    await expect(loanDetailsPage.backButton).toBeVisible()
})

test('Click Continue button -> get income page', async ({}) => {
    //Verify that Amount 1500, Period (month) 12 months, Monthly payment 128.41 EUR
    await loanDetailsPage.continueButton.click()
    await expect(incomePage.incomePageTitle).toBeVisible()
    await expect(incomePage.incomePageTitle).toHaveText('Your monthly income')
    await expect(incomePage.incomePageHint).toBeVisible()
    await expect(incomePage.incomePageHint).toHaveText('Net income per month, after taxes')

    await expect(incomePage.monthlyIncomeInput).toBeVisible()
    await expect(incomePage.getDecisionButton).toBeVisible()
})

test('Click Back button -> get back to home page', async ({}) => {
    await loanDetailsPage.backButton.click()

    await expect(homePage.calculateLoanAmount).toBeVisible()
    await expect(homePage.calculateLoanAmount).toBeEnabled()
    await expect(homePage.applyLoan).toBeVisible()
    await expect(homePage.applyLoan).toBeEnabled()
})