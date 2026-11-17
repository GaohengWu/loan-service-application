import { test, expect } from '@playwright/test';
const URL = 'https://loan-decision.tl-academy.ee/small-loan';

test('Check the default status', async ({ page }) => {
  await page.goto(URL);

  // Expect Calculate button is enabled
  await expect(page.getByTestId('id-small-loan-calculator-field-calculate')).toBeEnabled();
  //Expect Apply Now button is disabled
  await expect(page.getByTestId('id-small-loan-calculator-field-apply')).toBeDisabled();

  await page.getByTestId('id-image-element-button-image-2').scrollIntoViewIfNeeded();
  await page.getByTestId('id-image-element-button-image-2').click();
  //now scroll happened
  await expect(page.getByTestId('id-small-loan-calculator-field-calculate')).toBeInViewport();
});

test('Calculate -> Apply Now button will be enabled', async ({ page }) => {
  await page.goto(URL);

  // Click the get started link.
  await page.getByTestId('id-small-loan-calculator-field-calculate').click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByTestId('id-small-loan-calculator-field-apply')).toBeEnabled();
});

test('Calculate -> apply button enabled -> request happened ', async ({ page }) => {
  await page.goto(URL);

  // before action we have to init request listener
  const requestPromise = page.waitForRequest('**/api/loan-calc?amount=500&period=12');

  // Click the get started link.
  await page.getByTestId('id-small-loan-calculator-field-calculate').click();

  //straight after action
  await requestPromise

  //2 check request sent
  // we look for this pattern /api/loan-calc?amount=500&period=12

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByTestId('id-small-loan-calculator-field-amount')).toBeEnabled();

  //change amount from default to 1000
  await page.getByTestId('id-small-loan-calculator-field-amount').fill('1000');
  const requestOnePromise = page.waitForRequest('**/api/loan-calc?amount=1000&period=12');
  await page.getByTestId('id-small-loan-calculator-field-calculate').click();

  //straight after action
  await requestOnePromise
});

test('Login page has default status', async ({ page }) => {
  await page.goto(URL);

  // Click Apply now to trigger login page
  await page.getByTestId('id-small-loan-calculator-field-calculate').click();
  await page.getByTestId('id-small-loan-calculator-field-apply').click();


  await expect(page.getByTestId('login-popup-tab-password')).toBeVisible()
  await expect(page.getByTestId('login-popup-tab-smart-id')).toBeVisible()
  await expect(page.getByTestId('login-popup-username-input')).toBeEnabled()
  await expect(page.getByTestId('login-popup-password-input')).toBeEnabled()
  await expect(page.getByTestId('login-popup-continue-button')).toBeDisabled()


  //click smart id check smart id tab field
  await page.getByTestId('login-popup-tab-smart-id').click();
  await expect(page.getByTestId('login-popup-personal-code-input')).toBeVisible()
  await expect(page.getByTestId('login-popup-continue-button')).toBeDisabled()


});

test('default state > calculate with mocked backend > monthly payment shown', async ({ page }) => {
  // mock backend response before navigation
  await page.route('**/api/loan-calc?amount=500&period=12', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ paymentAmountMonthly: 42.8 }),
    })
  })

  await page.goto(URL);

  await page.getByTestId('id-small-loan-calculator-field-calculate').click();

  // mocked value is displayed
  await expect(page.getByTestId('ib-small-loan-calculator-field-monthlyPayment')).toContainText('42.8')
});

test('Calculation fails with invalid amount and mock backend > error is visible ', async ({ page }) => {
  // mock backend response before navigation
  await page.route('**/api/loan-calc?amount=499&period=12', async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      //body: JSON.stringify({ paymentAmountMonthly: 42.8 }),
    })
  })

  await page.goto(URL);
  await page.getByTestId('id-small-loan-calculator-field-amount').fill('499');
  await page.getByTestId('id-small-loan-calculator-field-calculate').click();

  // mocked value is displayed
  await expect(page.getByTestId('id-small-loan-calculator-field-error')).toBeVisible()
});

test('default state > change amount to 1000 > calculate with mocked backend > monthly payment shown ', async ({ page }) => {
  // mock #1 backend response before navigation
  await page.route('**/api/loan-calc?amount=500&period=12', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ paymentAmountMonthly: 42.8 }),
    })
  })

  // mock #2 backend response before navigation
  await page.route('**/api/loan-calc?amount=1000&period=12', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ paymentAmountMonthly: 856.07 }),
    })
  })

  await page.goto(URL);
  await page.getByTestId('id-small-loan-calculator-field-calculate').click();
  await expect(page.getByTestId('ib-small-loan-calculator-field-monthlyPayment')).toContainText('42.8');

  await page.getByTestId('id-small-loan-calculator-field-amount').fill('1000');
  await page.getByTestId('id-small-loan-calculator-field-calculate').click();
  await expect(page.getByTestId('ib-small-loan-calculator-field-monthlyPayment')).toContainText('856.07')
});

test('full flow: loan details > income > decision', async ({ page }) => {
  // mock #1 backend response before navigation
  await page.route('**/api/loan-calc?amount=500&period=12', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ paymentAmountMonthly: 42.8 }),
    })
  })

  // mock #2 backend response before navigation
  await page.route('**/api/decisions', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        "id": "76eea815-c0a0-4fd4-9845-7064eba94dd8",
        "approved": false,
        "reason": "blacklisted",
        "createdAt": "2026-11-12T18:10:44.674Z"
      }),
    })
  })

  await page.goto(URL);
  await page.getByTestId('id-small-loan-calculator-field-calculate').click();
  await expect(page.getByTestId('ib-small-loan-calculator-field-monthlyPayment')).toContainText('42.8');

  await page.getByTestId('id-small-loan-calculator-field-amount').fill('1000');
  await page.getByTestId('id-small-loan-calculator-field-calculate').click();
  await expect(page.getByTestId('ib-small-loan-calculator-field-monthlyPayment')).toContainText('856.07')

  //id-small-loan-calculator-field-apply
  await page.getByTestId('id-small-loan-calculator-field-apply').click();
  await page.getByTestId('login-popup-tab-smart-id').click();
  await page.getByTestId('login-popup-personal-code-input').fill('38001010003')
  await page.getByTestId('login-popup-continue-button').click();
  await page.getByTestId('final-page-continue-button').click();
  await page.getByTestId('income-page-input').fill('5000') //
  await page.getByTestId('income-page-submit-button').click();


  await expect(page.getByTestId('decision-page-title')).toContainText('Loan declined')
  await expect(page.getByTestId('decision-page-text')).toContainText('We cannot offer you a loan.')


});