/**
 * 安全提取路由参数为字符串。
 * 处理 vue-router 的 `string | string[]` 类型，取第一个元素。
 */
export function getRouteParam(
  param: string | string[] | undefined
): string {
  if (param == null) return ''
  return Array.isArray(param) ? (param[0] ?? '') : param
}
