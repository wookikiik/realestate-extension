import { createApp } from 'vue'
import App from '@/components/sidePanel.vue'

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'sample') {
    const messageContainer = document.getElementById('message')
    if (messageContainer) {
      messageContainer.innerHTML = 'reviced message from background'
    }

    sendResponse({ message: 'success' })
  }
})

createApp(App).mount('#sidepanel')
