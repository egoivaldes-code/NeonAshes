import os
from playwright.sync_api import sync_playwright, expect

def verify_mercado():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the local server
        page.goto("http://localhost:8000")

        # Click "CONFIRMAR IDENTIDAD"
        page.click("#btn-confirmar-nombre")

        # Click "SALTAR INTRO"
        page.wait_for_selector("#btn-saltar-intro", state="visible")
        page.click("#btn-saltar-intro")

        # Wait for the apartment and click "Salir del apartamento"
        page.wait_for_selector("#btn-salir-apartamento", state="visible")
        page.click("#btn-salir-apartamento")

        # Wait for map
        page.wait_for_selector("#mapa-contenedor", state="visible")

        # Look for MERCADO button
        mercado_btn = page.locator('button:has-text("MERCADO")')
        if mercado_btn.is_visible():
            print("MERCADO button found on map")
            page.screenshot(path="mapa_mercado_v3.png")

            # Click it to enter the zone
            mercado_btn.click()
            page.wait_for_timeout(1000) # Wait for transition

            # Check for "Hablar con la Tasadora" or similar
            page.screenshot(path="zona_mercado_v3.png")

            tasadora_btn = page.locator('button:has-text("Hablar con la Tasadora")')
            if tasadora_btn.is_visible():
                print("Tasadora button found")
                tasadora_btn.click()
                page.wait_for_timeout(1000)
                page.screenshot(path="tasadora_dialogo.png")
            else:
                print("Tasadora button NOT found")
        else:
            print("MERCADO button NOT found on map")
            # Log available buttons
            btns = page.eval_on_selector_all("button", "elements => elements.map(e => e.innerText)")
            print(f"Available buttons: {btns}")
            page.screenshot(path="mapa_fail_v3.png")

        browser.close()

if __name__ == "__main__":
    verify_mercado()
