import type {
  ArticleDTO,
  CategoryDTO,
  TagDTO,
  PageDTO,
  NoteDTO,
  ChapterDTO,
  DocumentDTO,
  PageResult
} from '~/types'
import type { MaybeRefOrGetter } from 'vue'

// ===================== 文章 API =====================

export function useArticleDetail(id: MaybeRefOrGetter<string>) {
  return useAPI<ArticleDTO>(() => `/cms/articles/${toValue(id)}`, {
    method: 'GET'
  })
}

export function useArticleTags(id: MaybeRefOrGetter<string>) {
  return useAPI<TagDTO[]>(() => `/cms/articles/${toValue(id)}/tags`, {
    method: 'GET'
  })
}

export function useArticleCategories(id: MaybeRefOrGetter<string>) {
  return useAPI<CategoryDTO[]>(
    () => `/cms/articles/${toValue(id)}/categories`,
    { method: 'GET' }
  )
}

// ===================== 分类 API =====================

export function useCategoryBySlug(slug: MaybeRefOrGetter<string>) {
  return useAPI<CategoryDTO>(() => `/cms/categories/${toValue(slug)}`)
}

// ===================== 标签 API =====================

export function useTagBySlug(slug: MaybeRefOrGetter<string>) {
  return useAPI<TagDTO>(() => `/cms/tags/${toValue(slug)}`)
}

// ===================== 页面 API =====================

export function usePageByPath(path: MaybeRefOrGetter<string[]>) {
  return useAPI<PageDTO>(
    () => `/cms/pages/path`,
    { method: 'POST', body: path }
  )
}

export function usePageContent(id: MaybeRefOrGetter<string>) {
  return useAPI<string>(
    () => `/cms/pages/${toValue(id)}/content`,
    { method: 'GET' }
  )
}

export function usePageChildren(
  id: MaybeRefOrGetter<string>,
  pageNumber: MaybeRefOrGetter<number> = 1
) {
  return useAPI<PageResult<PageDTO>>(
    () => `/cms/pages/${toValue(id)}/children?pageNumber=${toValue(pageNumber)}`,
    { method: 'GET' }
  )
}

// ===================== 笔记 API =====================

export function useNoteDetail(id: MaybeRefOrGetter<string>) {
  return useAPI<NoteDTO>(() => `/cms/notes/${toValue(id)}`, {
    method: 'GET'
  })
}

export function useNoteChapters(id: MaybeRefOrGetter<string>) {
  return useAPI<ChapterDTO[]>(() => `/cms/notes/${toValue(id)}/chapters`, {
    method: 'GET'
  })
}

export function useChapterDocument(
  noteId: MaybeRefOrGetter<string>,
  chapterId: MaybeRefOrGetter<string>
) {
  return useAPI<DocumentDTO>(
    () => `/cms/notes/${toValue(noteId)}/chapters/${toValue(chapterId)}`,
    { method: 'GET' }
  )
}
