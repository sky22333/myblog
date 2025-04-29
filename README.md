### 基于AI开发的简约静态博客

## 框架
- [x] Astro项目
- [x] ShadcnUI组件库
- [x] Tailwind CSS


## 实现

- [x] 实现深色/浅色模式
- [x] 流畅的动画效果
- [x] 响应式设计
- [x] 良好的SEO和性能
- [x] 优化图片处理
- [x] 增强交互效果
- [x] Markdown编写文章
- [x] 实现文章归档功能
- [x] 文章搜索功能
- [x] 实现图片灯箱效果
- [x] 实现回到顶部功能
- [x] 实现页面过渡动画
- [x] 实现视频播放器功能
- [x] 实现回到顶部功能
- [x] 优化页面过渡动画
- [ ] 更多细节待完善

## 站点配置

- 站点配置：`src/content/config/site.json`
- 域名配置：`astro.config.mjs`

`src/content/authors/default.json`文件配置：当文章引用"default"作为作者ID或没有明确指定作者时，系统会使用这个文件中的信息。



## 构建
```
pnpm i
```
```
pnpm run build
```
测试
```
pnpm run dev
```
