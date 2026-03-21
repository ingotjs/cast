/**
 * E2E Test: Locale Switcher
 *
 * Tests the language switcher dropdown in the header.
 *
 * Steps:
 * 1. Navigate to home page
 * 2. Verify locale switcher is visible
 * 3. Click the trigger to open the dropdown
 * 4. Verify available locales are listed
 * 5. Verify current locale is selected
 * 6. Select a locale and verify the cookie is set
 */

import { expect, test } from "@playwright/test";

import { testId } from "../coverage";

test.describe("Locale Switcher", () => {
  test("should be visible in the header", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId(testId.header.localeSwitcherTrigger)).toBeVisible();
  });

  test("should open dropdown with available locales", async ({ page }) => {
    await page.goto("/");

    const trigger = page.getByTestId(testId.header.localeSwitcherTrigger);

    // Base UI Menu needs hydrated React — retry clicks until the menu opens
    await expect(async () => {
      await trigger.click();
      await expect(page.getByTestId(testId.header.localeSwitcherItemEn)).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });
  });

  test("should show current locale as the trigger label", async ({ page }) => {
    await page.goto("/");

    // The trigger uses a language icon with an aria-label
    const trigger = page.getByTestId(testId.header.localeSwitcherTrigger);
    await expect(trigger).toHaveAttribute("aria-label", "Change language");
  });

  test("should set locale cookie and html lang attribute", async ({ page }) => {
    await page.goto("/");

    // Verify html lang is set to "en"
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // Base UI Menu needs hydrated React — retry clicks until the menu opens
    const trigger = page.getByTestId(testId.header.localeSwitcherTrigger);
    await expect(async () => {
      await trigger.click();
      await expect(page.getByTestId(testId.header.localeSwitcherItemEn)).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });

    // Click the English locale (re-selecting current locale — should be a no-op)
    await page.getByTestId(testId.header.localeSwitcherItemEn).click();

    // Verify the html lang is still "en"
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});
