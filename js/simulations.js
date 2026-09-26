/**
 * ============================================================================
 * MOTOR DE SIMULACIONES FÍSICAS INTERACTIVAS EN TIEMPO REAL
 * Sistema Masa-Resorte, Proyección de Fasores y Conservación de Energía
 * ============================================================================
 */

class PhysicsSimulationLab {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Parámetros Físicos
    this.m = 1.0;       // Masa en kg
    this.k = 25.0;      // Constante del resorte en N/m
    this.A = 1.8;       // Amplitud en metros
    this.phi0 = 0.0;    // Fase inicial en radianes

    // Cálculo de parámetros derivados
    this.updateDerivatives();

    // Estado dinámico
    this.t = 0.0;
    this.isPlaying = true;
    this.speedFactor = 1.0;
    this.lastFrameTime = performance.now();

    // Historial para trazo de onda
    this.waveHistory = [];
    this.maxHistory = 240;

    this.init();
  }

  updateDerivatives() {
    this.omega = Math.sqrt(this.k / this.m);     // Frecuencia angular natural [rad/s]
    this.T = (2 * Math.PI) / this.omega;          // Período [s]
    this.f = 1 / this.T;                          // Frecuencia [Hz]
    this.vMax = this.omega * this.A;              // Velocidad máxima [m/s]
    this.aMax = this.omega * this.omega * this.A; // Aceleración máxima [m/s²]
    this.E_total = 0.5 * this.k * this.A * this.A; // Energía total [J]
  }

  init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
    this.startLoop();
  }

  handleResize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height || 350;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
  }

  startLoop() {
    const loop = (now) => {
      const dt = Math.min((now - this.lastFrameTime) / 1000, 0.05);
      this.lastFrameTime = now;

      if (this.isPlaying) {
        this.t += dt * this.speedFactor;
      }

      this.updatePhysics();
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  updatePhysics() {
    // Fórmulas exactas del MAS
    this.x = this.A * Math.cos(this.omega * this.t + this.phi0);
    this.v = -this.A * this.omega * Math.sin(this.omega * this.t + this.phi0);
    this.a = -this.omega * this.omega * this.x;
    this.F = -this.k * this.x;

    // Energías
    this.Ek = 0.5 * this.m * this.v * this.v;
    this.Ep = 0.5 * this.k * this.x * this.x;
    this.Em = this.Ek + this.Ep;

    // Actualizar historial de onda
    this.waveHistory.unshift({ t: this.t, x: this.x });
    if (this.waveHistory.length > this.maxHistory) {
      this.waveHistory.pop();
    }

    this.updateDOMGauges();
  }

  updateDOMGauges() {
    // Actualizar barras de energía
    const eKBar = document.getElementById('sim-ek-fill');
    const ePBar = document.getElementById('sim-ep-fill');
    const eMBar = document.getElementById('sim-em-fill');
    const eKVal = document.getElementById('sim-ek-val');
    const ePVal = document.getElementById('sim-ep-val');
    const eMVal = document.getElementById('sim-em-val');

    const maxE = Math.max(this.E_total, 0.001);
    if (eKBar) eKBar.style.width = `${Math.min(100, (this.Ek / maxE) * 100)}%`;
    if (ePBar) ePBar.style.width = `${Math.min(100, (this.Ep / maxE) * 100)}%`;
    if (eMBar) eMBar.style.width = `100%`;

    if (eKVal) eKVal.textContent = `${this.Ek.toFixed(2)} J`;
    if (ePVal) ePVal.textContent = `${this.Ep.toFixed(2)} J`;
    if (eMVal) eMVal.textContent = `${this.Em.toFixed(2)} J`;

    // Actualizar telemetría numérica
    const tVal = document.getElementById('tel-t');
    const xVal = document.getElementById('tel-x');
    const vVal = document.getElementById('tel-v');
    const aVal = document.getElementById('tel-a');

    if (tVal) tVal.textContent = `${this.t.toFixed(2)} s`;
    if (xVal) xVal.textContent = `${this.x.toFixed(2)} m`;
    if (vVal) vVal.textContent = `${this.v.toFixed(2)} m/s`;
    if (aVal) aVal.textContent = `${this.a.toFixed(2)} m/s²`;
  }

  // Dibuja el resorte helicoidal realista
  drawSpring(startX, startY, endX, endY, coils = 16, radius = 14) {
    const ctx = this.ctx;
    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(0, 0);

    const leadIn = 15;
    const leadOut = 15;
    const coilDist = dist - leadIn - leadOut;
    ctx.lineTo(leadIn, 0);

    const step = coilDist / coils;
    for (let i = 0; i < coils; i++) {
      const x1 = leadIn + i * step + step * 0.25;
      const y1 = -radius;
      const x2 = leadIn + i * step + step * 0.75;
      const y2 = radius;
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
    }

    ctx.lineTo(dist - leadOut, 0);
    ctx.lineTo(dist, 0);

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Brillo metálico
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  }

  // Dibuja vectores con punta de flecha proporcional
  drawVector(x, y, vx, vy, color, label) {
    if (Math.hypot(vx, vy) < 2) return;
    const ctx = this.ctx;
    const endX = x + vx;
    const endY = y + vy;
    const angle = Math.atan2(vy, vx);
    const headLen = 8;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Punta de flecha
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - headLen * Math.cos(angle - Math.PI / 6), endY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(endX - headLen * Math.cos(angle + Math.PI / 6), endY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // Etiqueta del vector
    ctx.font = 'bold 11px "Inter", sans-serif';
    ctx.fillText(label, endX + 8 * Math.cos(angle), endY + 8 * Math.sin(angle));
    ctx.restore();
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const centerY = this.height * 0.35;
    const centerX = this.width * 0.5;
    const scalePx = (this.width * 0.28) / 2.5; // Escala visual

    // 1. Pared de soporte fija (a la izquierda)
    const wallX = centerX - 2.8 * scalePx;
    ctx.fillStyle = '#475569';
    ctx.fillRect(wallX - 14, centerY - 60, 14, 120);

    // Patrón de sombreado diagonal en la pared
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    for (let py = centerY - 55; py < centerY + 60; py += 10) {
      ctx.beginPath();
      ctx.moveTo(wallX - 14, py);
      ctx.lineTo(wallX, py - 8);
      ctx.stroke();
    }

    // Superficie / Mesa de apoyo horizontal
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(wallX, centerY + 30, this.width - wallX - 20, 8);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(wallX, centerY + 30);
    ctx.lineTo(this.width - 20, centerY + 30);
    ctx.stroke();

    // Línea de referencia de equilibrio x = 0
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 70);
    ctx.lineTo(centerX, centerY + 50);
    ctx.stroke();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#7c3aed';
    ctx.fillText('x = 0 (Equilibrio)', centerX - 36, centerY - 75);
    ctx.restore();

    // Posición del bloque de masa m
    const blockX = centerX + this.x * scalePx;
    const blockSize = 48;

    // Dibujar Resorte
    this.drawSpring(wallX, centerY, blockX - blockSize / 2, centerY, 15, 14);

    // Dibujar Bloque de Masa
    ctx.save();
    const grad = ctx.createLinearGradient(blockX - blockSize / 2, centerY - blockSize / 2, blockX + blockSize / 2, centerY + blockSize / 2);
    grad.addColorStop(0, '#a78bfa');
    grad.addColorStop(1, '#6d28d9');

    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(109, 40, 217, 0.35)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(blockX - blockSize / 2, centerY - blockSize / 2, blockSize, blockSize, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Etiqueta de la masa
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`m = ${this.m}kg`, blockX, centerY);
    ctx.restore();

    // Dibujar Vectores Dinámicos en Vivo sobre el Bloque
    // Vector Velocidad (Verde)
    const vScale = 22 / (this.vMax || 1);
    this.drawVector(blockX, centerY - 32, this.v * vScale, 0, '#059669', 'v');

    // Vector Aceleración (Rojo carmín)
    const aScale = 22 / (this.aMax || 1);
    this.drawVector(blockX, centerY + 32, this.a * aScale, 0, '#dc2626', 'a');

    // 2. Proyección de Fasores / Círculo de Referencia (Mitad Inferior)
    const phasorCenterY = this.height * 0.78;
    const phasorRadius = this.A * scalePx * 0.55;

    // Eje de trayectoria
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, phasorCenterY);
    ctx.lineTo(this.width - 30, phasorCenterY);
    ctx.stroke();

    // Círculo de referencia
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, phasorCenterY, phasorRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Fasor rotatorio (Vector de amplitud A)
    const angle = this.omega * this.t + this.phi0;
    const phasorTipX = centerX + phasorRadius * Math.cos(angle);
    const phasorTipY = phasorCenterY - phasorRadius * Math.sin(angle);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(centerX, phasorCenterY);
    ctx.lineTo(phasorTipX, phasorTipY);
    ctx.stroke();

    // Punto en la punta del fasor
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(phasorTipX, phasorTipY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Línea de proyección vertical al eje armónico
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.6)';
    ctx.beginPath();
    ctx.moveTo(phasorTipX, phasorTipY);
    ctx.lineTo(phasorTipX, phasorCenterY);
    ctx.stroke();

    // Punto proyectado (MAS)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(phasorTipX, phasorCenterY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '10px "Inter", sans-serif';
    ctx.fillStyle = '#52476b';
    ctx.fillText('Proyección Fasorial: x(t) = A·cos(ωt + φ₀)', centerX - 85, phasorCenterY + 24);
    ctx.restore();
  }

  play() { this.isPlaying = true; }
  pause() { this.isPlaying = false; }
  step() {
    this.t += 0.05;
    this.updatePhysics();
    this.render();
  }
  setSpeed(factor) { this.speedFactor = factor; }

  setMass(val) {
    this.m = Math.max(0.1, val);
    this.updateDerivatives();
  }

  setSpringK(val) {
    this.k = Math.max(1.0, val);
    this.updateDerivatives();
  }

  setAmplitude(val) {
    this.A = Math.max(0.1, val);
    this.updateDerivatives();
  }
}

window.PhysicsSimulationLab = PhysicsSimulationLab;
