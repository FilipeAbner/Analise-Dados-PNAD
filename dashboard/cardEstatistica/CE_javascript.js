// 1) Puxa e converte renda
const rawKPI = datastore
  .getDataArray(r => ({
    income: Number(r.renda_mensal),
    area:   r.situacao_domicilio_desc
  }))
  .filter(d => !isNaN(d.income));

// 2) Ordena rendas numericamente
const incomes = rawKPI
  .map(d => d.income)
  .sort((a, b) => a - b);

// 3) Estatísticas: média e mediana
const mean = incomes.reduce((sum, v) => sum + v, 0) / incomes.length;

const median = (() => {
  const mid = Math.floor(incomes.length / 2);
  return incomes.length % 2 === 0
    ? (incomes[mid - 1] + incomes[mid]) / 2
    : incomes[mid];
})();

// 4) IQR (Q3 − Q1)
function quantile(arr, q) {
  const pos  = (arr.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return arr[base + 1] !== undefined
    ? arr[base] + rest * (arr[base + 1] - arr[base])
    : arr[base];
}
const q1  = quantile(incomes, 0.25);
const q3  = quantile(incomes, 0.75);
const iqr = q3 - q1;

// 5) Média urbana × rural
const groupedByArea = rawKPI.reduce((acc, { area, income }) => {
  if (!acc[area]) acc[area] = { sum: 0, count: 0 };
  acc[area].sum   += income;
  acc[area].count += 1;
  return acc;
}, {});
const meanUrban = groupedByArea['URBANA']
  ? groupedByArea['URBANA'].sum / groupedByArea['URBANA'].count
  : 0;
const meanRural = groupedByArea['RURAL']
  ? groupedByArea['RURAL'].sum / groupedByArea['RURAL'].count
  : 0;
const urbanRuralRatio = meanRural
  ? (meanUrban / meanRural).toFixed(2)
  : '–';

// 6) Renderiza os cards
const container = document.getElementById('kpi-cards');
container.innerHTML = ''; // limpa

function makeCard(title, value) {
  const card = document.createElement('div');
  card.className = 'kpi-card';
  card.innerHTML = `
    <div class="kpi-title">${title}</div>
    <div class="kpi-value">${value}</div>
  `;
  return card;
}

container.appendChild(makeCard(
  'Média de Renda',
  `R$ ${mean.toLocaleString('pt-BR', { minimumFractionDigits:2 })}`
));
container.appendChild(makeCard(
  'Mediana de Renda',
  `R$ ${median.toLocaleString('pt-BR', { minimumFractionDigits:2 })}`
));
container.appendChild(makeCard(
  'IQR (25º–75º)',
  `R$ ${iqr.toLocaleString('pt-BR', { minimumFractionDigits:2 })}`
));
container.appendChild(makeCard(
  'Dist. Renda Urbano/Rural (x)',
  urbanRuralRatio
));
