// @ts-expect-error
import { Previewer } from 'pagedjs';

const app = document.querySelector<HTMLDivElement>('.app');
const print = document.querySelector<HTMLDivElement>('.print');
const webBtn = document.querySelector<HTMLButtonElement>('.web-btn')
const printBtn = document.querySelector<HTMLButtonElement>('.print-btn')

const config = {
	auto: true,
	before: undefined,
	after: undefined,
	content: app,
	stylesheets: undefined,
	renderTo: print,
	settings: undefined
};

const previewer = new Previewer(config.settings);

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
}).then(async function () {
  const chunker = await previewer.preview(
    config.content,
    undefined,
    config.renderTo
  );
  // console.log(chunker.pages)
  console.log(`took: ${(chunker.performance / 1000).toFixed(2)}s`)
});

webBtn?.addEventListener('click', () => {
  webBtn.classList.add('active')
  printBtn?.classList.remove('active')
  app?.classList.add('show')
  print?.classList.remove('show')
})

printBtn?.addEventListener('click', () => {
  printBtn.classList.add('active')
  webBtn?.classList.remove('active')
  print?.classList.add('show')
  app?.classList.remove('show')
})

addEventListener("beforeprint", () => {
  console.log('printing')
});
