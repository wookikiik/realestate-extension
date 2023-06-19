declare global {
  interface Window {
    App: {
      state: {
        token: {
          token: string
        }
      }
    }
  }
  const extensionID: string
}

export type ArticleRealEstateTypeCode = 'A01'

export type TradeTypeCode = 'A1' | 'B1' // A1: 매매, B1: 전세

export interface Pyeong {
  pyeongNo: number
  supplyAreaDouble: number // 79.27
  supplyArea: string // "79.27"
  pyeongName: string // 79A
  pyeongName2: string // 23A
  exclusiveArea: string // 59.97
  exclusivePyeong: string // 18.14
}

export interface Complex {
  complexNo: string // 3203
  complexName: string // 신도림일신건영
  totalHouseHoldCount: number // 124
  useApproveYmd: string // 19980728
  pyeongs?: Pyeong[]
}

export interface Article {
  articleNo: string // ID
  articleName: string // 신길대성유니드
  buildingName: string // 1동
  area1: number
  area2: number
  areaName: string // "103B"
  dealOrWarrantPrc: string // 5억
  floorInfo: string // 8/15
  tradeTypeCode: TradeTypeCode // B1
  tradeTypeName: string // 전세
  articleRealEstateTypeCode: ArticleRealEstateTypeCode // A01
  articleRealEstateTypeName: string // 아파트
  realEstateTypeCode: string // APT
  realEstateTypeName: string // 아파트
  isComplex: boolean // true
  sameAddrMaxPrc: string // 8억 3,000
  sameAddrMinPrc: string // 8억
}

export type StandardArticle = {
  // 평수별 매매, 전세가
  [pyung: string]: {
    [tradeType in TradeTypeCode]?: Article
  }
}
export type PricesByTradeType = {
  [tradeType in TradeTypeCode]?: Article
}

export type PricesByAreaAndTradeType = {
  [area: number]: PricesByTradeType
}

export type Chain<T> = {
  readonly value: T[]
  sort: (compareFn: (a: T, b: T) => number) => Chain<T>
  filter: (predicate: (item: T) => boolean) => Chain<T>
  not: {
    filter: (predicate: (item: T) => boolean) => Chain<T>
  }
  tab: (tabFn: (list: T[]) => void) => Chain<T>
  first: T | undefined
  firstOr: (defaultValue: T | undefined) => T | undefined
}

export type FilterArticlePredicate = (article: Article) => boolean
export type FilterArticleFnWrapper = (
  predicate: FilterArticlePredicate,
) => FilterArticleFn
export type FilterArticleFn = (articleList: Article[]) => Article[]

export type ComplexOverview = {
  name: string // 아파트명
  useApproveYear: string // 입주년도(YY)
  totalHouseHoldCount: number // 총 세대수
  standardArticles?: StandardArticle
}

type TradeTypeName = '매매' | '전세'
export type StandardPriceByAreaAndTradeType = {
  // 평수별 기준 매매, 전세가
  [pyung: string]: {
    [tradeType in TradeTypeName]?: number
  }
}
