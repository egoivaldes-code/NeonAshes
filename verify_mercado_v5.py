
import asyncio
from playwright.async_api import async_playwright
import time

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Use a mobile-like viewport as the game is vertical-only
        context = await browser.new_context(
            viewport={'width': 450, 'height': 800},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'
        )
        page = await context.new_page()

        # Go to the local server
        await page.goto('http://localhost:8000/index.html')
        await page.wait_for_timeout(2000)
        await page.screenshot(path='debug_v5_1_start.png')

        # Click the start gate
        await page.click('#cine-gate')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='debug_v5_2_after_gate.png')

        # Enter name and confirm
        await page.fill('#input-nombre', 'Test')
        await page.fill('#input-apellido1', 'User')
        await page.click('button:has-text("CONFIRMAR IDENTIDAD")')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='debug_v5_3_after_confirm.png')

        # Skip intro if visible
        skip_btn = page.locator('#perm-btn-skip')
        if await skip_btn.is_visible():
            await skip_btn.click()
            await page.wait_for_timeout(1000)

        # Go to map (from apartment)
        await page.click('button:has-text("Salir del apartamento")')
        await page.wait_for_timeout(1000)
        await page.screenshot(path='debug_v5_4_map.png')

        # Click the MERCADO zone marker
        # Based on index.html: <button class="zona-marker" data-zona="mercado" ... onclick="seleccionarZona('mercado')">
        mercado_marker = page.locator('button[data-zona="mercado"]')
        await mercado_marker.click()
        await page.wait_for_timeout(500)
        await page.screenshot(path='debug_v5_5_mercado_selected.png')

        # Click "VIAJAR AQUÍ"
        await page.click('#btn-viajar-zona')

        # Wait for travel and arrival
        print("Waiting for travel...")
        await page.wait_for_timeout(5000) # Travel takes some time
        await page.screenshot(path='debug_v5_6_mercado_arrival.png')

        # Check if "Tasadora" is mentioned in the arrival scene
        arrival_text = await page.inner_text('#zona-escena')
        print(f"Arrival text: {arrival_text}")

        if "MERCADO" in arrival_text or "TASADORA" in arrival_text.upper():
            print("SUCCESS: Reached Mercado zone.")
        else:
            print("FAILURE: Did not reach Mercado zone or text mismatch.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
