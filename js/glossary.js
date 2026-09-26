/**
 * ============================================================================
 * GLOSARIO CIENTÍFICO ILUSTRADO DE FÍSICA 3: MAS Y OSCILACIONES
 * Buscador reactivo en tiempo real y filtrado por letras (A-Z)
 * ============================================================================
 */

const glossaryData = [
  {
    term: "Aceleración Armónica",
    symbol: "a(t)",
    unit: "m/s²",
    cat: "Cinemática",
    def: "Segunda derivada temporal de la elongación. En el MAS, la aceleración es en todo instante directamente proporcional a la elongación pero con sentido opuesto: a(t) = -ω²·x(t). Alcanza su valor máximo en los extremos de la oscilación."
  },
  {
    term: "Amplitud",
    symbol: "A",
    unit: "m",
    cat: "Fundamentos",
    def: "Magnitud escalar que representa el máximo desplazamiento positivo o negativo de la partícula respecto a su posición central de equilibrio estático. Es siempre una cantidad no negativa (A ≥ 0)."
  },
  {
    term: "Círculo de Referencia (Fasor)",
    symbol: "—",
    unit: "rad",
    cat: "Geometría",
    def: "Construcción geométrica donde un punto describe un movimiento circular uniforme (MCU) con velocidad angular constante ω. La proyección ortogonal de este movimiento sobre un diámetro genera un Movimiento Armónico Simple."
  },
  {
    term: "Constante Elástica",
    symbol: "k",
    unit: "N/m",
    cat: "Dinámica",
    def: "Parámetro que cuantifica la rigidez o resistencia elástica de un resorte o medio oscilante frente a una deformación unitaria según la Ley de Hooke."
  },
  {
    term: "Desfasaje (Fase Inicial)",
    symbol: "φ₀",
    unit: "rad",
    cat: "Cinemática",
    def: "Ángulo en radianes que determina el estado de movimiento (posición y dirección de la velocidad) de la partícula en el instante inicial t = 0 s."
  },
  {
    term: "Elongación",
    symbol: "x(t)",
    unit: "m",
    cat: "Cinemática",
    def: "Posición instantánea de la partícula que oscila medida en cualquier instante t respecto al origen o posición de equilibrio x = 0."
  },
  {
    term: "Energía Mecánica Total",
    symbol: "E",
    unit: "J (Joules)",
    cat: "Energía",
    def: "Suma continua de la energía cinética (½mv²) y la energía potencial elástica (½kx²). En un MAS ideal sin fricción, permanece estrictamente constante e igual a E = ½kA²."
  },
  {
    term: "Frecuencia",
    symbol: "f",
    unit: "Hz (s⁻¹)",
    cat: "Fundamentos",
    def: "Número de oscilaciones completas o ciclos que realiza el sistema oscilante por cada unidad de tiempo. En el Sistema Internacional se mide en Hertz (Hz). Se relaciona con el período mediante f = 1/T."
  },
  {
    term: "Frecuencia Angular",
    symbol: "ω",
    unit: "rad/s",
    cat: "Cinemática",
    def: "Rapidez con la que evoluciona el argumento trigonométrico de la función armónica. Se relaciona con la frecuencia mediante ω = 2πf = 2π/T y en el sistema masa-resorte equivale a ω = √(k/m)."
  },
  {
    term: "Fuerza Restauradora",
    symbol: "F_rest",
    unit: "N (Newtons)",
    cat: "Dinámica",
    def: "Fuerza neta originada en el sistema que siempre apunta hacia la posición de equilibrio central, tendiendo a devolver la partícula a dicho punto (F = -kx)."
  },
  {
    term: "Hertz",
    symbol: "Hz",
    unit: "s⁻¹",
    cat: "Unidades SI",
    def: "Unidad derivada de frecuencia en el Sistema Internacional de Unidades (SI), nombrada en honor al físico alemán Heinrich Rudolf Hertz. Equivale a un ciclo u oscilación por segundo."
  },
  {
    term: "Isocronismo",
    symbol: "—",
    unit: "—",
    cat: "Propiedad",
    def: "Propiedad física de ciertos osciladores (como el péndulo simple a pequeños ángulos o el oscilador masa-resorte) en los cuales el período de oscilación T es estrictamente independiente de la amplitud de vibración."
  },
  {
    term: "Ley de Hooke",
    symbol: "F = -kx",
    unit: "N",
    cat: "Dinámica",
    def: "Ley física formulada por Robert Hooke que establece que, dentro del límite elástico, la fuerza elástica ejercida por un medio deformable es directamente proporcional al alargamiento o compresión experimentado y de signo opuesto."
  },
  {
    term: "Movimiento Armónico Simple (MAS)",
    symbol: "MAS",
    unit: "—",
    cat: "Fundamentos",
    def: "Tipo de movimiento oscilatorio periódico rectilíneo en el cual la aceleración es proporcional y opuesta al desplazamiento. Su evolución temporal está descrita matemáticamente por funciones senoidales o cosenoidales."
  },
  {
    term: "Movimiento Oscilatorio",
    symbol: "—",
    unit: "—",
    cat: "Fundamentos",
    def: "Movimiento de vaivén que realiza una partícula o cuerpo alrededor de una posición de equilibrio estable, repitiéndose de forma periódica en el tiempo o con amortiguamiento."
  },
  {
    term: "Período",
    symbol: "T",
    unit: "s (segundos)",
    cat: "Fundamentos",
    def: "Intervalo de tiempo mínimo necesario para que el sistema complete una oscilación o ciclo completo y retorne al mismo estado de movimiento (misma posición y misma velocidad)."
  },
  {
    term: "Posición de Equilibrio",
    symbol: "x = 0",
    unit: "m",
    cat: "Dinámica",
    def: "Punto espacial donde la fuerza neta restauradora sobre la partícula es nula (ΣF = 0). Es el punto donde la velocidad es máxima y la aceleración se anula."
  },
  {
    term: "Velocidad Armónica",
    symbol: "v(t)",
    unit: "m/s",
    cat: "Cinemática",
    def: "Primera derivada temporal de la elongación respecto al tiempo: v(t) = -A·ω·sin(ωt + φ₀). Se encuentra desfasada en π/2 rad (90°) respecto a la posición x(t)."
  }
];

