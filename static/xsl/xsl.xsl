<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

    <xsl:output
        method="html"
        version="1.0"
        encoding="utf-8"
        indent="no"
        cdata-section-elements="script"
    />

    <xsl:template match="/">
        <html>
        <head></head>
        <body>
          <h1>The XSL has rendered...</h1>
          <span id="hide">The javascript hasn't run :(</span>
        <script src="//cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"></script>
          <div style="width:100%">
            <canvas id="myChart"><script>
          var ctx = document.getElementById('myChart').getContext('2d')
          new Chart(ctx, {
            type: 'horizontalBar',
            data: {
              labels: [
              <xsl:for-each select="//iati-organisations/iati-organisation/total-budget">
                <xsl:if test="position() > 1">, </xsl:if>
                '<xsl:value-of select="period-start/@iso-date" />–<xsl:value-of select="period-end/@iso-date" />'
              </xsl:for-each>
              ],
              datasets: [{
                label: 'Total budget',
                data: [
              <xsl:for-each select="//iati-organisations/iati-organisation/total-budget">
                <xsl:if test="position() > 1">, </xsl:if>
                <xsl:value-of select="value/text()" />
              </xsl:for-each>
                ]
              }]
            },
            options: {
              legend: {
                display: false
              }
            }
          })
          </script></canvas>
          </div>
        </body>
        </html>
    </xsl:template>

</xsl:stylesheet>
