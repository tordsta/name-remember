/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://nameremember.com",
  generateRobotsTxt: true,
  exclude: ["/api/*", "/edit/*", "/memorize/*", "/dashboard", "/profile"],
};
