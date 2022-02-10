module.exports = {
  siteMetadata: {
    author: 'Howyoung',
    social: [
      {
        name: `GitHub`,
        url: `https://github.com/HowyoungZhou`,
      },
      {
        name: `Email`,
        url: `mailto:me@howyoung.dev`,
      },
    ],
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `posts`,
        name: `posts`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/locales`,
        name: `locales`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `assets`,
        name: `assets`
      }
    },
    {
      resolve: `gatsby-theme-blog-ocean`,
      options: {
        title: `Howyoung's Blog`,
        description: `A tech enthusiast's blog.`,
        siteUrl: 'https://www.howyoung.dev',
        languages: ['en', 'zh', 'ja'],
        localesSource: 'locales'
      }
    }
  ],
}
