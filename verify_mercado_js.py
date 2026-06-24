import os
from playwright.sync_api import sync_playwright

def verify_mercado():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8000")

        # Take a screenshot of the start
        page.wait_for_timeout(2000)
        page.screenshot(path="debug_start.png")

        # Try to click by evaluating JS to bypass overlays
        page.evaluate("confirmarNombre()")
        print("Called confirmarNombre() via JS")

        page.wait_for_timeout(1000)
        page.screenshot(path="debug_after_confirm.png")

        # Try to skip intro via JS
        page.evaluate("saltarIntro()")
        print("Called saltarIntro() via JS")

        page.wait_for_timeout(2000)
        page.screenshot(path="debug_after_skip.png")

        # Try to exit apartment via JS
        page.evaluate("irATransito()")
        print("Called irATransito() via JS")

        page.wait_for_timeout(2000)
        page.screenshot(path="debug_map.png")

        # Check if we are on map and MERCADO is there
        exists = page.evaluate("document.body.innerText.includes('MERCADO')")
        print(f"MERCADO text exists: {exists}")

        if exists:
            # Try to click MERCADO button via JS if it's a button
            page.evaluate("""
                const btns = Array.from(document.querySelectorAll('button'));
                const mercado = btns.find(b => b.innerText.includes('MERCADO'));
                if(mercado) mercado.click();
            """)
            page.wait_for_timeout(2000)
            page.screenshot(path="debug_zona_mercado.png")

        browser.close()

if __name__ == "__main__":
    verify_mercado()
