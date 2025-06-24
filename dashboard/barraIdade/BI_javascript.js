// 1) Extrai:
const raw = datastore.getDataArray(record => ({
    sexo:  record.sexo_desc,                                    // 'MULHER' ou 'HOMEM'
    nivel: String(record.nivel_instrucao_max_desc),            // força como string
    count: record.codigo_trabalho_pessoa                        // número de registros
  }));
  
  // 2) Monta as categorias e aplica ordem manual
  let categorias = Array.from(new Set(raw.map(r => r.nivel)));
  const ordemNivel = [
    "SUPERIOR COMPLETO",
    "SUPERIOR INCOMPLETO OU EQUIVALENTE",
    "MEDIO COMPLETO OU EQUIVALENTE",
    "MEDIO INCOMPLETO OU EQUIVALENTE",
    "FUNDAMENTAL COMPLETO OU EQUIVALENTE",
    "FUNDAMENTAL INCOMPLETO OU EQUIVALENTE",
    "SEM INSTRUCAO E MENOS DE 1 ANO DE ESTUDO",
    "NAO APLICAVEL"
  ];
  const presentes = new Set(categorias);
  categorias = ordemNivel.filter(n => presentes.has(n));
  
  // 3) Inicializa as séries zeradas
  const feminino  = Array(categorias.length).fill(0);
  const masculino = Array(categorias.length).fill(0);
  
  // 4) Preenche os valores (Feminino negativo para espelhar)
  raw.forEach(r => {
    const idx = categorias.indexOf(r.nivel);
    if (idx === -1) return;
    if (r.sexo === 'MULHER') {
      feminino[idx] = -r.count;
    } else {
      masculino[idx] = r.count;
    }
  });
  
  // 5) Configuração do gráfico com clickManager em chart.events
  const options = {
    chart: {
      type: 'bar',
      height: 500,
      stacked: false,
      toolbar: { show: true },
      events: {
        click: function(event, chartContext, config) {
          const si = config.seriesIndex;
          const di = config.dataPointIndex;
          if (si == null || di == null || di < 0) return;
  
          // 1) filtro por sexo
          const gender = config.config.series[si].name;
          if (gender) {
            datastore.clickManager('sexo_desc', gender);
          }
  
          // 2) filtro por nível de instrução
          // em barras horizontais, as categorias vêm de globals.labels
          const nivel = chartContext.w.globals.labels[di];
          if (nivel) {
            datastore.clickManager('nivel_instrucao_max_desc', nivel);
          }
  
          alert(`Filtrado por Sexo = ${gender}  e Nível = ${nivel}`);
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
        borderRadius: 6
      }
    },
    // ← Mostra sempre valores positivos, mesmo que data seja negativa
    dataLabels: {
      enabled: true,
      formatter: val => Math.abs(val).toLocaleString(),
      style: { fontSize: '12px', fontWeight: 'bold' }
    },
    series: [
      { name: 'MULHER', data: feminino },
      { name: 'HOMEM',  data: masculino }
    ],
    xaxis: {
      categories: categorias,
      labels: { formatter: v => Math.abs(v).toLocaleString() },
      title: { text: 'Contagem de Registros' }
    },
    yaxis: {
      title: { text: 'Nível de Instrução Máximo Alcançado' }
    },
    tooltip: {
      x: { show: false },
      y: { formatter: v => `${Math.abs(v).toLocaleString()} registros` }
    },
    colors: ['#FF77CC', '#3366FF'],
    legend: {
      position: 'bottom',
      align: 'center'
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    }
  };
  
  
  // 6) Renderiza
  new ApexCharts(
    document.querySelector('#pyramid-chart'),
    options
  ).render();
  