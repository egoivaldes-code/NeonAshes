import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Aumentar timeout para carga inicial
        await page.goto("http://localhost:8000/index.html", wait_until="networkidle")
        await asyncio.sleep(2)
        await page.screenshot(path="debug_1_start.png")

        print("Iniciando juego...")
        await page.evaluate("iniciarJuego()")
        await asyncio.sleep(1)
        await page.screenshot(path="debug_2_after_iniciar.png")

        print("Confirmando nombre...")
        await page.evaluate("confirmarNombre()")
        await asyncio.sleep(1)
        await page.screenshot(path="debug_3_after_confirm.png")

        print("Saltando intro...")
        await page.evaluate("saltarIntro()")
        await asyncio.sleep(1)
        await page.screenshot(path="debug_4_after_skip.png")

        print("Yendo a transito (mapa)...")
        await page.evaluate("irATransito()")
        await asyncio.sleep(2)
        await page.screenshot(path="debug_5_map.png")

        # Verificar presencia de MERCADO en el mapa
        btn_mercado = await page.evaluate('''() => {
            const spans = Array.from(document.querySelectorAll('.mapa-zona-btn span'));
            const target = spans.find(s => s.textContent.includes('MERCADO'));
            if (target) {
                target.parentElement.click();
                return true;
            }
            return false;
        }''')

        print(f"Boton MERCADO encontrado y clickeado: {btn_mercado}")

        if btn_mercado:
            await asyncio.sleep(2)
            await page.screenshot(path="debug_6_zona_mercado.png")

            # Verificar que estamos en la zona de mercado
            titulo = await page.inner_text('.zona-titulo')
            print(f"Titulo de la zona: {titulo}")

            # Verificar si aparece el botón de Mercado (el de comprar)
            btn_comprar = await page.evaluate('''() => {
                const btns = Array.from(document.querySelectorAll('.btn-mapa-accion'));
                return btns.some(b => b.textContent.includes('Mercado'));
            }''')
            print(f"Boton de comprar en Mercado encontrado: {btn_comprar}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
