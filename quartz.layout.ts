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
        // 强制转换为 any 来处理 TypeScript 报错，因为文档确认 file 属性存在于 FileNode
        const nodeA = a as any
        const nodeB = b as any
    
        // 1. 优先将文件夹排在文件前面 (基于是否有 file 属性)
        const isAFolder = !nodeA.file
        const isBFolder = !nodeB.file
    
        if (isAFolder && !isBFolder) return -1 // A 是文件夹，A 在前
        if (!isAFolder && isBFolder) return 1  // B 是文件夹，B 在前
    
        // 2. 如果两者都是文件夹或都是文件，则按创建日期倒序 (最新的在前)
        // 从 node.file.dates.created 中获取日期，使用 new Date(0) (1970年) 作为默认值
        const dateA = nodeA.file?.dates?.created ?? new Date(0)
        const dateB = nodeB.file?.dates?.created ?? new Date(0)
    
        // dateB.getTime() - dateA.getTime() => 实现倒序 (Descending)
        return new Date(dateB).getTime() - new Date(dateA).getTime()
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
