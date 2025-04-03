export const handlePrintCustom = (component, onAfterPrint) => {
  const defaultPageStyle = `
        @page {
            /* Remove browser default header (title) and footer (url) */
            margin: 0;
        }
        @media print {
            body {
                /* Tell browsers to print background colors */
                -webkit-print-color-adjust: exact; /* Chrome/Safari/Edge/Opera */
                color-adjust: exact; /* Firefox */
            }
        }
    `

  const headStyles = document.head.getElementsByTagName('style')
  const iframe = document.getElementById('ifmcontentstoprint')
  const iframeHead = iframe?.contentDocument?.head
  const iframeBody = iframe?.contentDocument?.body

  iframe.width = `${document.documentElement.clientWidth}px`
  iframe.height = `${document.documentElement.clientHeight}px`
  iframe.style.position = 'absolute'
  iframe.style.top = `-${document.documentElement.clientHeight + 100}px`
  iframe.style.left = `-${document.documentElement.clientWidth + 100}px`
  iframe.srcdoc = '<!DOCTYPE html>'
  iframeBody.innerHTML = component.current.innerHTML

  const styleEl = iframe.contentDocument.createElement('style')
  styleEl.appendChild(iframe.contentDocument.createTextNode(defaultPageStyle))
  iframeHead.appendChild(styleEl)

  for (let i = 0; i < headStyles.length; i++) {
    const clonedStyle = headStyles[i].cloneNode(true)
    iframeHead.appendChild(clonedStyle)
  }

  iframe?.contentWindow?.focus()
  iframe?.contentWindow?.print()
  if (iframe) {
    const html = ''
    iframe.contentWindow.document.open()
    iframe.contentWindow.document.write(html)
    iframe.contentWindow.document.close()
  }
  if (onAfterPrint) {
    onAfterPrint()
  }
}