class GlossaryManager {
  constructor(containerId, searchInputId, lettersContainerId) {
    this.container = document.getElementById(containerId);
    this.searchInput = document.getElementById(searchInputId);
    this.lettersContainer = document.getElementById(lettersContainerId);
    this.currentLetter = 'ALL';
    this.searchQuery = '';

    this.init();
  }

  init() {
    this.renderLetterTabs();
    this.renderTerms();
    this.bindEvents();
  }

  renderLetterTabs() {
    if (!this.lettersContainer) return;
    const letters = ['ALL', ...new Set(glossaryData.map(item => item.term[0].toUpperCase()))].sort();
    
    let html = '';
    letters.forEach(letter => {
      const activeClass = letter === this.currentLetter ? 'active' : '';
      html += `<button class="letter-btn ${activeClass}" data-letter="${letter}">${letter === 'ALL' ? 'Todos' : letter}</button>`;
    });

    this.lettersContainer.innerHTML = html;
  }

  renderTerms() {
    if (!this.container) return;

    const filtered = glossaryData.filter(item => {
      const matchesLetter = this.currentLetter === 'ALL' || item.term[0].toUpperCase() === this.currentLetter;
      const q = this.searchQuery.toLowerCase();
      const matchesSearch = item.term.toLowerCase().includes(q) || 
                            item.def.toLowerCase().includes(q) || 
                            item.cat.toLowerCase().includes(q);
      return matchesLetter && matchesSearch;
    });

    if (filtered.length === 0) {
      this.container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
          No se encontraron términos para la búsqueda realizada.
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(item => {
      html += `
        <div class="glossary-card">
          <div class="glossary-term">
            <span>${item.term}</span>
            <span class="glossary-cat">${item.cat}</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--lilac-700); margin-top: 0.2rem;">
            Símbolo: <strong>${item.symbol}</strong> | Unidad: <strong>${item.unit}</strong>
          </div>
          <p class="glossary-def">${item.def}</p>
        </div>
      `;
    });

    this.container.innerHTML = html;
  }

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderTerms();
      });
    }

    if (this.lettersContainer) {
      this.lettersContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.letter-btn');
        if (!btn) return;
        this.currentLetter = btn.getAttribute('data-letter');
        
        this.lettersContainer.querySelectorAll('.letter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.renderTerms();
      });
    }
  }
}

window.GlossaryManager = GlossaryManager;
