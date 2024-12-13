export function afterPageLayout(fragment, headerFooter, pageNum, total) {
  if (pageNum === 1 && headerFooter.firstPage) {
    renderMargins(fragment, headerFooter.firstPage, pageNum, total)
  } else {
    renderMargins(fragment, headerFooter, pageNum, total)
  }
}

export function afterRendered(pagesArea, headerFooter, total) {
  pagesArea.querySelectorAll('.pagedjs_page').forEach((page, idx) => {
    afterPageLayout(page, headerFooter, idx + 1, total)
  })
}

function renderMargins(fragment, headerFooter, pageNum, total) {
  const header = headerFooter.header || {}
  if (header) {
    if (header.left) {
      renderMargin(fragment, header.left, 'top-left', pageNum, total)
    }
    if (header.center) {
      renderMargin(fragment, header.center, 'top-center', pageNum, total)
    }
    if (header.right) {
      renderMargin(fragment, header.right, 'top-right', pageNum, total)
    }
  }

  const footer = headerFooter.footer || {}
  if (footer) {
    if (footer.left) {
      renderMargin(fragment, footer.left, 'bottom-left', pageNum, total)
    }
    if (footer.center) {
      renderMargin(fragment, footer.center, 'bottom-center', pageNum, total)
    }
    if (footer.right) {
      renderMargin(fragment, footer.right, 'bottom-right', pageNum, total)
    }
  }
}

function renderMargin(fragment, config, klass, pageNum, total) {
  switch (config.type) {
    case 'text':
      return renderText(fragment, config, klass)
    case 'chapter-title':
      return renderChapterTitle(fragment, config, klass)
    case 'page-number':
      return renderPageNumber(fragment, config, klass, pageNum, total)
    default:
      throw new Error(`[page-header-footer] type "${config.type}" not supported`)
  }
}

function renderText(fragment, config, klass) {
  const elem = fragment.querySelector(`.pagedjs_margin-${klass}`)
  elem.innerHTML = config.value
}

function renderChapterTitle(fragment, config, klass) {
  const elem = fragment.querySelector(`.pagedjs_margin-${klass}`)
  const title = getRollingTitle(fragment, config.titleSelector)
  elem.innerHTML = title
}

function renderPageNumber(fragment, config, klass, pageNum, total) {
  const elem = fragment.querySelector(`.pagedjs_margin-${klass}`)
  elem.innerHTML = config.template(pageNum, total)
}

let lastTitle = '';
function getRollingTitle(fragment, rollingTitleSelector) {
  let selected = fragment.querySelectorAll(rollingTitleSelector);
  let varFirst;

  if (selected.length == 0) {
    varFirst = lastTitle;
  } else {
    selected.forEach((sel) => {
      lastTitle = selected[selected.length - 1].textContent;
    });
    varFirst = selected[0].textContent;
  }

  return varFirst
}

