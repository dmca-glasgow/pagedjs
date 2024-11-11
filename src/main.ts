import * as elem from './elements'
import { destroyPages, renderPages, waitForRender } from './pages';
import { Size } from './config/paper';
import { config } from './config';

renderPages()

elem.webBtn?.addEventListener('click', () => {
  elem.webBtn?.classList.add('active')
  elem.pagesBtn?.classList.remove('active')
  elem.app?.classList.add('show')
  elem.printView?.classList.remove('show')
})

elem.pagesBtn?.addEventListener('click', () => {
  elem.pagesBtn?.classList.add('active')
  elem.webBtn?.classList.remove('active')
  elem.printView?.classList.add('show')
  elem.app?.classList.remove('show')
})

elem.layoutSelect?.addEventListener('change', (e) => {
  if (e.target instanceof HTMLSelectElement) {
    const view = e.target.value
    if (view === 'Single') {
      elem.pages?.classList.remove('double')
    }
    if (view === 'Double') {
      elem.pages?.classList.add('double')
    }
  }
})

elem.paperSelect?.addEventListener('change', (e) => {
  if (e.target instanceof HTMLSelectElement) {
    const size = e.target.value as Size;
    config.paper.selectedSize = size;
    renderPages()
  }
})

elem.pagesEnabled?.addEventListener('change', (e) => {
  if (e.target instanceof HTMLInputElement) {
    if (e.target.checked) {
      renderPages()
    } else {
      destroyPages()
    }
  }
})

elem.printBtn?.addEventListener('click', async () => {
  await waitForRender()
  window.print()
})

document.addEventListener("keydown", async (e) => {
  if (e.metaKey && e.key === 'p') {
    e.preventDefault()
    await waitForRender()
    window.print()
  }
});
