# Test Cases

## Login Tests (seed.spec.js)
1. should login successfully with valid credentials
2. should show error for locked out user (QA only)

## Shopping Flow Tests (shopping_flow.spec.js)
1. should display 6 products with correct details
2. should add first product to cart and verify
3. negative scenario: cart should be empty if no items added

## E2E Shopping Flow Tests (e2e_shopping.spec.js)
1. should complete full E2E shopping flow successfully
2. negative scenario: should show error when first name is missing
3. negative scenario: should show error when last name is missing
4. negative scenario: should show error when postal code is missing

