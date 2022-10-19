# Passport Example

## Features

- google passport
- facebook passport
- airbnb style eslint

## install

```
$ npm install
```

## Scripts

```
// run server
$ npm run start

// run eslint
$ npm run lint
```

## 目錄結構 說明

```
.
├── README.md
├── app.js                              express.js 入口
├── server.js                           主程式進入點
├── .eslintrc                           eslint 設定檔
├── .env                                環境變數 設定檔
├── db
│   ├── index.js                        Models 集中匯出
│   ├── models                          存放各個 model 的目錄
│   ├── relationship.js                 記錄 model 間的關聯
│   ├── sequelize.js                    sequelize connection 實例
│   └── setup.js                        執行些 SQL 初始化 任務
├── middleware                          存放各個 express 中間件 的目錄
│   ├── index.js                        中間件 集中匯出
│   ├── authenticateMiddleware.js       ajax api 使用
│   ├── needLoggedInMiddleware.js       登入後，頁面使用
│   ├── needNotLoggedInMiddleware.js    登入前，頁面使用
│   └── parseUserMiddleware.js          一般頁面使用
├── package-lock.json
├── package.json
├── public                              公開靜態檔案
│   ├── css                             存放 css 的目錄
│   └── js                              存放 js 的目錄
├── routes                              express 路由
│   ├── auth.js                         auth 相關路由
│   ├── page.js                         一般的頁面路由
│   ├── signInAfterPage.js              登入後的頁面路由
│   └── signInBeforePage.js             登入前的頁面路由
├── strategies                          登入策略 的目錄
│   ├── facebookStrategy.js             facebook 策略
│   └── googleStrategy.js               google 策略
├── tools                               各種工具函式
│   └── auth                            auth 相關函式 的目錄
│       └── index.js                    auth 相關函式 集中匯出
└── views                               ejs views 目錄
    ├── layout                          ejs layout 目錄
    │   ├── basicLayout.ejs
    │   └── signLayout.ejs
    ├── partial                         ejs partial 目錄
    │   ├── footer.ejs
    │   └── header.ejs
    ├── home.ejs
    ├── dashboard.ejs
    ├── profile.ejs
    ├── signIn.ejs
    └── signUp.ejs
```
