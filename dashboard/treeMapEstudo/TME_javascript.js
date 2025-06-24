// 1) Buscando e filtrando dados
const raw = datastore.getDataArray(r => ({
    year: r.anos_estudo,    // anos de estudo
    income: r.renda_mensal  // renda mensal
  }))
  .filter(d => d.year != null && d.income != null);
  
  // 2) Agrupar por ano e calcular média de renda
  const grouped = raw.reduce((acc, { year, income }) => {
    if (!acc[year]) acc[year] = { sum: 0, count: 0 };
    acc[year].sum += income;
    acc[year].count += 1;
    return acc;
  }, {});
  
  const seriesData = Object.entries(grouped)
    .map(([year, { sum, count }]) => ({
      x: `${year} ano${year > 1 ? 's' : ''}`, 
      y: Math.round(sum / count)
    }))
    .sort((a, b) => {
      const ya = parseInt(a.x, 10);
      const yb = parseInt(b.x, 10);
      return ya - yb;
    });
  
  // 3) Configuração do gráfico com clickManager
  const options = {
    chart: {
      type: 'treemap',
      height: '100%',
      width: '100%',
      toolbar: { show: true },
      events: {
        click: function(event, chartContext, config) {
          const idx = config.dataPointIndex;
          if (idx == null || idx < 0) return;
  
          // pega o ponto clicado diretamente da série
          const point = config.config.series[0].data[idx];
          const label = point && point.x;           // ex: "3 anos"
          if (!label) return;
  
          // extrai o número de anos (parte antes do espaço)
          const year = parseInt(label.split(' ')[0], 10);
          if (isNaN(year)) return;
  
          // aplica o filtro
          datastore.clickManager('anos_estudo', year);
          alert(`Filtro aplicado: ${year} ano${year > 1 ? 's' : ''} de estudo`);
        }
      }
    },
    series: [{ data: seriesData }],
    colors: ['#569437', '#6E9F3A', '#74AA3D', '#8ABB41', '#A4CC46'],
    legend: { show: false },
    tooltip: {
      y: {
        formatter: v => `R$ ${v.toLocaleString('pt-BR')}`
      }
    }
  };
  
  // 4) Renderiza
  new ApexCharts(
    document.querySelector("#treemap-chart"),
    options
  ).render();
  