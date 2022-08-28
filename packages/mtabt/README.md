# <img src="https://i.imgur.com/9sPHeak.png" height="28" />&nbsp;&nbsp;MTA Build Tool

MTA Build Tool is a framework that provides you convenience features to help you develop and maintain resources for MTA:SA in a straightforward, approachable & reliable manner while delievering good developer experience.

![Banner](https://i.imgur.com/hlj4pM5.png)

## Getting started

> **⚠️ &nbsp;&nbsp;MTA Build Tool is currently alpha and may not work as expected**

### Prerequisites

Please note this is a [NodeJS](https://nodejs.org) project. In order to try it out, you must have the development tools installed in your computer. You can quickly search on YouTube how to install [NodeJS](https://nodejs.org), [Yarn](https://classic.yarnpkg.com/lang/en/docs/install) & [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) on your system (Windows or Linux).

After having NodeJS, Yarn and Git installed, you will need to clone this repository and run the example provided inside the examples directory. Open a terminal in the desktop or a directory of your choice and type the following commands:

> If you've never dealt with a NodeJS project, this will feel very nonsense. Don't worry we'll make this process much easier soon.

```bash
git clone https://github.com/alvesvin/mtabt.git
cd mtabt
yarn install && yarn build
cd examples/mtabt
yarn dev # or yarn build
```
## Features

- Live reload on the development server
- Pluggable build system
- Incremental builds

### Featured plugins

- [Archive](https://github.com/alvesvin/mtabt/tree/main/packages/plugins/archive)
- [Minify](https://github.com/alvesvin/mtabt/tree/main/packages/plugins/minify)
- Dotenv ([soon](https://github.com/alvesvin/mtabt/issues/3))
- Meta ([soon](https://github.com/alvesvin/mtabt/issues/4))
- Luac ([soon](https://github.com/alvesvin/mtabt/issues/5))
