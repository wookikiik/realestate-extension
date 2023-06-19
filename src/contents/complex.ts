import { ComplexOverview } from '@/components/complexOverview'
import {
  fetchComplexOverview,
  fetchArticleList,
  DefaultNaverRealEstate,
  NAVER_MESSAGE_OPEN_PANEL_OVERVIEW,
} from '@/share'
import { Complex } from '@/types'

export async function showStandardArticles(complexNo: string) {
  const summaryInfo = document.querySelector('.complex_summary_info')
  if (!summaryInfo) {
    return
  }

  const complex = await fetchComplexOverview(complexNo)
  const peongsNoList = getPyeongsNoList(complex)
  const articles = await fetchArticleList(complexNo, peongsNoList)
  const realEstate = new DefaultNaverRealEstate(complex, articles)

  summaryInfo.querySelector('complex-overview')?.remove()

  const element = new ComplexOverview()
  element.setOverview(realEstate.overview)
  summaryInfo.appendChild(element)

  await chrome.runtime.sendMessage({
    type: NAVER_MESSAGE_OPEN_PANEL_OVERVIEW,
    realEstate,
    sample: 'sample',
  })
}

function getPyeongsNoList(complex: Complex): string[] {
  return (complex.pyeongs || [])
    .filter(pyeong => {
      const name = Number(pyeong.pyeongName2.replace(/[^0-9]/g, ''))
      return name >= 16 && name <= 37
    })
    .map(pyeong => pyeong.pyeongNo + '')
}
