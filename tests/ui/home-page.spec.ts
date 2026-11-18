import {HomePage} from "../pages/home-page";
import {expect, test} from "@playwright/test";

let homePage: HomePage

test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.open()
})

test('Check the default status of Home Page', async ({}) => {
    await expect(homePage.loanAmount).toHaveValue('500')
    await expect(homePage.loanPeriod).toHaveValue('12')
    await expect(homePage.calculateLoanAmount).toBeVisible()
    await expect(homePage.calculateLoanAmount).toBeEnabled()
    await expect(homePage.applyLoan).toBeVisible()
    await expect(homePage.applyLoan).toBeDisabled()
    await expect(homePage.languageOption).toContainText('EN')
})

test('Click Calculate -> Apply Now button enabled  ', async ({}) => {
    await homePage.calculateLoanAmount.click()
    //Verify Monthly payment is calculated
    await expect(homePage.monthlyPayment).toBeVisible()
    //Verify Apply Now btn is enabled
    await expect(homePage.applyLoan).toBeEnabled()

    //Change the Loan amount and Apply Now btn becomes disabled
    await homePage.loanAmount.fill('1000')
    await expect(homePage.applyLoan).toBeDisabled()

    await homePage.calculateLoanAmount.click()
    //Verify Monthly payment is calculated
    await expect(homePage.monthlyPayment).toBeVisible()
    //Verify Apply Now btn is enabled
    await expect(homePage.applyLoan).toBeEnabled()

    //Change the loan Period and Apply Now btn becomes disabled
    await homePage.loanPeriod.click()
    await homePage.loanPeriod.selectOption('24')
    //await expect(homePage.loanPeriod).toHaveText('24')
    await expect(homePage.applyLoan).toBeDisabled()

    await homePage.calculateLoanAmount.click()
    //Verify Monthly payment is calculated
    await expect(homePage.monthlyPayment).toBeVisible()
    //Verify Apply Now btn is enabled
    await expect(homePage.applyLoan).toBeEnabled()
})

test('Check the error message when invalid value is inserted to Amount field', async ({}) => {
    await homePage.loanAmount.fill('499')
    await homePage.calculateLoanAmount.click()
    //Verify the error message
    await expect(homePage.loanCalculationError).toBeVisible()
    await expect(homePage.loanCalculationError).toHaveText('Oops, something went wrong')

    await homePage.loanAmount.fill('10001')
    await homePage.calculateLoanAmount.click()
    //Verify the error message
    await expect(homePage.loanCalculationError).toBeVisible()
    await expect(homePage.loanCalculationError).toHaveText('Oops, something went wrong')

    await homePage.loanAmount.clear()
    await homePage.calculateLoanAmount.click()
    //Verify the error message
    await expect(homePage.loanCalculationError).toBeVisible()
    await expect(homePage.loanCalculationError).toHaveText('Oops, something went wrong')
})