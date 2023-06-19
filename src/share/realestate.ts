import {
  Article, //
  Complex,
  ComplexOverview,
  StandardArticle,
  TradeTypeCode,
  FilterArticlePredicate,
  Chain,
} from '@/types'

export interface NaverRealEstate {
  complex: Complex
  articleList: Article[]
  overview: ComplexOverview
}

/**
 * Naver 부동산
 */
export class DefaultNaverRealEstate implements NaverRealEstate {
  complex: Complex
  articleList: Article[]

  /**
   * @param complex 단지 정보
   * @param articleList 매물 리스트
   */
  constructor(complex: Complex, articleList: Article[]) {
    this.complex = complex
    this.articleList = articleList
  }

  /**
   * 단지 overview
   */
  get overview(): ComplexOverview {
    console.log('show overview')
    return {
      name: this.complex.complexName,
      totalHouseHoldCount: this.complex.totalHouseHoldCount,
      useApproveYear: this.complex.useApproveYmd.slice(2, 4),
      standardArticles: convertStandardArticles(this.articleList),
    }
  }
}

function convertStandardArticles(source: Article[]): StandardArticle {
  // 평수별 매매, 전세가
  const target = {} as StandardArticle
  const articlesByArea = groupByArea(source)
  for (const area in articlesByArea) {
    target[area] = {}
    const tradeTypeGroups = groupByTradeType(articlesByArea[area])
    for (const tradeType in tradeTypeGroups) {
      //
      const tradeTypeCode = tradeType as TradeTypeCode
      let backupArticle: Article | undefined = undefined
      target[area][tradeTypeCode] = filterChain<Article>(tradeTypeGroups[tradeTypeCode]) //
        // 거래 유형 별 금액으로 매물을 정렬한다.
        .sort(compareByTradeTypeCodeFn(tradeTypeCode))
        .tab(list => {
          // 필터 조건 이전에 첫번째 매물을 백업한다.
          if (list.length >= 0) backupArticle = list[0]
        })
        // 최상층, 최저층은 제외한다.
        .not.filter(isTopLowFloor)
        // 기준이 되는 매물이 없다면 백업한 매물을 기준으로 한다.
        .firstOr(backupArticle)
    }
  }

  return target
}

function groupByArea(articleList: Article[]): {
  [area: number]: Article[]
} {
  return articleList.reduce((acc, article) => {
    if (!acc[article.area1]) {
      acc[article.area1] = []
    }
    acc[article.area1].push(article)
    return acc
  }, {} as { [area: number]: Article[] })
}

function groupByTradeType(articleList: Article[]): {
  [tradeType in TradeTypeCode]: Article[]
} {
  const tradeTypeGroups: { [tradeType in TradeTypeCode]: Article[] } = {
    A1: [],
    B1: [],
  }
  for (const article of articleList) {
    tradeTypeGroups[article.tradeTypeCode].push(article)
  }

  return tradeTypeGroups
}

function filterChain<T>(items: T[]): Chain<T> {
  let workingArray = [...items]

  const result: Chain<T> = {
    sort: function (compareFn: (a: T, b: T) => number): Chain<T> {
      workingArray.sort(compareFn)
      return result
    },
    filter: function (predicate: (item: T) => boolean): Chain<T> {
      workingArray = workingArray.filter(predicate)
      return result
    },
    not: {
      filter: function (predicate: (item: T) => boolean): Chain<T> {
        workingArray = workingArray.filter(x => !predicate(x))
        return result
      },
    },
    tab: function (tabFn: (list: T[]) => void): Chain<T> {
      tabFn(workingArray)
      return result
    },
    firstOr: function (orValue: T | undefined): T | undefined {
      return this.first || orValue
    },
    get first(): T | undefined {
      return workingArray[0]
    },
    get value(): T[] {
      return workingArray
    },
  }

  return result
}

const compareByTradeTypeCodeFn = (condition: TradeTypeCode) =>
  condition === 'A1' ? comparePriceAsc : comparePriceDesc

/**
 * 매물 오름차순으로 정렬하기 위한 compare 함수
 * @param a 매물1
 * @param b 매물2
 * @returns 비교 결과
 */
function comparePriceDesc(a: Article, b: Article): number {
  const aPrice = convertMonetaryAmountToNumber(a.dealOrWarrantPrc)
  const bPrice = convertMonetaryAmountToNumber(b.dealOrWarrantPrc)
  return bPrice - aPrice
}

/**
 * 매물 내림차순으로 정렬하기 위한 compare 함수
 * @param a 매물1
 * @param b 매물2
 * @returns 비교 결과
 */
function comparePriceAsc(a: Article, b: Article): number {
  const aPrice = convertMonetaryAmountToNumber(a.dealOrWarrantPrc)
  const bPrice = convertMonetaryAmountToNumber(b.dealOrWarrantPrc)
  return aPrice - bPrice
}

const MIN_PRICE = 0

function convertMonetaryAmountToNumber(amount: string): number {
  const [billion, thousand] = extractNumbers(amount)
  if (billion === 0) return MIN_PRICE

  return (
    parseInt(
      [
        //
        billion,
        thousand.toString().padEnd(4, '0'),
        '0000',
      ].join(''),
    ) || MIN_PRICE
  )
}

function extractNumbers(input: string): [number, number] {
  const regexPattern = /(\d+)억(?:\s(\d+(?:,\d+)?))?/
  const match = input.match(regexPattern)

  if (!match) return [0, 0]

  const billion = parseInt(match[1])
  const thousand = match[2] ? parseInt(match[2].replace(/,/g, '')) : 0
  return [billion, thousand]
}

const isTopLowFloor: FilterArticlePredicate = (article: Article) =>
  isLowFloor(article) || isTopFloor(article)

function isTopFloor(article: Article): boolean {
  const [currentFloor, totalFloor] = extractFloorNumbers(article)
  return currentFloor === totalFloor
}

const LOW_FLOOR = 3

function isLowFloor(article: Article): boolean {
  const [currentFloor] = extractFloorNumbers(article)
  return currentFloor <= LOW_FLOOR
}

function extractFloorNumbers(article: Article): [number, number] {
  const [currentFloorStr, totalFloorStr] = article.floorInfo.split('/')

  let currentFloor = 0
  const totalFloor = Number(totalFloorStr)

  // '저' means 3 floor or lower
  if (currentFloorStr === '저') {
    currentFloor = 1
  }
  // '중' means top floor
  else if (currentFloorStr === '중') {
    currentFloor = getMiddleFloor(totalFloor)
  }
  // default
  else {
    currentFloor = Number(currentFloorStr)
  }

  return [currentFloor, totalFloor]
}

function getMiddleFloor(totalFloor: number): number {
  return Math.floor(totalFloor / 2)
}
