import os
from playwright.sync_api import sync_playwright, expect

def verify_mercado():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the local server
        page.goto("http://localhost:8000")

        # Click "INICIAR PROTOCOLO" if present
        try:
            page.wait_for_selector("#btn-inicio", timeout=5000)
            page.click("#btn-inicio")
        except:
            pass

        # Click "CONFIRMAR IDENTIDAD" (by text as it has no ID)
        page.wait_for_selector("button:has-text('CONFIRMAR IDENTIDAD')", timeout=5000)
        page.click("button:has-text('CONFIRMAR IDENTIDAD')")

        # Click "SALTAR INTRO"
        page.wait_for_selector("#btn-skip", state="visible", timeout=5000)
        page.click("#btn-skip")

        # Wait for the apartment and click "SALIR DEL APARTAMENTO"
        # It might be visible or we might need to wait for things to settle
        page.wait_for_selector("#btn-terminal", state="visible", timeout=10000)
        page.click("#btn-terminal")

        # Wait for map
        page.wait_for_selector("#mapa-contenedor", state="visible", timeout=10000)

        # Look for MERCADO button
        # The map buttons are often generated dynamically. Let's look for text.
        mercado_btn = page.locator('button:has-text("MERCADO")')
        if mercado_btn.is_visible():
            print("MERCADO button found on map")
            page.screenshot(path="mapa_mercado_v4.png")

            # Click it to enter the zone
            mercado_btn.click()
            page.wait_for_timeout(1000) # Wait for transition

            # Wait for zone to load
            page.wait_for_selector("#zona-llegada-desc", timeout=5000)
            page.screenshot(path="zona_mercado_v4.png")

            tasadora_btn = page.locator('button:has-text("Hablar con la Tasadora")')
            if tasadora_btn.is_visible():
                print("Tasadora button found")
                tasadora_btn.click()
                page.wait_for_timeout(1000)
                page.screenshot(path="tasadora_dialogo_v4.png")
            else:
                print("Tasadora button NOT found")
        else:
            print("MERCADO button NOT found on map")
            # Log available buttons
            btns = page.eval_on_selector_all("button", "elements => elements.map(e => e.innerText)")
            print(f"Available buttons: {btns}")
            page.screenshot(path="mapa_fail_v4.png")

        browser.close()

if __name__ == "__main__":
    verify_mercado()
