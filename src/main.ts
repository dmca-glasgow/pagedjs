// @ts-expect-error
import { createPreviewer } from './pagedjs';

const app = document.querySelector<HTMLDivElement>('.app');
const printView = document.querySelector<HTMLDivElement>('.print-view');
const pages = document.querySelector<HTMLDivElement>('.print-view .pages');
const webBtn = document.querySelector<HTMLButtonElement>('.web-btn')
const pagesBtn = document.querySelector<HTMLButtonElement>('.pages-btn')
const printBtn = document.querySelector<HTMLButtonElement>('.print-btn')
const refreshBtn = document.querySelector<HTMLButtonElement>('.refresh-btn')

const previewer = createPreviewer();

new Promise((resolve) => {
	if (document.readyState === "interactive" || document.readyState === "complete") {
		resolve(document.readyState);
		return;
	}
	document.onreadystatechange = () => {
		if (document.readyState === "interactive") {
			resolve(document.readyState);
		}
	};
}).then(addPages);

async function addPages() {
  printView?.classList.remove('scale')
  console.log('chunking...')
  const chunker = await previewer.preview(app, pages);
  console.log(`took: ${(chunker.performance / 1000).toFixed(2)}s`)
  printView?.classList.add('scale')
}

webBtn?.addEventListener('click', () => {
  webBtn.classList.add('active')
  pagesBtn?.classList.remove('active')
  app?.classList.add('show')
  printView?.classList.remove('show')
})

pagesBtn?.addEventListener('click', () => {
  pagesBtn.classList.add('active')
  webBtn?.classList.remove('active')
  printView?.classList.add('show')
  app?.classList.remove('show')
})

printBtn?.addEventListener('click', () => {
  window.print()
})

refreshBtn?.addEventListener('click', () => {
  previewer.destroy();
  addPages()
})

// document.addEventListener("keydown", (e) => {
//   if (e.metaKey && e.key === 'p') {
//     e.preventDefault()
//     console.log('print request')
//     window.print()
//   }
// });

// window.addEventListener("beforeprint", () => {
//   console.log('beforeprint')
// });

// window.addEventListener("afterprint", () => {
//   console.log('afterprint')
// });
