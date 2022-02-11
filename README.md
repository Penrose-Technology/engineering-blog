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

## Avatar

在项目根目录下，进入 `static/avatars`目录，在这个目录里添加以作者名字命名的头像文件：比如`张三.jpg`,目前头像文件格式支持：

 - jpg(jpeg)
 - png
 - webp
 - svg

## User About Page

使用`pnpm new`命令创建的博客，会自动检查是否有about页面，如果没有，会自动在目录：`src/routes/users/`下创建以作者名字命名的markdown文件，比如 `张三.md`，也可以自行在目录里添加这个文档。这个文档里可以添加作者的自我介绍。

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `npm run preview`.


## 已知问题

在开发中(pnpm dev), 如果删除某个博客或者作者目录，请关闭服务, 重启(pnpm dev), 不然由于缓存问题会引起页面bug。
