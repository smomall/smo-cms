import type { NoteDTO, UseNotesOptions } from '~/types'

/**
 * 笔记游标分页，支持 categoryId 筛选。
 * 基于 useCursorPagination 通用游标分页封装。
 */
export function useNotes(options: UseNotesOptions = {}) {
  const { categoryId, pageSize } = options

  const params = computed(() => {
    const p: Record<string, string | number> = {}
    const cid = toValue(categoryId)
    if (cid) p.categoryId = cid
    return p
  })

  const { items: notes, ...rest } = useCursorPagination<NoteDTO>({
    endpoint: '/cms/notes/cursor',
    params,
    pageSize
  })

  return { notes, ...rest }
}
