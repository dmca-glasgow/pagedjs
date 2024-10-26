const app = document.querySelector<HTMLDivElement>('.app');
const print = document.querySelector<HTMLDivElement>('.print');
const webBtn = document.querySelector<HTMLButtonElement>('.web-btn')
const printBtn = document.querySelector<HTMLButtonElement>('.print-btn')

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
