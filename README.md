# engineering-blog

## Developing

```bash

# use pnpm as package manager
npm i -g pnpm

# install dependencies
pnpm i

# start Dev Server
pnpm dev
```

## Create new post

```bash

# 使用脚本创建一个demo页面
pnpm new

# 或者
cd src/routes/posts

# 在这个目录下，创建{作者}目录，在{作者}目录下，创建{文件名}.md
mkdir {author} && cd {auther} && touch {post}.md

# 手动创建markdown文件满足格式要求：

---
title:  (标题, 必填)
state:  (状态: 1草稿，2可发布, 必填)
tags:   (tags, 多个tag使用空格分开, 选填)
category: (category, 多个category使用空格分开, 选填)
---

This is A Demo.
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `npm run preview`.


## 已知问题

在开发中(pnpm dev), 如果删除某个博客或者作者目录，请关闭服务, 重启(pnpm dev), 不然由于缓存问题会引起页面bug。
