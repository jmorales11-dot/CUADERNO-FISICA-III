/**
 * ============================================================================
 * MOTOR DE PLANO CARTESIANO INTERACTIVO ESTILO GEOGEBRA
 * Cuadrícula milimetrada, reglas sobre ejes, marcas/ticks dinámicos,
 * herramientas de navegación (zoom, pan, reset, inspect) y paleta de estilos.
 * ============================================================================
 */

class GeoGebraPlane {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Parámetros Físicos del MAS
    this.params = {
      A: options.A !== undefined ? options.A : 2.0,       // Amplitud [m]
      omega: options.omega !== undefined ? options.omega : 1.5, // Frecuencia angular [rad/s]
      phi0: options.phi0 !== undefined ? options.phi0 : 0.0,    // Fase inicial [rad]
    };

    // Visibilidad de curvas
    this.curves = {
      x: true,  // Elongación x(t)
      v: false, // Velocidad v(t)
      a: false  // Aceleración a(t)
    };

    // Estilos Gráficos por Defecto (Personalizables en la Paleta)
    this.styles = {
      x: { color: '#7c3aed', lineWidth: 2.5, lineDash: [] },
      v: { color: '#059669', lineWidth: 2.0, lineDash: [5, 3] },
      a: { color: '#e11d48', lineWidth: 2.0, lineDash: [2, 2] },
      activeCurve: 'x' // Curva seleccionada para cambiar estilo en la paleta
    };

    // Estado del Sistema de Coordenadas
    this.state = {
      originX: 80,             // Posición en px del origen t=0
      originY: 0,              // Se calcula en resize (centro vertical)
      scaleX: 60,              // Pixeles por segundo (eje t)
      scaleY: 45,              // Pixeles por unidad (eje y)
      defaultScaleX: 60,
      defaultScaleY: 45,
      defaultOriginX: 80,
      minScale: 15,
      maxScale: 300,
      isPanning: false,
      panStartX: 0,
      panStartY: 0,
      currentTool: 'pan',      // 'pan' | 'inspect' | 'scale'
      mouseMathX: 0,
      mouseMathY: 0,
      hoverPoint: null
    };

    // Opciones estéticas de papel milimetrado
    this.grid = {
      majorColor: 'rgba(124, 58, 237, 0.25)',
      minorColor: 'rgba(139, 92, 246, 0.10)',
      subdivisions: 5,
      axisColor: '#2b1f47',
      textColor: '#473963'
    };

