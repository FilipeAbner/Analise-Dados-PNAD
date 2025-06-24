// 2) Dados pré‑agregados
const raw = datastore.getRecords().map(r => ({
    region:   r.area_simplificada.trim(),
    activity: r.atividade_principal_desc_atr.trim(),
    count:    r.codigo_trabalho_pessoa
  }));
  
  const regions    = Array.from(new Set(raw.map(r => r.region)));
  const activities = Array.from(new Set(raw.map(r => r.activity)));
  
  const series = activities.map(activity => ({
    name: activity,
    data: regions.map(region => {
      const rec = raw.find(r => r.region === region && r.activity === activity);
      return { x: region, y: rec ? rec.count : 0 };
    })
  }));
  
  // 3) Faixas de cor com rótulos
  const ranges = [
    { from:    0, to:   100,  color: '#D3E5FF', label: '0–100' },
    { from:  101, to:  1000,  color: '#74AA3D', label: '101–1000' },
    { from: 1001, to:  5000,  color: '#FFCA3A', label: '1001–5000' },
    { from: 5001, to: 20000,  color: '#FF595E', label: '5001–20000' }
  ];
  
  const options = {
    chart: {
      type: 'heatmap',
      height: 500,
      toolbar: { show: false },
      events: {
        click: function(event, chartContext, config) {
          const si = config.seriesIndex;
          const di = config.dataPointIndex;
          if (si == null || di == null || di < 0) return;
  
          // Atividade (nome da série)
          const atividade = chartContext.w.config.series[si].name;
          // Região (x da célula)
          const region = chartContext.w.config.series[si].data[di].x;
  
          // Dispara os filtros no Knowage
          datastore.clickManager('area_simplificada', region);
          datastore.clickManager('atividade_principal_desc_atr', atividade);
  
          // feedback opcional
          alert(`Filtrado por Região = ${region}\nAtividade = ${atividade}`);
        }
      }
    },
  
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      markers: { shape: 'circle', radius: 6 },
      itemMargin: { horizontal: 8, vertical: 4 }
    },
  
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges,
          legend: { show: false }
        }
      }
    },
  
    series,
    xaxis: {
      type: 'category',
      categories: regions,
      title: { text: 'Região' },
      labels: { rotate: -30, style: { fontSize: '12px' } }
    },
    yaxis: { title: { text: 'Atividade' } },
  
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const activity = w.config.series[seriesIndex].name;
        const point    = w.config.series[seriesIndex].data[dataPointIndex];
        return `
          <div style="padding:8px;font-size:13px;">
            <strong style="display:block;margin-bottom:4px;">${activity}</strong>
            Região: ${point.x}<br/>
            Total: <strong>${point.y.toLocaleString()} pessoas</strong>
          </div>
        `;
      }
    },
    dataLabels: { enabled: false }
  };
  
  new ApexCharts(
    document.querySelector('#activity-region-chart'),
    options
  ).render();
  
  