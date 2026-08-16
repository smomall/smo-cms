import type { NavigationMenuItem } from '@nuxt/ui'
import type { NavItemDTO } from '~/types'

/**
 * 将后端 NavItemDTO 树转换为 Nuxt UI NavigationMenuItem 树。
 * 递归处理 children，有子节点的项默认展开。
 */
export function transformToNavItems(
  items: NavItemDTO[] | null | undefined
): NavigationMenuItem[] {
  if (!items?.length) return []
  return items.map((item) => {
    const navItem: NavigationMenuItem = {
      label: item.title
    }
    if (item.icon) navItem.icon = item.icon
    if (item.linkUrl) navItem.to = item.linkUrl
    if (item.target) navItem.target = item.target
    if (item.children?.length) {
      navItem.children = transformToNavItems(item.children)
    }
    return navItem
  })
}

/**
 * 按位置加载导航树。
 * @param location 导航位置编码（对应后端 NavGroup.code，如 header / sidebar / footer）
 *
 * 使用 useAPI（Nuxt useFetch）实现 SSR 数据水合，
 * 布局组件 setup 阶段调用，客户端导航时自动命中缓存。
 */
export function useNav(location: string) {
  return useAPI<NavItemDTO[]>(`/cms/nav/${location}/tree`, { method: 'GET' })
}