    this.init();
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
    this.bindEvents();
    this.render();
  }

  handleResize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height || 420;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);

    if (this.state.originY === 0) {
      this.state.originY = this.height / 2;
    }
    this.render();
  }

  // Transformaciones entre Coordenadas Físicas (Matemáticas) y Pantalla
  toScreenX(t) {
    return this.state.originX + t * this.state.scaleX;
  }

  toScreenY(val) {
    return this.state.originY - val * this.state.scaleY;
  }

  toMathX(px) {
    return (px - this.state.originX) / this.state.scaleX;
  }

  toMathY(py) {
    return (this.state.originY - py) / this.state.scaleY;
  }

  // Paso óptimo de cuadrícula según nivel de zoom
  getGridStep(scale) {
    const targetPx = 60;
    const roughStep = targetPx / scale;
    const exponent = Math.floor(Math.log10(roughStep));
    const fraction = roughStep / Math.pow(10, exponent);

    let niceFraction;
    if (fraction <= 1.5) niceFraction = 1;
    else if (fraction <= 3) niceFraction = 2;
    else if (fraction <= 7) niceFraction = 5;
    else niceFraction = 10;

    return niceFraction * Math.pow(10, exponent);
  }

  // Dibuja la cuadrícula mayor y menor estilo papel milimetrado
  drawMillimeterGrid() {
    const ctx = this.ctx;
    const stepX = this.getGridStep(this.state.scaleX);
    const stepY = this.getGridStep(this.state.scaleY);
    const subX = stepX / this.grid.subdivisions;
    const subY = stepY / this.grid.subdivisions;

    const minT = this.toMathX(0);
    const maxT = this.toMathX(this.width);
    const minVal = this.toMathY(this.height);
    const maxVal = this.toMathY(0);

    // 1. Cuadrícula Menor (Líneas finas milimetradas)
    ctx.save();
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = this.grid.minorColor;

    ctx.beginPath();
    const startSubX = Math.floor(minT / subX) * subX;
    for (let t = startSubX; t <= maxT; t += subX) {
      const sx = this.toScreenX(t);
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, this.height);
    }
    const startSubY = Math.floor(minVal / subY) * subY;
    for (let y = startSubY; y <= maxVal; y += subY) {
      const sy = this.toScreenY(y);
      ctx.moveTo(0, sy);
      ctx.lineTo(this.width, sy);
    }
    ctx.stroke();

    // 2. Cuadrícula Mayor (Líneas principales con marcas)
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = this.grid.majorColor;
    ctx.beginPath();

    const startMajX = Math.floor(minT / stepX) * stepX;
    for (let t = startMajX; t <= maxT; t += stepX) {
      const sx = this.toScreenX(t);
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, this.height);
    }
    const startMajY = Math.floor(minVal / stepY) * stepY;
    for (let y = startMajY; y <= maxVal; y += stepY) {
      const sy = this.toScreenY(y);
      ctx.moveTo(0, sy);
      ctx.lineTo(this.width, sy);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Dibuja los Ejes Coordenados con Reglas, Ticks y Números
  drawAxes() {
    const ctx = this.ctx;
    const originX = this.state.originX;
    const originY = this.state.originY;

    ctx.save();
    ctx.strokeStyle = this.grid.axisColor;
    ctx.fillStyle = this.grid.textColor;
    ctx.lineWidth = 1.8;
    ctx.font = '11px "JetBrains Mono", Consolas, monospace';

    // Eje Horizontal (t [s])
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(this.width, originY);
    ctx.stroke();

    // Flecha eje t
    ctx.beginPath();
    ctx.moveTo(this.width - 10, originY - 5);
    ctx.lineTo(this.width, originY);
    ctx.lineTo(this.width - 10, originY + 5);
    ctx.fillStyle = this.grid.axisColor;
    ctx.fill();

    // Eje Vertical
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, this.height);
    ctx.stroke();

    // Flecha eje vertical
    ctx.beginPath();
    ctx.moveTo(originX - 5, 10);
    ctx.lineTo(originX, 0);
    ctx.lineTo(originX + 5, 10);
    ctx.fill();

    // Etiquetas de los ejes
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillText('t (s)', this.width - 32, originY - 10);
    ctx.fillText('x, v, a', originX + 8, 16);

    // Ticks y Números en Eje Horizontal (t)
    const stepX = this.getGridStep(this.state.scaleX);
    const minT = this.toMathX(0);
    const maxT = this.toMathX(this.width);
    const startMajX = Math.floor(minT / stepX) * stepX;

    ctx.font = '10px "JetBrains Mono", Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let t = startMajX; t <= maxT; t += stepX) {
      if (Math.abs(t) < 1e-6) continue; // Evitar solapamiento en el origen
      const sx = this.toScreenX(t);
      // Marca de tick
      ctx.beginPath();
      ctx.moveTo(sx, originY - 4);
      ctx.lineTo(sx, originY + 4);
      ctx.strokeStyle = this.grid.axisColor;
      ctx.stroke();

      const numStr = Number(t.toFixed(2)).toString();
      ctx.fillText(numStr, sx, originY + 7);
    }

    // Ticks y Números en Eje Vertical
    const stepY = this.getGridStep(this.state.scaleY);
    const minVal = this.toMathY(this.height);
    const maxVal = this.toMathY(0);
    const startMajY = Math.floor(minVal / stepY) * stepY;

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let y = startMajY; y <= maxVal; y += stepY) {
      if (Math.abs(y) < 1e-6) continue;
      const sy = this.toScreenY(y);
      // Marca de tick
      ctx.beginPath();
      ctx.moveTo(originX - 4, sy);
      ctx.lineTo(originX + 4, sy);
      ctx.stroke();

      const numStr = Number(y.toFixed(2)).toString();
      ctx.fillText(numStr, originX - 7, sy);
    }

    // Marca del Origen (0,0)
    ctx.fillText('0', originX - 8, originY + 8);
    ctx.restore();
  }

  // Dibuja las funciones cinemáticas continuas
  drawCurves() {
    const { A, omega, phi0 } = this.params;
    const minT = Math.max(0, this.toMathX(0));
    const maxT = this.toMathX(this.width);
    const dt = 1 / this.state.scaleX; // Muestreo de 1 punto por pixel

    // 1. Elongación: x(t) = A * cos(omega * t + phi0)
    if (this.curves.x) {
      this.renderFunction((t) => A * Math.cos(omega * t + phi0), this.styles.x);
    }

    // 2. Velocidad: v(t) = -A * omega * sin(omega * t + phi0)
    if (this.curves.v) {
      this.renderFunction((t) => -A * omega * Math.sin(omega * t + phi0), this.styles.v);
    }

    // 3. Aceleración: a(t) = -A * omega^2 * cos(omega * t + phi0)
    if (this.curves.a) {
      this.renderFunction((t) => -A * omega * omega * Math.cos(omega * t + phi0), this.styles.a);
    }
  }

  renderFunction(fn, style) {
    const ctx = this.ctx;
    const minT = this.toMathX(0);
    const maxT = this.toMathX(this.width);
    const step = 2 / this.state.scaleX; // Alta resolución

    ctx.save();
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.lineWidth;
    ctx.setLineDash(style.lineDash || []);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    let first = true;
    for (let t = minT; t <= maxT; t += step) {
      const y = fn(t);
      const sx = this.toScreenX(t);
      const sy = this.toScreenY(y);

      if (first) {
        ctx.moveTo(sx, sy);
        first = false;
      } else {
        ctx.lineTo(sx, sy);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  // Dibuja el punto de inspección y coordenadas
  drawInspection() {
    if (this.state.currentTool !== 'inspect' || !this.state.hoverPoint) return;
    const { t, x, v, a, screenX, screenY } = this.state.hoverPoint;
    const ctx = this.ctx;

    ctx.save();
    // Línea guía vertical
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(screenX, 0);
    ctx.lineTo(screenX, this.height);
    ctx.stroke();

    // Punto resaltado sobre la curva activa
    const activeVal = this.styles.activeCurve === 'x' ? x : (this.styles.activeCurve === 'v' ? v : a);
    const activeSy = this.toScreenY(activeVal);

    ctx.beginPath();
    ctx.arc(screenX, activeSy, 6, 0, Math.PI * 2);
    ctx.fillStyle = this.styles[this.styles.activeCurve].color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();

    // Actualizar badge flotante
    this.updateCoordBadge(screenX, activeSy, t, activeVal);
  }

  updateCoordBadge(sx, sy, t, val) {
    const badge = this.canvas.parentElement.querySelector('.geo-coord-badge');
    if (!badge) return;
    badge.style.display = 'block';
    badge.style.left = `${sx + 10}px`;
    badge.style.top = `${sy}px`;

    const unit = this.styles.activeCurve === 'x' ? 'm' : (this.styles.activeCurve === 'v' ? 'm/s' : 'm/s²');
    badge.innerHTML = `t = ${t.toFixed(2)} s<br><strong>${this.styles.activeCurve}(t) = ${val.toFixed(2)} ${unit}</strong>`;
  }

  hideCoordBadge() {
    const badge = this.canvas.parentElement.querySelector('.geo-coord-badge');
    if (badge) badge.style.display = 'none';
  }

  // Render Principal a 60 fps
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawMillimeterGrid();
    this.drawAxes();
    this.drawCurves();
    this.drawInspection();
  }

  // Configuración de Interacciones (Zoom, Pan, Arrastre y Táctil)
  bindEvents() {
    const canvas = this.canvas;

    // Rueda del Ratón: Zoom con foco en la posición del cursor
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      this.zoomAt(mouseX, mouseY, zoomFactor);
    }, { passive: false });

    // Mousedown / Touchstart
    canvas.addEventListener('mousedown', (e) => {
      if (this.state.currentTool === 'pan' || e.button === 1 || e.shiftKey) {
        this.state.isPanning = true;
        this.state.panStartX = e.clientX - this.state.originX;
        this.state.panStartY = e.clientY - this.state.originY;
        canvas.style.cursor = 'grabbing';
      }
    });

    window.addEventListener('mouseup', () => {
      this.state.isPanning = false;
      canvas.style.cursor = this.state.currentTool === 'inspect' ? 'crosshair' : 'grab';
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (this.state.isPanning) {
        this.state.originX = mouseX - this.state.panStartX;
        this.state.originY = mouseY - this.state.panStartY;
        this.render();
        return;
      }

      if (this.state.currentTool === 'inspect') {
        const t = this.toMathX(mouseX);
        const { A, omega, phi0 } = this.params;
        const x = A * Math.cos(omega * t + phi0);
        const v = -A * omega * Math.sin(omega * t + phi0);
        const a = -A * omega * omega * Math.cos(omega * t + phi0);

        this.state.hoverPoint = { t, x, v, a, screenX: mouseX, screenY: mouseY };
        this.render();
      }
    });

    canvas.addEventListener('mouseleave', () => {
      this.state.hoverPoint = null;
      this.hideCoordBadge();
      this.render();
    });

    // Soporte Táctil (Pinch to Zoom & Pan con dedos)
    let lastTouchDist = null;
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        this.state.isPanning = true;
        this.state.panStartX = touch.clientX - rect.left - this.state.originX;
        this.state.panStartY = touch.clientY - rect.top - this.state.originY;
      } else if (e.touches.length === 2) {
        this.state.isPanning = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist = Math.hypot(dx, dy);
      }
    });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      if (e.touches.length === 1 && this.state.isPanning) {
        const touch = e.touches[0];
        this.state.originX = touch.clientX - rect.left - this.state.panStartX;
        this.state.originY = touch.clientY - rect.top - this.state.panStartY;
        this.render();
      } else if (e.touches.length === 2 && lastTouchDist) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const factor = dist / lastTouchDist;
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

        this.zoomAt(midX, midY, factor);
        lastTouchDist = dist;
      }
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      this.state.isPanning = false;
      lastTouchDist = null;
    });
  }

  // Zoom enfocado
  zoomAt(px, py, factor) {
    const mathX = this.toMathX(px);
    const mathY = this.toMathY(py);

    const newScaleX = Math.min(Math.max(this.state.scaleX * factor, this.state.minScale), this.state.maxScale);
    const newScaleY = Math.min(Math.max(this.state.scaleY * factor, this.state.minScale), this.state.maxScale);

    this.state.scaleX = newScaleX;
    this.state.scaleY = newScaleY;

    this.state.originX = px - mathX * this.state.scaleX;
    this.state.originY = py + mathY * this.state.scaleY;

    this.render();
  }

  // Comandos de Botones de la Barra de Herramientas
  zoomIn() {
    this.zoomAt(this.width / 2, this.height / 2, 1.25);
  }

  zoomOut() {
    this.zoomAt(this.width / 2, this.height / 2, 0.8);
  }

  resetView() {
    this.state.scaleX = this.state.defaultScaleX;
    this.state.scaleY = this.state.defaultScaleY;
    this.state.originX = this.state.defaultOriginX;
    this.state.originY = this.height / 2;
    this.state.hoverPoint = null;
    this.hideCoordBadge();
    this.render();
  }

  setTool(toolName) {
    this.state.currentTool = toolName;
    if (toolName !== 'inspect') {
      this.hideCoordBadge();
      this.state.hoverPoint = null;
    }
    this.canvas.style.cursor = toolName === 'inspect' ? 'crosshair' : 'grab';
    this.render();
  }

  toggleCurve(curveKey) {
    if (this.curves.hasOwnProperty(curveKey)) {
      this.curves[curveKey] = !this.curves[curveKey];
      this.render();
    }
  }

  setCurveStyle(curveKey, styleObj) {
    if (this.styles[curveKey]) {
      Object.assign(this.styles[curveKey], styleObj);
      this.render();
    }
  }

  updateParams(newParams) {
    Object.assign(this.params, newParams);
    this.render();
  }
}

// Exportar globalmente
window.GeoGebraPlane = GeoGebraPlane;
