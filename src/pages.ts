// @ts-expect-error
import { chunker } from './pagedjs';

import { app, pages, pagesBtn, printBtn } from './elements'
import { config } from './config';

let chunks: any
let loading = true

export async function renderPages() {
  loading = true
  pagesBtn?.classList.add('loading')

  // console.log('chunking...')
  chunks = await chunker(app, pages, config);
  console.log(`took: ${(chunks.performance / 1000).toFixed(2)}s`)

  loading = false
  pagesBtn?.classList.remove('loading')
  pages?.dispatchEvent(new Event("pages-loaded"));
}

export function destroyPages() {
  chunks.destroy()
}

export function waitForRender() {
  return new Promise((resolve) => {
    if (loading) {
      printBtn?.classList.add('loading')
      pages?.addEventListener('pages-loaded', () => {
        printBtn?.classList.remove('loading')
        resolve(true)
      }, { once: true })
    } else {
      resolve(true)
    }
  })
}
