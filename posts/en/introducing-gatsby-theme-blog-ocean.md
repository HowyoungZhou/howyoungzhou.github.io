---
title: Introducing Gatsby Theme Blog Ocean
date: 2022-02-10
image: '../../assets/blog-ocean.png'
---

# Introducing Gatsby Theme Blog Ocean

Recently, I refactored the blog to reorganize the structure of the project and bump the main dependencies, Gatsby and MUI (Material UI), to the latest version. I packaged it as a Gatsby theme [`gatsby-theme-blog-ocean`](https://www.gatsbyjs.com/plugins/gatsby-theme-blog-ocean/), which can be reused to build your own blog and homepage! In this post, I will share more about the update to the blog.

## Improvements to the UI & UX Design

While refactoring the blog, I also made some small improvements to the user interface and experience. I replaced the grid layout of the cards on the home page with the experimental [Masonry](https://mui.com/components/masonry/) component from MUI, which provides a better layout when the height of cards varies. I am still considering a new look of the home page with better visual effects add more elements.

Other improvements include:

- The table of contents was redesigned so that the current section you are reading will be highlighted.
- The app bar now looks better on devices with smaller screens. 
- The language menu now displays the names of languages in the current language and the target language.

## Technical Updates

### MUI 5

After a long time of testing, MUI 5 has been released finally. One of the breaking changes is the deprecation of JSS embracing styled components, which looks good to me since it allows us to reuse the style better. Arguments are also allowed to be passed to customize the styled element.

When migrating to MUI 5, I rewrote most of the code to adapt to styled components. I also adjusted the structure of some of the components for a smaller granularity, leading to more flexibility to reuse and customize them.

For example, now the banner on the home page can be implemented using the code below. The background can be easily changed by passing the `background` props to the component.

```ts
const StyledAppBar = styled(AppBar)<{ background?: string }>(({ background }) => ({
  color: '#fff',
  minHeight: '45vh',
  display: 'flex',
  justifyContent: 'space-between',
  background: background
}));
```

### Gatsby 4

Gatsby has also published a new major version - Gatsby 4, with a bunch of new features and improvements. This site is a simple statically generated site, so I did not use some new features in Gatsby 4 like Server-Side Rendering. But I am considering enabling Deferred Static Generation when the blog grows larger and the building time becomes too long. Additionally, thanks to the Parallel Query Running, the building time of the site has been half a minute shorter.

### Yarn 3

I also migrated to the modern version of Yarn as the package manager of the theme and the blog. Yarn now supports [Corepack](https://nodejs.org/dist/latest/docs/api/corepack.html), a new binary shipped with Node.js to manage package managers. So after running `yarn set version stable`, the `packageManager` property will be set in `package.json`.

The good news from modern Yarn is that it gets rid of `node_modules`, the second most massive object in the universe. This is realized through the feature [Plug'n'Play (PnP)](https://yarnpkg.com/features/pnp). Yarn in PnP mode saves each dependent package in a single zip file, and provides Node with a virtual path to the files in the package. Yarn hacked the `fs` module in Node so that when Node seems to read the file under that virtual path, it actually read directly from the zip file. This dramatically decreases the number of package files, which speeds up package installing with less I/O operations. Yarn even recommends committing zipped packages to the version control system so that once you pull the code and packages from it, you can run it without installing dependencies. This feature is called [Zero-Installs](https://yarnpkg.com/features/zero-installs).

Unfortunately here comes the bad news, since the patch to `fs` by Yarn is not perfect. When a dependency expects the existence of a real path under the `node_modules`, the PnP mode will become incompatible. Gatsby [uses](https://github.com/gatsbyjs/gatsby/blob/d94c8e48a3640b59423c37da1439531ab0c023ec/packages/gatsby/src/redux/actions/public.js#L328) `true-case-path` to normalize the path so that the file name remains the same case as in the file system. `true-case-path` [uses](https://github.com/Profiscience/true-case-path/blob/8a016e6a8be64c873aba414fbcdb4748e24dc796/index.js#L89) `fs.readdir` to find contents in a directory and recursively replaces each segment of the given path to the normalized version. Sadly, `fs.readdir` was not patched by Yarn. This issue should be the last obstacle for our theme to migrate to PnP.

The CLI of Yarn has also been changed slightly. Some commands are now provided through plugins, which should be imported first. For example, to update the version of a package, you need to use:

```bash
yarn plugin import version # run only once
yarn version major # or minor, patch, etc.
```

To publish a package to NPM using a CI/CD system, you can use:

```bash
yarn config set npmAuthToken $NPM_TOKEN
yarn config set npmAlwaysAuth true
yarn install
yarn npm publish
```
