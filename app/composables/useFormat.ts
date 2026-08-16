/**
 * 通用工具函数集合。
 * 提供日期格式化等跨页面共享的纯函数。
 */

/**
 * 格式化日期字符串为中文长格式：2026年1月15日
 */
export function formatDateCN(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * 格式化日期字符串为短格式：2026-01-15
 */
export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
