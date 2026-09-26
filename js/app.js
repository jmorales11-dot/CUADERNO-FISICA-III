/**
 * ============================================================================
 * ORQUESTADOR PRINCIPAL DEL CUADERNO VIRTUAL INTERACTIVO (SPA / PWA)
 * Gestión de Páginas, Navegación Secuencial, Atajos, KaTeX e Integración
 * ============================================================================
 */

class NotebookApp {
  constructor() {
    this.totalPages = 12;
    this.currentPage = 1;

    this.geoPlane = null;
    this.simLab = null;
    this.problemSolver = null;
    this.glossaryManager = null;

    this.init();
  }

  init() {
    this.bindNavigationEvents();
    this.bindKeyboardShortcuts();
    this.bindTouchGestures();
    this.initPWA();

    // Cargar página inicial (Portada)
    this.goToPage(1);

    // Inicializar renderizadores de componentes específicos
    window.addEventListener('DOMContentLoaded', () => {
      this.initMathKaTeX();
      this.initPageComponents();
    });
  }

  goToPage(pageNum) {
    if (pageNum < 1 || pageNum > this.totalPages) return;

    // Actualizar páginas DOM
    const pages = document.querySelectorAll('.notebook-page');
    pages.forEach(p => p.classList.remove('active'));

    const targetPage = document.getElementById(`page-${pageNum}`);
    if (targetPage) {
      targetPage.classList.add('active');
    }

    this.currentPage = pageNum;
    this.updateNavUI();

    // Scroll suave al inicio del libro
    const book = document.getElementById('notebook-book');
    if (book) {
      window.scrollTo({ top: book.offsetTop - 70, behavior: 'smooth' });
    }

    // Acciones específicas al activar páginas
    this.onPageActivated(pageNum);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  updateNavUI() {
    // Actualizar indicador textual
    const pill = document.getElementById('nav-page-indicator');
    if (pill) {
      pill.textContent = `Página ${this.currentPage} de ${this.totalPages}`;
    }

    // Actualizar botones prev/next
    const btnPrev = document.getElementById('btn-nav-prev');
    const btnNext = document.getElementById('btn-nav-next');
    if (btnPrev) btnPrev.disabled = this.currentPage === 1;
    if (btnNext) btnNext.disabled = this.currentPage === this.totalPages;

    // Actualizar selector de miniaturas / dots
    const dots = document.querySelectorAll('.page-dot');
    dots.forEach((dot, idx) => {
      if (idx + 1 === this.currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  onPageActivated(pageNum) {
    // Si entramos a la página 8 (GeoGebra), asegurar el resize del canvas
    if (pageNum === 8 && this.geoPlane) {
      setTimeout(() => this.geoPlane.handleResize(), 50);
    }

    // Si entramos a la página 9 (Simulaciones), asegurar resize
    if (pageNum === 9 && this.simLab) {
      setTimeout(() => this.simLab.handleResize(), 50);
    }

    // Re-renderizar KaTeX si hay nuevos elementos
    this.initMathKaTeX();
  }

  bindNavigationEvents() {
    // Botones de navegación inferior
    const btnPrev = document.getElementById('btn-nav-prev');
    const btnNext = document.getElementById('btn-nav-next');
    const btnHome = document.getElementById('btn-nav-home');
    const btnOpenCover = document.getElementById('btn-open-cover');
    const btnFullscreen = document.getElementById('btn-fullscreen');

    if (btnPrev) btnPrev.addEventListener('click', () => this.prevPage());
    if (btnNext) btnNext.addEventListener('click', () => this.nextPage());
    if (btnHome) btnHome.addEventListener('click', () => this.goToPage(1));
    if (btnOpenCover) btnOpenCover.addEventListener('click', () => this.goToPage(2));

    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    }

    // Click en los puntos del carrusel rápido
    const dots = document.querySelectorAll('.page-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const p = parseInt(dot.getAttribute('data-page'), 10);
        if (p) this.goToPage(p);
      });
    });

    // Enlaces de la Tabla de Contenidos (Página 2)
    const tocItems = document.querySelectorAll('.toc-item-card');
    tocItems.forEach(item => {
      item.addEventListener('click', () => {
        const p = parseInt(item.getAttribute('data-target-page'), 10);
        if (p) this.goToPage(p);
      });
    });
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignorar si el usuario está escribiendo en un input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        this.nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        this.prevPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.goToPage(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.goToPage(this.totalPages);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        this.toggleFullscreen();
      }
    });
  }

  bindTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Detectar swipe horizontal claro (mínimo 60px y más horizontal que vertical)
      if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
        if (diffX < 0) {
          this.nextPage(); // Deslizar hacia la izquierda = página siguiente
        } else {
          this.prevPage(); // Deslizar hacia la derecha = página anterior
        }
      }
    }, { passive: true });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  initMathKaTeX() {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
      });
    }
  }

  initPageComponents() {
    // 1. Inicializar Mapa Mental en Página 4
    if (window.renderInteractiveMindMap) {
      window.renderInteractiveMindMap('mindmap-container');
    }

    // 2. Inicializar Línea de Tiempo en Página 3
    if (window.renderInteractiveTimeline) {
      window.renderInteractiveTimeline('timeline-mount');
    }

    // 3. Inicializar Plano Estilo GeoGebra en Página 8
    if (window.GeoGebraPlane) {
      this.geoPlane = new window.GeoGebraPlane('geogebra-canvas', {
        A: 2.0,
        omega: 1.5,
        phi0: 0.0
      });
      this.setupGeoGebraControls();
    }

    // 4. Inicializar Laboratorio de Simulación en Página 9
    if (window.PhysicsSimulationLab) {
      this.simLab = new window.PhysicsSimulationLab('sim-canvas');
      this.setupSimulationControls();
    }

    // 5. Inicializar Taller de Ejercicios en Página 10
    if (window.InteractiveProblemSolver) {
      this.problemSolver = new window.InteractiveProblemSolver();
    }

    // 6. Inicializar Glosario en Página 11
    if (window.GlossaryManager) {
      this.glossaryManager = new window.GlossaryManager('glossary-mount', 'glossary-search', 'glossary-letters');
    }
  }

  setupGeoGebraControls() {
    const geo = this.geoPlane;
    if (!geo) return;

    // Botones de la barra de herramientas
    document.getElementById('geo-btn-zoom-in')?.addEventListener('click', () => geo.zoomIn());
    document.getElementById('geo-btn-zoom-out')?.addEventListener('click', () => geo.zoomOut());
    document.getElementById('geo-btn-reset')?.addEventListener('click', () => geo.resetView());
    
    // Herramientas Pan / Inspect
    const btnPan = document.getElementById('geo-btn-pan');
    const btnInspect = document.getElementById('geo-btn-inspect');
    if (btnPan) {
      btnPan.addEventListener('click', () => {
        geo.setTool('pan');
        btnPan.classList.add('active');
        btnInspect?.classList.remove('active');
      });
    }
    if (btnInspect) {
      btnInspect.addEventListener('click', () => {
        geo.setTool('inspect');
        btnInspect.classList.add('active');
        btnPan?.classList.remove('active');
      });
    }

    // Botón de Paleta de Estilos Gráficos
    const btnStyle = document.getElementById('geo-btn-palette');
    const stylePanel = document.getElementById('geo-style-panel');
    if (btnStyle && stylePanel) {
      btnStyle.addEventListener('click', () => {
        stylePanel.classList.toggle('open');
      });
    }

    // Acciones dentro de la Paleta de Estilos
    const swatches = document.querySelectorAll('.swatch-btn');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
        const color = swatch.getAttribute('data-color');
        geo.setCurveStyle(geo.styles.activeCurve, { color });
      });
    });

    const widthBtns = document.querySelectorAll('.stroke-width-opt');
    widthBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        widthBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lineWidth = parseFloat(btn.getAttribute('data-width'));
        geo.setCurveStyle(geo.styles.activeCurve, { lineWidth });
      });
    });

    const dashBtns = document.querySelectorAll('.stroke-dash-opt');
    dashBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dashBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const dash = btn.getAttribute('data-dash');
        const lineDash = dash === 'solid' ? [] : (dash === 'dashed' ? [6, 4] : [2, 3]);
        geo.setCurveStyle(geo.styles.activeCurve, { lineDash });
      });
    });

    // Checkboxes de Leyenda de Curvas
    document.getElementById('legend-toggle-x')?.addEventListener('click', (e) => {
      geo.toggleCurve('x');
      e.currentTarget.classList.toggle('active', geo.curves.x);
    });
    document.getElementById('legend-toggle-v')?.addEventListener('click', (e) => {
      geo.toggleCurve('v');
      e.currentTarget.classList.toggle('active', geo.curves.v);
    });
    document.getElementById('legend-toggle-a')?.addEventListener('click', (e) => {
      geo.toggleCurve('a');
      e.currentTarget.classList.toggle('active', geo.curves.a);
    });

    // Sliders de Parámetros Cinemáticos
    const sliderA = document.getElementById('slider-geo-a');
    const sliderW = document.getElementById('slider-geo-w');
    const sliderP = document.getElementById('slider-geo-phi');
    const valTagA = document.getElementById('val-geo-a');
    const valTagW = document.getElementById('val-geo-w');
    const valTagP = document.getElementById('val-geo-phi');

    if (sliderA) {
      sliderA.addEventListener('input', (e) => {
        const A = parseFloat(e.target.value);
        if (valTagA) valTagA.textContent = `${A.toFixed(1)} m`;
        geo.updateParams({ A });
      });
    }
    if (sliderW) {
      sliderW.addEventListener('input', (e) => {
        const omega = parseFloat(e.target.value);
        if (valTagW) valTagW.textContent = `${omega.toFixed(1)} rad/s`;
        geo.updateParams({ omega });
      });
    }
    if (sliderP) {
      sliderP.addEventListener('input', (e) => {
        const phi0 = parseFloat(e.target.value);
        if (valTagP) valTagP.textContent = `${phi0.toFixed(2)} rad`;
        geo.updateParams({ phi0 });
      });
    }
  }

  setupSimulationControls() {
    const sim = this.simLab;
    if (!sim) return;

    const btnPlay = document.getElementById('sim-btn-play');
    const btnPause = document.getElementById('sim-btn-pause');
    const btnStep = document.getElementById('sim-btn-step');
    const speedSel = document.getElementById('sim-speed-select');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        sim.play();
        btnPlay.style.display = 'none';
        if (btnPause) btnPause.style.display = 'inline-flex';
      });
    }
    if (btnPause) {
      btnPause.addEventListener('click', () => {
        sim.pause();
        btnPause.style.display = 'none';
        if (btnPlay) btnPlay.style.display = 'inline-flex';
      });
    }
    if (btnStep) {
      btnStep.addEventListener('click', () => sim.step());
    }
    if (speedSel) {
      speedSel.addEventListener('change', (e) => {
        sim.setSpeed(parseFloat(e.target.value) || 1.0);
      });
    }

    // Sliders de la Simulación
    const sliderM = document.getElementById('sim-slider-m');
    const sliderK = document.getElementById('sim-slider-k');
    const sliderA = document.getElementById('sim-slider-a');
    const valTagM = document.getElementById('sim-val-m');
    const valTagK = document.getElementById('sim-val-k');
    const valTagA = document.getElementById('sim-val-a');

    if (sliderM) {
      sliderM.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (valTagM) valTagM.textContent = `${val.toFixed(1)} kg`;
        sim.setMass(val);
      });
    }
    if (sliderK) {
      sliderK.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (valTagK) valTagK.textContent = `${val.toFixed(0)} N/m`;
        sim.setSpringK(val);
      });
    }
    if (sliderA) {
      sliderA.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (valTagA) valTagA.textContent = `${val.toFixed(1)} m`;
        sim.setAmplitude(val);
      });
    }
  }

  initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      });
    }
  }
}

// Inicialización
window.NotebookApp = new NotebookApp();
