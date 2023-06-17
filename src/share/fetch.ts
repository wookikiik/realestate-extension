type ArticleParams = {
  complextNo: string
  tradeType: string
  aareaNos: string
  order: string
  page: number
}
export async function fetchArticleList(params: ArticleParams) {
  console.log(params)
}
