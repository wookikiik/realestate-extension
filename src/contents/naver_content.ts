// import './naver_content.css'
import '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'
import '@/components/complexOverview'
import { loadScript, getNaverComplexNo } from '@/share'
import loadStorageWatch from './storage'
import loadMessageEvent from './message'
import { showStandardArticles } from './complex'

loadStorageWatch()
loadMessageEvent()
loadScript('scripts/naver_adapter.js')
;(async () => {
  const complexNo = getNaverComplexNo(window.location.href)
  if (complexNo) {
    await showStandardArticles(complexNo)
  }
})()
