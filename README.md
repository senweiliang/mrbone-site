# mrbone

> 一个记录学习、想法、与 demo 的数字花园。

线上地址：[mrbone.vercel.app](https://mrbone.vercel.app)

## 技术栈

| 类别 | 选择 | 说明 |
| :--- | :--- | :--- |
| 框架 | [Astro](https://astro.build/) `^6.1.8` | 静态站点生成，零 JS 默认输出，按需 island 化 |
| 内容 | Markdown + [MDX](https://mdxjs.com/) | 通过 `@astrojs/mdx` 集成，支持在 MD 中嵌入组件 |
| 集合 | Astro Content Collections | 用 `src/content/blog/` 管理博文，frontmatter 类型校验 |
| 双向链接 | [`remark-wiki-link`](https://github.com/landakram/remark-wiki-link) | 支持 `[[wiki 风格]]` 链接，匹配数字花园写作习惯 |
| 字体 | Astro Fonts（本地） | `Atkinson` 字体本地托管，`font-display: swap` |
| 样式 | 原生 CSS + CSS Variables | 不引入 Tailwind，保持轻量；样式集中在 `src/styles/` |
| RSS | [`@astrojs/rss`](https://docs.astro.build/en/recipes/rss/) | 自动生成 `/rss.xml` |
| Sitemap | [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/) | 自动生成站点地图，利于 SEO |
| 图像 | [`sharp`](https://sharp.pixelplumbing.com/) | Astro 内置图像优化 |
| 包管理 | [`pnpm`](https://pnpm.io/) `10.28.2` | 通过 `packageManager` 字段锁定 |
| 部署 | [Vercel](https://vercel.com/)（主） + [Netlify](https://www.netlify.com/)（备） | Vercel 用作主站；Netlify 通过 `netlify.toml` 提供大陆可访问的镜像 |

## 项目结构

```text
.
├── public/                  # 静态资源（favicon、OG 图等）
├── src/
│   ├── assets/              # 字体、图片等需经 Astro 处理的资源
│   ├── components/          # Astro 组件（Header / Footer / BaseHead 等）
│   ├── content/
│   │   └── blog/            # 博文 Markdown / MDX 文件
│   ├── content.config.ts    # Content Collections schema 定义
│   ├── layouts/             # 页面布局
│   ├── pages/               # 路由（index / about / blog / rss.xml.js）
│   ├── styles/              # 全局样式与设计 token
│   └── consts.ts            # 站点级常量（标题、描述）
├── astro.config.mjs         # Astro 配置（集成、字体、remark 插件）
├── netlify.toml             # Netlify 构建配置
├── tsconfig.json
└── package.json
```

## 常用命令

| 命令 | 作用 |
| :--- | :--- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动本地开发服务器（`localhost:4321`） |
| `pnpm build` | 构建生产站点到 `./dist/` |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm astro ...` | 调用 Astro CLI（如 `astro check`） |

## 写一篇新博文

写作流程使用 [Obsidian](https://obsidian.md/)，把 `src/content/blog/` 作为 Obsidian Vault 直接打开：

1. 在 Obsidian 中以 `src/content/blog/` 为 vault 路径打开。
2. 新建 `your-slug.md`，按下面的模板补全 frontmatter：

```md
---
title: '标题'
description: '一句话摘要'
pubDate: 'Apr 27 2026'
heroImage: './your-slug-hero.png'   # 可选，相对于 markdown 文件
---

这里写正文。Obsidian 原生的 `[[wiki 链接]]` 会被 `remark-wiki-link` 转成站内路由 `/blog/<slug>`。
```

3. 保存后回到项目根目录运行 `pnpm dev` 实时预览，或直接 commit 推送触发部署。

`content.config.ts` 中的 schema 会校验 frontmatter，缺字段或类型不对都会在 `pnpm dev` 与 `pnpm build` 时报错。

## 部署

- 推送到 `main`，Vercel 基于 `astro.config.mjs` 中的 `site` 自动构建并发布。
- Netlify 作为备用线路，使用根目录的 `netlify.toml`（`pnpm build` → `dist/`）。
