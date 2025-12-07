import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      sortFn: (a, b) => {
        // 使用 as any 绕过 TypeScript 严格检查，安全访问 file 属性
        const nodeA = a as any
        const nodeB = b as any
        
        const aIsFile = !!nodeA.file
        const bIsFile = !!nodeB.file

        // 1. 文件夹优先于文件 (这是 Explorer 结构所必需的)
        if (!aIsFile && bIsFile) return -1 // a 是文件夹，a 在前
        if (aIsFile && !bIsFile) return 1  // b 是文件夹，b 在前

        // 2. 如果两者都是文件 (笔记)
        if (aIsFile && bIsFile) {
          const dateA = nodeA.file?.dates?.created ?? new Date(0)
          const dateB = nodeB.file?.dates?.created ?? new Date(0)

          // 按创建日期倒序 (最新的在前)
          const dateComparison = new Date(dateB).getTime() - new Date(dateA).getTime()
          
          if (dateComparison !== 0) {
            return dateComparison // 🚨 日期不同时，按日期逆序排序
          }
        }

        // 3. 如果两者都是文件夹，或者两者都是文件但日期相同 (稳定排序)
        // 回退到按 displayName 字母顺序排序，确保文件夹之间或日期相同的笔记之间稳定不乱序
        return nodeA.displayName.localeCompare(nodeB.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
