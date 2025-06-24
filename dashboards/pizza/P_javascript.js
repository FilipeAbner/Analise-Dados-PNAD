function renderPIzzaCHart() {

    // 1. Dados vindos do Knowage
    const data = datastore.getRecords().map(r => ({
      label: r.atividade_principal_desc_atr,
      count: r.codigo_trabalho
    }));
    
    // 2. Função de truncamento para as labels
    const truncate = (str, max = 25) =>
      str.length > max ? str.slice(0, max) + "…" : str;
    
    const labels     = data.map(d => truncate(d.label));
    const fullLabels = data.map(d => d.label);
    const values     = data.map(d => d.count);
    const total      = values.reduce((sum, v) => sum + v, 0);
    
    // 3. Configuração do gráfico com clickManager
    const options = {
      chart: {
        type: 'pie',
        width: '100%',
        height: '100%',
        events: {
          click: function(event, chartContext, config) {
            const idx = config.dataPointIndex;
            if (idx == null || idx < 0) return;
    
            const atividade = fullLabels[idx];
            if (!atividade) return;
    
            // Aplica o filtro por descrição completa
            datastore.clickManager('atividade_principal_desc_atr', atividade);
            alert(`Filtro aplicado: ${atividade}`);
          }
        }
      },
      labels: labels,
      series: values,
      legend: {
        position: 'bottom',
        labels: {
          colors: '#333',
          useSeriesColors: false
        }
      },
      tooltip: {
        custom: ({ series, seriesIndex }) => {
          const label   = fullLabels[seriesIndex];
          const val     = series[seriesIndex];
          const percent = ((val / total) * 100).toFixed(1);
          return `
            <div style="padding:6px; color:white;">
              <strong>${label}</strong><br/>
              <span style="font-weight:bold;">${percent}%</span>
            </div>
          `;
        }
      },
      dataLabels: {
        enabled: true,
        formatter: val => `${val.toFixed(1)}%`,
        style: {
          fontWeight: 'bold',
          colors: ['#000']
        }
      },
      colors: [
        '#A7D7C5', '#C9E4DE', '#E4D9FF', '#FBEAFF',
        '#D7E9F7', '#FFECB5', '#FFD6D6', '#F4EAD5'
      ]
    };
    
    // 4. Renderiza
    const chart = new ApexCharts(
      document.querySelector("#atividade-pizza-chart"),
      options
    );
    chart.render();
    }
    renderPIzzaCHart();
    