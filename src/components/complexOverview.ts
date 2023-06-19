import { ComplexOverview as Overview } from '@/types'
const template = document.createElement('template')
template.innerHTML = `
<style>
.extension_complex_overview {
    margin-top: 10px;
    background-color: #fff;
    width: 100%;
    visibility: inherit;
  }
  
  .extension_complex_overview .article_price_wrap {
    position: relative;
  }
  
  .extension_complex_overview .article_price_wrap .pyeong {
    display: inline-block;
    font-size: 13px;
    width: 30px;
    text-align: left;
    margin-right: 10px;
    letter-spacing: -0.5px;
    color: #555;
  }
  
  .extension_complex_overview .article_price_wrap .price {
    display: inline-block;
    width: 100px;
    vertical-align: middle;
    overflow: hidden;
    font-size: 13px;
    margin-right: 20px;
    font-weight: bold;
    letter-spacing: -0.5px;
    color: #222;
  }
  
</style>
<div class="extension_complex_overview">
</div>
`

export class ComplexOverview extends HTMLElement {
  root: ShadowRoot
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.root.appendChild(template.content.cloneNode(true))
  }

  setOverview(overview: Overview) {
    const root = this.root.querySelector('div.extension_complex_overview')
    if (!root) {
      return
    }

    root.innerHTML = ''
    if (!overview.standardArticles) {
      return
    }

    // object overview.standardArticles for each pyeong
    for (const pyeong in overview.standardArticles) {
      const displayPyeong = calculatePyung(Number(pyeong))
      const articleList = overview.standardArticles[pyeong]
      if (!articleList) {
        continue
      }

      const articlePriceWrap = document.createElement('div')
      articlePriceWrap.classList.add('article_price_wrap')

      const pyeongElement = document.createElement('span')
      pyeongElement.classList.add('pyeong')
      pyeongElement.innerText = `${displayPyeong}평`
      articlePriceWrap.appendChild(pyeongElement)

      const a1 = articleList['A1']
      const price1 = document.createElement('span')
      price1.classList.add('price')
      price1.innerText = a1 ? a1.dealOrWarrantPrc : '-'
      articlePriceWrap.appendChild(price1)

      const b1 = articleList['B1']
      const price2 = document.createElement('span')
      price2.classList.add('price')
      price2.innerText = b1 ? b1.dealOrWarrantPrc : '-'
      articlePriceWrap.appendChild(price2)

      root.appendChild(articlePriceWrap)
    }
  }
}

window.customElements.define('complex-overview', ComplexOverview)

function calculatePyung(areaInSquareMeters: number): number {
  const conversionFactor = 0.3025
  const pyungArea = areaInSquareMeters * conversionFactor
  return Math.floor(pyungArea)
}

function convertMonetaryAmountToNumber(amount: string): string {
  const [billion, thousand] = extractNumbers(amount)
  if (billion === 0) return '0'

  let price =
    parseInt(
      [
        //
        billion,
        thousand.toString().padEnd(4, '0'),
        '0000',
      ].join(''),
    ) || 0
  if (price >= 10000) {
    price = price / 10000
  }

  return price + ''
}

function extractNumbers(input: string): [number, number] {
  const regexPattern = /(\d+)억(?:\s(\d+(?:,\d+)?))?/
  const match = input.match(regexPattern)

  if (!match) return [0, 0]

  const billion = parseInt(match[1])
  const thousand = match[2] ? parseInt(match[2].replace(/,/g, '')) : 0
  return [billion, thousand]
}
