'use strict'; {
  const config = HFS.getPluginConfig()
  const h = HFS.h

  const applyStyle = (selector, hide) => {
    const el = document.querySelector(selector)
    if (!el) return
    el.style.display = hide ? 'none' : ''
  }

  const updateUI = () => {
    applyStyle('.breadcrumb:nth-of-type(2)', config.hideHomeBtn)
    applyStyle('.breadcrumb:nth-of-type(1)', config.hideBackBtn)
    applyStyle('#zip-button', config.hideZipBtn)
    applyStyle('#select-button', config.hideSelectBtn)
    applyStyle('#search-button', config.hideSearchBtn)
  }

  HFS.watchState('list', updateUI, true)

  if (config.enableRefreshBtn) {
    HFS.onEvent('afterBreadcrumbs', () => {
      const style = h('style', {}, `
        #refreshButton {
          padding: 6px 10px;
          font-size: 14px;
          cursor: pointer;
        }
      `)

      const btn = document.createElement('button')
      btn.id = 'refreshButton'
      btn.title = 'Refresh page'
      btn.textContent = '◤'
      btn.style.padding = '6px 10px'
      btn.style.fontSize = '14px'
      btn.style.cursor = 'pointer'
      btn.addEventListener('click', () => location.reload(true))

      setTimeout(() => {
        const parent = document.querySelector('#breadcrumb-parent')
        if (parent && !document.getElementById('refreshButton')) {
          parent.parentNode.insertBefore(btn, parent)
        }
      }, 0)

      return style
    })
  }

  if (config.enableFullscreenBtn) {
    const toggleFullscreen = () => {
      const el = document.documentElement
      if (!document.fullscreenElement) {
        el.requestFullscreen?.().catch(err => HFS.toast("Enter fullscreen failed: " + err, 'error'))
      } else {
        document.exitFullscreen?.()
      }
    }

    HFS.onEvent('appendMenuBar', () => {
      return h(HFS.Btn, {
        icon: '⛶',
        tooltip: 'Toggle Fullscreen',
        onClick: toggleFullscreen
      })
    })

    setInterval(() => {
      const controls = document.querySelector('.file-show .bar .controls')
      const closeBtn = controls?.querySelector('button[title="Close"]')
      const exists = controls?.querySelector('.fullscreen-toggle')

      if (controls && closeBtn && !exists) {
        const btn = document.createElement('button')
        btn.className = 'fullscreen-toggle icon-button'
        btn.title = 'Toggle Fullscreen'
        btn.innerHTML = '<span aria-hidden="true">⛶</span>'
        btn.onclick = toggleFullscreen
        controls.insertBefore(btn, closeBtn)
      }
    }, 500)
  }
}
