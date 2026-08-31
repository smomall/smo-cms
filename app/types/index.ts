import type { MaybeRefOrGetter } from 'vue'

// ===================== 通用类型 =====================

/** 游标分页结果 */
export interface OpenCursorResult<T> {
  records: T[]
  nextCursor: string | null
  hasMore: boolean
}

/** 通用分页结果（MyBatis-Flex 风格） */
export interface PageResult<T> {
  records: T[]
  pageNumber: number
  pageSize: number
  totalPage: number
  totalRow: number
}

// ===================== 文章类型 =====================

/**
 * 文章 DTO。
 * 所有字段标记为可选（?）：列表接口不会返回 content/html/seo*，
 * 且 cover/description 等字段可能为 null 或空字符串。
 */
export interface ArticleDTO {
  id: string
  categoryId?: string
  cover?: string | null
  title: string
  description?: string | null
  content?: string | null
  contentType?: string
  viewCount?: number | null
  likeCount?: number | null
  commentCount?: number | null
  wordCount?: number | null
  rating?: number
  allowComment?: boolean
  publishAt?: string | null
  source?: string | null
  sourceUrl?: string | null
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
  /** 主分类（开放接口详情/列表回填） */
  category?: CategoryDTO | null
  /** 关联标签列表（开放接口详情/列表回填） */
  tags?: TagDTO[] | null
}

/** useArticles 组合式函数选项 */
export interface UseArticlesOptions {
  categoryId?: MaybeRefOrGetter<string | number | undefined>
  tagId?: MaybeRefOrGetter<string | number | undefined>
  sort?: MaybeRefOrGetter<string | undefined>
  pageSize?: number
}

// ===================== 分类类型 =====================

/** 分类 DTO */
export interface CategoryDTO {
  id: string
  title: string
  slug: string
  description?: string | null
  cover?: string | null
  icon?: string | null
  parentId?: string | null
  articleCount?: number
  sort?: number
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
}

// ===================== 标签类型 =====================

/** 标签 DTO */
export interface TagDTO {
  id: string
  title: string
  slug: string
  description?: string | null
  cover?: string | null
  icon?: string | null
  articleCount?: number
  sort?: number
}

// ===================== 导航类型 =====================

/** 导航项 DTO */
export interface NavItemDTO {
  id: string
  parentId?: string | null
  title: string
  icon?: string | null
  linkUrl?: string | null
  target?: string | null
  sort?: number
  children?: NavItemDTO[] | null
}

// ===================== 笔记类型 =====================

/** 笔记 DTO */
export interface NoteDTO {
  id: string
  categoryId?: string
  cover?: string | null
  title: string
  description?: string | null
  publishAt?: string | null
  /** 主分类（开放接口详情/列表回填） */
  category?: CategoryDTO | null
  /** 关联标签列表（开放接口详情/列表回填） */
  tags?: TagDTO[] | null
}

/** useNotes 组合式函数选项 */
export interface UseNotesOptions {
  categoryId?: MaybeRefOrGetter<string | number | undefined>
  pageSize?: number
}

/** 章节 DTO */
export interface ChapterDTO {
  id: string
  noteId?: string
  parentId?: string | null
  title: string
  description?: string | null
  /** 发布状态：0=草稿，1=发布 */
  status?: string | number | null
  sort?: number
  children?: ChapterDTO[] | null
}

/** 文档 DTO */
export interface DocumentDTO {
  title: string
  description?: string | null
  content?: string | null
  contentType?: string
  wordCount?: number
}

// ===================== 页面类型 =====================

/** 页面 DTO */
export interface PageDTO {
  id: string
  parentId?: string
  modelId?: string
  slug?: string
  cover?: string | null
  title: string
  description?: string | null
  publishAt?: string | null
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
  pageType?: 'page' | 'list' | string
  sort?: number
  path?: string
  parentPath?: string
  children?: PageDTO[] | null
}
