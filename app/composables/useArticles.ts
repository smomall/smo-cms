import type { ArticleDTO, UseArticlesOptions } from '~/types'

/**
 * 文章游标分页，支持 categoryId / tagId / sort 筛选。
 * 基于 useCursorPagination 通用游标分页封装。
 */
export function useArticles(options: UseArticlesOptions = {}) {
  const { categoryId, tagId, sort, pageSize } = options

  const params = computed(() => {
    const p: Record<string, string | number> = {}
    const cid = toValue(categoryId)
    const tid = toValue(tagId)
    const s = toValue(sort)
    if (cid) p.categoryId = cid
    if (tid) p.tagId = tid
    if (s) p.sort = s
    return p
  })

  const { items: articles, ...rest } = useCursorPagination<ArticleDTO>({
    endpoint: '/cms/articles/cursor',
    params,
    pageSize
  })

  return { articles, ...rest }
}
