## 语法
Prisma 的定义语法是基于 GraphQL 的，它允许您使用 GraphQL 类型定义来定义您的数据模型。Prisma 的语法非常简单，易于学习和使用。您可以在 Prisma 的官方文档中找到更多关于 Prisma 语法的信息。¹ 您可以在 Prisma Schema 中定义模型、字段、关系等。下面是一个简单的例子：²

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  author    User?    @relation(fields: [authorId], references: [id]) // 外键关联
  authorId  Int?
}
```

源: 与必应的对话， 2023/4/19(1) 精读《Prisma 的使用》 - 苍青浪 - 博客园. https://www.cnblogs.com/cangqinglang/p/15419469.html 访问时间 2023/4/19.
(2) 下一代前端全栈框架核心——Prisma（附源码实践） - 掘金. https://juejin.cn/post/7008780401170710541 访问时间 2023/4/19.
(3) Prisma：下一代ORM，不仅仅是ORM（下篇） - 掘金 - 稀土掘金. https://juejin.cn/post/6973950142445518884 访问时间 2023/4/19.


## 类型和注解
Prisma 支持多种类型和属性注解，下面是一个简单的表格，其中包含了一些常见的类型和属性注解：¹

| 类型注解 | 描述 |
| --- | --- |
| String | 字符串 |
| Int | 整数 |
| Float | 浮点数 |
| Boolean | 布尔值 |
| DateTime | 日期时间 |

| 属性注解 | 描述 |
| --- | --- |
| @id | 主键 |
| @unique | 唯一性约束 |
| @default(value) | 默认值 |
| @relation(fields: [field], references: [field]) | 关系 |

希望这可以帮助您了解 Prisma 的类型和属性注解。如果您需要更多信息，请查看 Prisma 的官方文档。¹

源: 与必应的对话， 2023/4/19(1) 【TS】一、类型注解 - 掘金 - 稀土掘金. https://juejin.cn/post/7005397846782541860 访问时间 2023/4/19.
(2) ApiModel 和 ApiModelProperty 注解详解 - 掘金 - 稀土掘金. https://juejin.cn/post/7109835493952454693 访问时间 2023/4/19.