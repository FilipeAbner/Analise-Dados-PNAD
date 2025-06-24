const dataAll = datastore.getDataArray(r => ({
    x: String(r.ano + '.' + r.trimestre),
    y1: r.renda_mensal,
    y2: r.horas_trabalhadas_semana
  })).filter(d => d.x && d.y1 && d.y2)
    .sort((a, b) => a.x.localeCompare(b.x));
  
  const itemsPerPageLine = 4;
  let currentPageLine = 1;
  const totalPagesLine = Math.ceil(dataAll.length / itemsPerPageLine);
  
  function renderLineChart(page) {
    const start = (page - 1) * itemsPerPageLine;
    const end = start + itemsPerPageLine;
    const pageData = dataAll.slice(start, end);
  
    // Variação percentual da renda
    const rendaChanges = pageData.map((d, i) => {
      if (i === 0) return 0;
      const prev = pageData[i - 1].y1;
      return prev && prev !== 0 ? (((d.y1 - prev) / prev) * 100).toFixed(1) : 0;
    });
  
    const options = {
      chart: {
        type: 'line',
        height: '100%',
        width: '100%',
        toolbar: { show: true },
        events: {
          click: function(event, chartContext, config) {
            const si = config.seriesIndex;
            const di = config.dataPointIndex;
            if (si == null || di == null || di < 0) return;
  
            // Extrai direto dos dados da série
            const point = config.config.series[si].data[di];
            const xValue = point && point.x;
            console.table(xValue);
            if (!xValue) return;
  
            const [ano, trimestre] = xValue.split('.');
            if (ano && trimestre) {
              datastore.clickManager('ano', parseInt(ano, 10));
              datastore.clickManager('trimestre', parseInt(trimestre, 10));
              alert(`Filtro aplicado: Ano = ${ano}, Trimestre = ${trimestre}`);
            }
          }
        }
      },
      stroke: { curve: 'smooth' },
      series: [
        {
          name: 'Renda Média',
          type: 'line',
          // objetos com x e y
          data: pageData.map(d => ({ x: d.x, y: d.y1 }))
        },
        {
          name: 'Horas Efetivas Média',
          type: 'line',
          data: pageData.map(d => ({ x: d.x, y: d.y2 })),
          yAxis: 1
        }
      ],
      xaxis: {
        //manter as categorias para alinhar grid/axis
        categories: pageData.map(d => d.x),
        labels: { rotate: -45, style: { fontSize: '12px' } }
      },
      yaxis: [
        {
          title: { text: 'Renda Média' },
          labels: { formatter: v => v.toLocaleString('pt-BR') }
        },
        {
          opposite: true,
          title: { text: 'Horas Efetivas Média' },
          labels: { formatter: v => v.toFixed(1) }
        }
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function(val, { seriesIndex, dataPointIndex }) {
            if (seriesIndex === 0) {
              const change = rendaChanges[dataPointIndex];
              return `R$ ${val.toLocaleString('pt-BR')} (${change}%)`;
            } else {
              return `${val.toFixed(1)} horas`;
            }
          }
        }
      },
      legend: { position: 'bottom' },
      colors: ['#569437', '#a8d5e6']
    };
  
    const chartEl = document.querySelector("#line-chart");
    chartEl.innerHTML = '';
    new ApexCharts(chartEl, options).render();
  }
  
  function renderPaginationLine() {
    const ctrl = document.querySelector("#pagination-controls-line");
    ctrl.innerHTML = '';
    const maxVis = 7;
    let startPage, endPage;
  
    if (totalPagesLine <= maxVis) {
      startPage = 1; endPage = totalPagesLine;
    } else {
      if (currentPageLine <= Math.floor(maxVis / 2)) {
        startPage = 1; endPage = maxVis;
      } else if (currentPageLine + Math.floor(maxVis / 2) >= totalPagesLine) {
        startPage = totalPagesLine - maxVis + 1;
        endPage = totalPagesLine;
      } else {
        startPage = currentPageLine - Math.floor(maxVis / 2);
        endPage = currentPageLine + Math.floor(maxVis / 2);
      }
    }
  
    function btn(label, cb, disabled = false, active = false) {
      const b = document.createElement('span');
      b.textContent = label;
      b.className = 'pagination-btn' + (active ? ' active' : '') + (disabled ? ' disabled' : '');
      if (!disabled) b.addEventListener('click', cb);
      ctrl.appendChild(b);
    }
  
    btn('<<', () => changePageLine(1), currentPageLine === 1);
    btn('<', () => changePageLine(currentPageLine - 1), currentPageLine === 1);
  
    if (startPage > 1) btn('...', () => changePageLine(startPage - 1));
    for (let i = startPage; i <= endPage; i++) {
      btn(i, () => changePageLine(i), false, i === currentPageLine);
    }
    if (endPage < totalPagesLine) btn('...', () => changePageLine(endPage + 1));
  
    btn('>', () => changePageLine(currentPageLine + 1), currentPageLine === totalPagesLine);
    btn('>>', () => changePageLine(totalPagesLine), currentPageLine === totalPagesLine);
  }
  
  function changePageLine(p) {
    if (p < 1 || p > totalPagesLine) return;
    currentPageLine = p;
    renderLineChart(p);
    renderPaginationLine();
  }
  
  // Inicializa
  renderLineChart(currentPageLine);

  