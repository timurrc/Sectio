import { defineConfig, devices } from "@playwright/test";

/** Свой порт: e2e не цепляются к dev-серверу, который открыт у разработчика */
const PORT = 5180;

/** PW_CHANNEL=chrome — запуск в установленном Google Chrome, без скачивания Chromium */
const channel = process.env.PW_CHANNEL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "ru-RU",
    trace: "on-first-retry",
    ...(channel ? { channel } : {}),
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
      testIgnore: ["mobile.spec.ts", "demo.spec.ts"],
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } },
      testMatch: "mobile.spec.ts",
    },
    // Запись GIF для README: bun run demo
    {
      name: "demo",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
        video: { mode: "on", size: { width: 1280, height: 800 } },
      },
      testMatch: "demo.spec.ts",
    },
  ],
  webServer: {
    command: `bun run dev --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
