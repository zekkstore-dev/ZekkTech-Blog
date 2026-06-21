<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap | ZekkTech</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            color: #1e293b;
            background-color: #f8fafc;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: #ffffff;
            padding: 32px;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
            border: 1px solid #e2e8f0;
          }
          h1 {
            font-size: 24px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 8px 0;
          }
          p.desc {
            color: #64748b;
            margin: 0 0 24px 0;
            line-height: 1.6;
          }
          a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
          }
          a:hover {
            text-decoration: underline;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            text-align: left;
          }
          th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 700;
            padding: 12px 16px;
            border-bottom: 2px solid #e2e8f0;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.05em;
          }
          td {
            padding: 14px 16px;
            border-bottom: 1px solid #f1f5f9;
            word-break: break-all;
          }
          tr:hover td {
            background-color: #f8fafc;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            font-size: 11px;
            font-weight: 700;
            border-radius: 9999px;
            background-color: #e0f2fe;
            color: #0369a1;
          }
          .lastmod {
            color: #64748b;
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>XML Sitemap</h1>
          <p class="desc">
            Dibuat secara dinamis oleh <strong>ZekkTech Blog</strong> untuk mempermudah indeksasi mesin pencari seperti Google, DuckDuckGo, Bing, dan lainnya.<br/>
            Ketahui lebih lanjut tentang XML Sitemap di <a href="https://sitemaps.org" target="_blank" rel="noopener">sitemaps.org</a>.
          </p>

          <xsl:if test="sitemap:sitemapindex">
            <p class="desc">Sitemap Index ini berisi <strong><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></strong> sub-sitemap.</p>
            <table>
              <thead>
                <tr>
                  <th style="width: 70%;">Sitemap URL</th>
                  <th style="width: 30%;">Last Modified (UTC)</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                  <tr>
                    <td>
                      <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                    </td>
                    <td>
                      <span class="lastmod"><xsl:value-of select="sitemap:lastmod"/></span>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>

          <xsl:if test="sitemap:urlset">
            <p class="desc">Sitemap ini berisi <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> URL.</p>
            <table>
              <thead>
                <tr>
                  <th style="width: 60%;">URL</th>
                  <th style="width: 10%;">Priority</th>
                  <th style="width: 15%;">Change Freq.</th>
                  <th style="width: 15%;">Last Modified (UTC)</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td>
                      <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                    </td>
                    <td>
                      <span class="badge"><xsl:value-of select="sitemap:priority"/></span>
                    </td>
                    <td>
                      <xsl:value-of select="sitemap:changefreq"/>
                    </td>
                    <td>
                      <span class="lastmod"><xsl:value-of select="sitemap:lastmod"/></span>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
