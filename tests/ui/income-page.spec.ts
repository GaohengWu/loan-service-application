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
    await loanDetailsPage.continueButton.click()
    incomePage = new IncomePage(page)
})

test('Default status of Income Page', async ({}) => {
    //By default, Get Decision button is disabled. Back button is enabled.
    await expect(incomePage.getDecisionButton).toBeDisabled()
    await expect(incomePage.backButton).toBeEnabled()

    await incomePage.monthlyIncomeInput.fill('0')
    await expect(incomePage.getDecisionButton).toBeDisabled()

    await incomePage.monthlyIncomeInput.fill('2000')
    await expect(incomePage.getDecisionButton).toBeEnabled()
})

test('Click Back button -> Loan Details Page', async ({}) => {
    await incomePage.backButton.click()
    await expect(loanDetailsPage.loanDetailsTitle).toBeVisible()
})

test('Get decision -> decision approved', async ({}) => {
    await incomePage.monthlyIncomeInput.fill('5000')
    await incomePage.getDecisionButton.click()

    await expect(incomePage.decisionApprovedIcon).toBeVisible()
    await expect(incomePage.decisionApprovedTitle).toBeVisible()
    await expect(incomePage.decisionApprovedTitle).toHaveText('Loan approved!')
    await expect(incomePage.decisionApprovedText).toBeVisible()
    await expect(incomePage.decisionApprovedText).toHaveText('Your income is sufficient for this loan. We will contact you shortly.')

    await incomePage.decisionOKButton.click()
    //Verify clicking OK button -> Home page
    await expect(homePage.calculateLoanAmount).toBeVisible()
    await expect(homePage.calculateLoanAmount).toBeEnabled()
    await expect(homePage.applyLoan).toBeVisible()
    await expect(homePage.applyLoan).toBeDisabled()
})

test('Get decision -> decision declined', async ({}) => {
    await incomePage.monthlyIncomeInput.fill('1')
    await incomePage.getDecisionButton.click()

    await expect(incomePage.decisionDeclinedIcon).toBeVisible()
    await expect(incomePage.decisionDeclinedTitle).toBeVisible()
    await expect(incomePage.decisionDeclinedTitle).toHaveText('Loan declined')
    await expect(incomePage.decisionDeclinedText).toBeVisible()
    await expect(incomePage.decisionDeclinedText).toHaveText('The monthly payment is too high compared to your income. Try a smaller amount or a longer period.')

    await incomePage.decisionOKButton.click()
    //Verify clicking OK button -> Home page
    await expect(homePage.calculateLoanAmount).toBeVisible()
    await expect(homePage.calculateLoanAmount).toBeEnabled()
    await expect(homePage.applyLoan).toBeVisible()
    await expect(homePage.applyLoan).toBeDisabled()
})