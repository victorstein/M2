module.exports = {
  title: 'M2 TypeGraphQL Boilerplate',
  tagline: 'The last API boilerplate I will ever need.',
  url: 'https://victorstein.github.io',
  baseUrl: '/M2/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'victorstein',
  projectName: 'M2',
  themeConfig: {
    navbar: {
      title: 'M2 TypeGraphQL Boilerplate',
      logo: {
        alt: 'M2 TypeGraphQL Boilerplate',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'blog',
          label: 'Blog',
          position: 'left'
        },
        {
          href: 'https://github.com/victorstein/M2',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Slack',
              href: 'https://m2-j0e5519.slack.com/archives/C01CWNLSZ0U',
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/victorstein/M2',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} M2. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
