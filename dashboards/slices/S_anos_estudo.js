// JavaScript
// 1) Define manualmente o vetor de anos de estudo (0 a 16)
const anosEstudoOriginais = Array.from({ length: 17 }, (_, i) => i); // [0,1,2,…,16]

// 2) Referências ao DOM
const slider = document.getElementById('years-slider');
const output = document.getElementById('years-slider-value');

// 3) Inicializa o slider com placeholder "_" usando min = -1
slider.min   = -1;
slider.max   = anosEstudoOriginais.length - 1;
slider.step  = 1;
slider.value = -1;
output.textContent = '—';
updateTrackFill();

// 4) Atualiza o label e visual durante o arraste
slider.addEventListener('input', () => {
  const idx = +slider.value;
  if (idx < 0) {
    output.textContent = '—';
  } else {
    const year = anosEstudoOriginais[idx];
    output.textContent = `${year} ano${year !== 1 ? 's' : ''}`;
  }
  updateTrackFill();
});

// 5) Dispara o filtro apenas ao soltar o thumb (se válido)
slider.addEventListener('change', () => {
  const idx = +slider.value;
  if (idx >= 0) {
    const year = anosEstudoOriginais[idx];
    datastore.clickManager('anos_estudo', year);
  }
});

// Atualiza o preenchimento visual da track
function updateTrackFill() {
  const idx = +slider.value;
  if (idx < 0) {
    slider.style.background = `var(--slider-bg)`;
  } else {
    const pct = (idx - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `
      linear-gradient(
        90deg,
        var(--slider-color) ${pct}%,
        var(--slider-bg) ${pct}%
      )
    `;
  }
}
