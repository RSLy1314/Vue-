// mock 动态引入
if (process.env.NODE_ENV === 'development') {
    process.env.Mock && require("./mock/index.js")
}