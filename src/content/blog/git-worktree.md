---
title: 'Git-git worktree的使用'
description: '一个 git 仓库能对应多个分支，那为什么不能对应多个工作区目录？记录一下 git worktree 的使用场景与优势。'
pubDate: 'Apr 20 2026'
heroImage: '../../assets/git-worktree-carbon.svg'
---

用了 git 这么多年，居然第一次听说 git worktree，于是搜索了一番学习记录一下。

我们知道，一个 git 仓库可以对应多个分支，通常来说都有一个主分支，例如 master 或 develop，每个研发在日常进行功能开发的时候，都基于 develop 创建新的 feature 分支，代码写好以后合并到主分支。那么你可能遇到过这种场景：你还在 feature 分支开发，此时突然遇到一个紧急的 bug 需要你在 develop 分支提交代码。此前我的做法通常是：

```
1. 把当前所有更改全部提交到一个临时的 commit，push 到远端防止丢失
2. git checkout 到 develop 分支，git pull 拉最新代码
3. git checkout -b hotfix 分支
4. 改 bug 完成后 hotfix 合并到 develop
5. git checkout 到 feature 分支
6. 继续开发 feature
```

还有的小伙伴可能是：

```
复制一个目录，然后直接在新目录切 develop 分支改 bug
```

实际操作下来会发现，在 3-4 步骤之间以及 5-6 步骤时间，需要配置 cmake 以及构建程序，此时由于两个分支之间有差异，checkout 的速度以及 cmake+build 的速度实在不尽如人意，尤其是在分支差异很大的时候，这种感觉更加明显，因为差异文件越多，checkout 的文件需要越多，由于源码变更，很多时候几乎要把整个项目重新编译，这种时候会发现 checkout 的"成本"很高。

复制目录的方式，短期内看起来能解决问题，但是一个 10g 的项目在磁盘上拷贝一份就变成 20g，分支再多点就不敢想象。并且对于每个工作区目录，如果要同步 git 仓库状态，只能先将一个目录的状态 push 到远端，然后在另一个目录 git pull 进行同步，略显繁琐。

说了这么多，终于轮到 git worktree 出场了 :) 既然一个 git 仓库能对应多个分支，那么为什么一个 git 仓库不能对应多个工作区目录呢？遇到上面的场景，我们只需要在当前项目根目录执行：

```bash
git worktree add ../Project-hotfix develop
```

此时就会在上一层目录生成一个 Project-hotfix 目录，这个目录是另一个工作区，对应的分支是 develop。我们 `cd ../Project-hotfix` 就可以进到另一个工作区，git pull 之后，就可以开始愉快的修 bug 了。分支 hotfix 结束后，我们如果希望删除这个工作目录，执行：

```bash
git worktree remove ../Project-hotfix
```

要查看当前有哪些 worktree，使用：

```bash
git worktree list
```

那么和之前的方法比有什么优势呢？我们逐个分析：

1. 相比于 checkout，添加一个新的工作区，使得 C++ 编译的 obj 文件相互独立，即使分支差异很大，只有第一次创建工作区以后需要在新工作区进行一次比较长时间的 build，原工作区完全不受影响。因此对比两次 checkout 后的 build "成本"，我们相当于少了一次。并且如果以后经常需要在不同分支切换，我们不需要将这个工作区删除，节省的 build 成本就更多了。
2. 我们的不同工作区之间，不需要通过远端同步，一个目录的分支和 commit 变更，分支信息实时同步到其他目录，这是因为创建出来的 worktree 使用的 git 信息实际上是引用原目录的 `.git` 目录的，在 Project-hotfix 下可以看到 `.git` 变成一个文件，文件内容指向原目录的 `.git` 文件夹。
3. 新工作区目录的大小比原目录小很多，原因如第二点所述，有相当一部分信息都复用了原始目录 `.git` 文件夹中的信息。

由此可见，在这种场景下，从时间、速度、磁盘利用等角度来看，git worktree 都比原有的方法更加方便、高效。这里贴一个[链接](https://stackoverflow.com/questions/31935776/what-would-i-use-git-worktree-for)，可以看看还有哪些场景适合使用 git worktree。

## 参考

1. [git-worktree 官方文档](https://git-scm.com/docs/git-worktree)
2. [Stack Overflow: What would I use git worktree for?](https://stackoverflow.com/questions/31935776/what-would-i-use-git-worktree-for)
