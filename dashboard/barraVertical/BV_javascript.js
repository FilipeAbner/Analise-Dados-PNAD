// JavaScript
// 1) Extrai faixa_etaria e renda_mensal (já média) do Knowage
const raw = datastore.getDataArray(record => ({
    faixa: String(record.faixa_etaria),   // ex.: '15-19', '20-24', ...
    renda: record.renda_mensal             // já agregada no dataset
  }))
  .filter(d => d.faixa && d.renda != null);
  
  // 2) Ordena faixas (mantém "65 ou mais" por último)
  const faixaLabels = Array.from(new Set(raw.map(d => d.faixa)))
    .sort((a, b) => {
      if (a === '65 ou mais') return 1;
      if (b === '65 ou mais') return -1;
      return parseInt(a.split('-')[0],10) - parseInt(b.split('-')[0],10);
    });
  
  // 3) Extrai valores correspondentes e calcula total
  const seriesData = faixaLabels.map(f => {
    const rec = raw.find(d => d.faixa === f);
    return rec ? parseFloat(rec.renda.toFixed(2)) : 0;
  });
  const total = seriesData.reduce((sum, v) => sum + v, 0);
  
  // 4) Configura o gráfico com clickManager, custom tooltip e dataLabels estilizados
  const options = {
    chart: {
      type: 'bar',
      width: '100%',
      height: 500,
      toolbar: { show: true },
      events: {
        click: (_e, _ctx, { dataPointIndex }) => {
          if (dataPointIndex == null) return;
          const faixa = faixaLabels[dataPointIndex];
          datastore.clickManager('faixa_etaria', [faixa]);
          alert(`Filtrado pela faixa: ${faixa}`);
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontWeight: 600,
        colors: ['#444']
      },
  
      formatter: val => val.toFixed(2)
    },
    series: [{ name: 'Renda Média', data: seriesData }],
    xaxis: {
      categories: faixaLabels,
      title: { text: 'Faixa Etária' },
      labels: { rotate: -45, style: { fontSize: '12px' } }
    },
    yaxis: {
      title: { text: 'Renda Média (R$)' },
      labels: {
        formatter: v =>
          `R$ ${v.toLocaleString('pt-BR',{ minimumFractionDigits:2, maximumFractionDigits:2 })}`
      }
    },
    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex }) => {
        const label   = faixaLabels[dataPointIndex];
        const val     = series[seriesIndex][dataPointIndex];
        const percent = ((val / total) * 100).toFixed(1);
        return `
          <div style="padding:6px; color:white; background:rgba(0,0,0,0.7); border-radius:4px;">
            <strong>${label}</strong><br/>
            <span style="font-weight:bold;">${percent}%</span>
          </div>
        `;
      }
    },
    colors: ['#4CAF50'],
    legend: { show: false }
  };
  
  // 5) Renderiza
  new ApexCharts(
    document.querySelector('#renda-faixa-etaria-chart'),
    options
  ).render();
  