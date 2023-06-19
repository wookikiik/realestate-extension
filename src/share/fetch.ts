import { getLocalValue } from '@/share'
import { Article, Complex } from '@/types'

const API_PREFIX = 'https://new.land.naver.com/api'
const API_COMPLEX_OVERVIEW_PREFIX = `/complexes/overview`
const API_ARTICLE_LIST_PREFIX = `/articles/complex`

export async function fetchComplexOverview(complexNo: string): Promise<Complex> {
  return await useHttpClient()
    .appendParams('complexNo', complexNo + '')
    .get(`${API_COMPLEX_OVERVIEW_PREFIX}/${complexNo}`)
    .catch(e => console.error(e))
}

export async function fetchArticleList(
  complexNo: string,
  areaNoList: string[],
): Promise<Article[]> {
  //
  const params = {
    tradeType: 'A1:B1', // 매매, 전세
    sameAddressGroup: 'true',
    areaNos: areaNoList.join(':'),
    complexNo: `${complexNo}`,
    order: 'prcDesc',
    page: '0', // start from 1
  }

  const httpClient = useHttpClient() //
    .appendHeader('Authorization', `Bearer ${await getLocalValue('token')}`) //

  const articleList: Article[] = []
  const fetchContinue = async () => {
    params.page = Number(params.page) + 1 + ''
    await httpClient
      .setParams(params)
      .get(`${API_ARTICLE_LIST_PREFIX}/${complexNo}`)
      .then(async data => {
        articleList.push(...data.articleList)
        if (data.isMoreData === true) {
          await fetchContinue()
        }
      })
      .catch(e => console.error(e))
  }

  await fetchContinue()
  return articleList
}

export function useHttpClient() {
  const headers = new Headers()
  let params = new URLSearchParams()

  const httpClient = {
    setParams(data: { [key: string]: string }) {
      params = new URLSearchParams(data)
      return httpClient
    },
    appendParams(key: string, value: string) {
      params.append(key, value)
      return httpClient
    },
    appendHeader(key: string, value: string) {
      headers.append(key, value)
      return httpClient
    },
    async get(url: string) {
      return fetch(
        `${API_PREFIX}${url}?${params.toString()}`, //
        {
          headers,
        },
      ).then(res => res.json())
    },
  }

  return httpClient
}
