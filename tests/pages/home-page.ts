import {Locator, Page} from "@playwright/test";

export class HomePage {
    readonly page: Page
    readonly url: string = 'https://loan-decision.tl-academy.ee/small-loan'
    readonly loanAmount: Locator
    readonly loanPeriod: Locator
    readonly calculateLoanAmount: Locator
    readonly applyLoan: Locator
    readonly languageOption: Locator

    readonly loanPeriod16: Locator
    readonly loanPeriod20: Locator
    readonly loanPeriod24: Locator
    readonly loanPeriod28: Locator
    readonly loanPeriod32: Locator
    readonly loanPeriod36: Locator

    readonly monthlyPayment: Locator
    readonly loanCalculationError: Locator


    constructor(page: Page) {
        this.page = page;
        this.loanAmount = page.getByTestId('id-small-loan-calculator-field-amount')
        this.loanPeriod = page.getByTestId('ib-small-loan-calculator-field-period')
        this.calculateLoanAmount = page.getByTestId('id-small-loan-calculator-field-calculate')
        this.applyLoan = page.getByTestId('id-small-loan-calculator-field-apply')
        this.languageOption = page.getByTestId('language-switcher-button')

        this.loanPeriod16 = page.getByTestId('ib-small-loan-calculator-button-period-option-4')
        this.loanPeriod20 = page.getByTestId('ib-small-loan-calculator-button-period-option-8')
        this.loanPeriod24 = page.getByTestId('ib-small-loan-calculator-button-period-option-12')
        this.loanPeriod28 = page.getByTestId('ib-small-loan-calculator-button-period-option-16')
        this.loanPeriod32 = page.getByTestId('ib-small-loan-calculator-button-period-option-20')
        this.loanPeriod36 = page.getByTestId('ib-small-loan-calculator-button-period-option-24')

        this.monthlyPayment = page.getByTestId('ib-small-loan-calculator-field-monthlyPayment')
        this.loanCalculationError = page.getByTestId('id-small-loan-calculator-field-error')
    }

    async open() {
        await this.page.goto(this.url)
    }
}