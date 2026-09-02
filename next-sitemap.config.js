/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://itapimpresiones.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/admin/*', '/auth/*', '/checkout/*', '/api/*'],

  // Generar URLs dinámicas para productos
  additionalPaths: async (config) => {
    const result = []

    // Aquí agregaríamos lógica para obtener productos dinámicamente
    // Por ahora, paths estáticos basados en las rutas existentes
    const staticPaths = [
      {
        loc: '/catalogo',
        changefreq: 'daily',
        priority: 0.9,
      },
    ]

    return staticPaths
  },

  // Configuración de robots.txt
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/auth/', '/checkout/', '/api/'],
      },
    ],
  },

  // Transform function para personalizar URLs
  transform: async (config, path) => {
    // Personalizar prioridades según el tipo de página
    if (path.includes('/producto/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
      }
    }

    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
      }
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
    }
  },
}
