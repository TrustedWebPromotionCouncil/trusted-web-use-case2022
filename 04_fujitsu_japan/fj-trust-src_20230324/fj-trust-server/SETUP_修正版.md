# fj-trust-server

## Build Setup

```bash
npm install

// Prisma <https://www.prisma.io/>：データベース
npm install prisma typescript ts-node @types/node --save-dev
npm install @prisma/client
npx prisma
npx prisma init --datasource-provider sqlite
npx prisma migrate dev --name init
# if prisma migrate or prisma generate failed. Install Visual Studio C++ Redistributable
<https://learn.microsoft.com/ja-jp/cpp/windows/latest-supported-vc-redist?view=msvc-170>

// pdfme <https://pdfme.com/>：PDF生成
npm install @pdfme/generator

npm install express
npm install @types/express --save-dev

npm install axios

npx ts-node .\server\api\index.ts

npx nodemon .\server\api\index.ts
# if nodemon is not exist then try "npm install nodemon -g"
```

## Directories

### `prisma`
データベースとそのモジュールを格納しています

### `server`
API群を格納しています

### 
## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

TanukiMagicフォントを利用しています
(https://tanukifont.com/tanuki-permanent-marker/)