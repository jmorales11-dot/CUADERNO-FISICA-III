/**
 * ============================================================================
 * LÍNEA DE TIEMPO INTERACTIVA HISTÓRICA DEL MOVIMIENTO OSCILATORIO
 * Reseña histórica de los hitos fundacionales de la física armónica
 * ============================================================================
 */

const timelineData = [
  {
    year: "1602",
    scientist: "Galileo Galilei",
    title: "Descubrimiento del Isocronismo Pendular",
    desc: "Observando el balanceo de una lámpara de aceite en la Catedral de Pisa y cronometrándolo con su propio pulso, Galileo descubre que el período de oscilación de un péndulo es independiente de la amplitud para pequeños ángulos. Establece las bases experimentales del movimiento armónico.",
    tag: "Cinemática Experimental"
  },
  {
    year: "1673",
    scientist: "Christiaan Huygens",
    title: "Publicación de 'Horologium Oscillatorium'",
    desc: "Huygens desarrolla el primer reloj de péndulo mecánico de alta precisión, demuestra matemáticamente que la cicloide es una curva tautócrona (isócrona para cualquier amplitud) y deduce la fórmula formal del período del péndulo simple: T = 2π√(L/g).",
    tag: "Mecánica Aplicada & Relojería"
  },
  {
    year: "1678",
    scientist: "Robert Hooke",
    title: "Ley de Elasticidad: 'Ut tensio, sic vis'",
    desc: "En su tratado 'De Potentia Restitutiva', Robert Hooke enuncia la ley fundamental de los cuerpos elásticos: la fuerza restauradora ejercida por un resorte es directamente proporcional y opuesta a la deformación experimentada (F = -kx), originando el concepto de oscilador armónico.",
    tag: "Dinámica Elástica"
  },
  {
    year: "1687",
    scientist: "Isaac Newton",
    title: "Mecánica Clásica & Segunda Ley del Movimiento",
    desc: "En los 'Philosophiae Naturalis Principia Mathematica', Newton formaliza las tres leyes de la dinámica. Al combinar ΣF = ma con la fuerza elástica F = -kx, se establece la base dinámica moderna del Movimiento Armónico Simple: m·(d²x/dt²) + kx = 0.",
    tag: "Dinámica Clásica"
  },
  {
    year: "1739",
    scientist: "Leonhard Euler",
    title: "Solución Analítica de la Ecuación Diferencial del MAS",
    desc: "Euler resuelve de manera general la ecuación diferencial lineal de segundo orden del oscilador armónico mediante funciones exponenciales complejas y trigonometría, introduciendo la notación moderna de frecuencia angular ω y desfasaje φ.",
    tag: "Cálculo Diferencial"
  },
  {
    year: "1822",
    scientist: "Jean-Baptiste Joseph Fourier",
    title: "Análisis Armónico y Descomposición Espectral",
    desc: "En su obra 'Théorie analytique de la chaleur', Fourier demuestra que cualquier función periódica arbitraria puede expresarse rigurosamente como una suma infinita de funciones armónicas simples (senos y cosenos), convirtiendo al MAS en el bloque constructivo fundamental de la física ondulatoria.",
    tag: "Análisis de Fourier"
  }
];

function renderInteractiveTimeline(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = `<div class="timeline-container"><div class="timeline-line"></div>`;

  timelineData.forEach(item => {
    html += `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <span class="timeline-date-badge">${item.year}</span>
            <span class="apa-badge">${item.tag}</span>
          </div>
          <h3 class="timeline-scientist-name">${item.scientist}</h3>
          <h4 style="font-size: 0.95rem; font-weight: 600; color: var(--gold-700); margin-top: 0.15rem;">${item.title}</h4>
          <p class="timeline-desc">${item.desc}</p>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

window.renderInteractiveTimeline = renderInteractiveTimeline;
