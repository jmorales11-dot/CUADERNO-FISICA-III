/**
 * ============================================================================
 * TALLER INTERACTIVO DE RESOLUCIÓN DE PROBLEMAS METODOLOGÍA RIGUROSA
 * Protocolo de 5 Pasos:
 * 1) Datos en Azul
 * 2) Incógnitas en Rojo
 * 3) Fórmulas necesarias
 * 4) Sustitución, conversión, despeje y resultados en Naranja
 * 5) Validación física y conclusiones
 * ============================================================================
 */

class InteractiveProblemSolver {
  constructor() {
    this.initProblem1();
    this.initProblem2();
  }

  initProblem1() {
    const inputM = document.getElementById('p1-m');
    const inputK = document.getElementById('p1-k');
    const inputA = document.getElementById('p1-a');

    const recalculate = () => {
      if (!inputM || !inputK || !inputA) return;
      const m = parseFloat(inputM.value) || 0.5;
      const k = parseFloat(inputK.value) || 200.0;
      const A = parseFloat(inputA.value) || 0.08;

      // Cálculos Físicos
      const omega = Math.sqrt(k / m);
      const T = (2 * Math.PI) / omega;
      const f = 1 / T;
      const vMax = omega * A;
      const aMax = omega * omega * A;
      const E = 0.5 * k * A * A;

      // 1. Actualizar Datos en Azul
      const dM = document.getElementById('p1-data-m');
      const dK = document.getElementById('p1-data-k');
      const dA = document.getElementById('p1-data-a');
      if (dM) dM.textContent = `${m} kg`;
      if (dK) dK.textContent = `${k} N/m`;
      if (dA) dA.textContent = `${A} m (${(A * 100).toFixed(1)} cm)`;

      // 4. Actualizar Resultados Resueltos en Naranja (Ya no son incógnitas)
      const rOmega = document.getElementById('p1-res-omega');
      const rT = document.getElementById('p1-res-t');
      const rF = document.getElementById('p1-res-f');
      const rVmax = document.getElementById('p1-res-vmax');
      const rAmax = document.getElementById('p1-res-amax');
      const rE = document.getElementById('p1-res-e');

      if (rOmega) rOmega.textContent = `${omega.toFixed(2)} rad/s`;
      if (rT) rT.textContent = `${T.toFixed(3)} s`;
      if (rF) rF.textContent = `${f.toFixed(2)} Hz`;
      if (rVmax) rVmax.textContent = `${vMax.toFixed(3)} m/s`;
      if (rAmax) rAmax.textContent = `${aMax.toFixed(2)} m/s²`;
      if (rE) rE.textContent = `${E.toFixed(4)} J`;

      // Actualizar Bloques de Sustitución Numérica
      const subOmega = document.getElementById('p1-calc-omega');
      if (subOmega) {
        subOmega.innerHTML = `$$\\omega = \\sqrt{\\frac{${k}\\text{ N/m}}{${m}\\text{ kg}}} = \\sqrt{${(k/m).toFixed(2)}} = \\mathbf{${omega.toFixed(2)}\\text{ rad/s}}$$`;
      }
      const subT = document.getElementById('p1-calc-t');
      if (subT) {
        subT.innerHTML = `$$T = \\frac{2\\pi}{${omega.toFixed(2)}} = \\mathbf{${T.toFixed(3)}\\text{ s}}, \\quad f = \\frac{1}{${T.toFixed(3)}} = \\mathbf{${f.toFixed(2)}\\text{ Hz}}$$`;
      }
      const subVmax = document.getElementById('p1-calc-vmax');
      if (subVmax) {
        subVmax.innerHTML = `$$v_{\\max} = (${omega.toFixed(2)}\\text{ rad/s})(${A}\\text{ m}) = \\mathbf{${vMax.toFixed(3)}\\text{ m/s}}$$`;
      }

      // Renderizar KaTeX en los bloques dinámicos
      if (window.renderMathInElement) {
        const p1Block = document.getElementById('exercise-1-container');
        if (p1Block) {
          window.renderMathInElement(p1Block, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ]
          });
        }
      }
    };

    if (inputM && inputK && inputA) {
      inputM.addEventListener('input', recalculate);
      inputK.addEventListener('input', recalculate);
      inputA.addEventListener('input', recalculate);
    }
  }

  initProblem2() {
    const inputX0 = document.getElementById('p2-x0');
    const inputV0 = document.getElementById('p2-v0');
    const inputW = document.getElementById('p2-w');
    const inputT1 = document.getElementById('p2-t1');

    const recalculate2 = () => {
      if (!inputX0 || !inputV0 || !inputW || !inputT1) return;
      const x0 = parseFloat(inputX0.value) || 0.05;
      const v0 = parseFloat(inputV0.value) || -0.4;
      const w = parseFloat(inputW.value) || 10.0;
      const t1 = parseFloat(inputT1.value) || 0.25;

      // Cálculos
      // x(0) = A * cos(phi0) = x0
      // v(0) = -A * w * sin(phi0) = v0  => tan(phi0) = -v0 / (w * x0)
      const tanPhi = -v0 / (w * x0);
      let phi0 = Math.atan2(-v0 / w, x0);
      const A = Math.sqrt(x0 * x0 + Math.pow(v0 / w, 2));

      // Evaluación en t1
      const x1 = A * Math.cos(w * t1 + phi0);
      const v1 = -A * w * Math.sin(w * t1 + phi0);

      // Actualizar Datos en Azul
      const dX0 = document.getElementById('p2-data-x0');
      const dV0 = document.getElementById('p2-data-v0');
      const dW = document.getElementById('p2-data-w');
      if (dX0) dX0.textContent = `${x0} m`;
      if (dV0) dV0.textContent = `${v0} m/s`;
      if (dW) dW.textContent = `${w} rad/s`;

      // Actualizar Resultados en Naranja
      const rA = document.getElementById('p2-res-a');
      const rPhi = document.getElementById('p2-res-phi');
      const rX1 = document.getElementById('p2-res-x1');
      const rV1 = document.getElementById('p2-res-v1');

      if (rA) rA.textContent = `${A.toFixed(4)} m (${(A * 100).toFixed(2)} cm)`;
      if (rPhi) rPhi.textContent = `${phi0.toFixed(3)} rad (${((phi0 * 180) / Math.PI).toFixed(1)}°)`;
      if (rX1) rX1.textContent = `${x1.toFixed(4)} m`;
      if (rV1) rV1.textContent = `${v1.toFixed(3)} m/s`;

      // Renderizar KaTeX
      if (window.renderMathInElement) {
        const p2Block = document.getElementById('exercise-2-container');
        if (p2Block) {
          window.renderMathInElement(p2Block, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ]
          });
        }
      }
    };

    if (inputX0 && inputV0 && inputW && inputT1) {
      inputX0.addEventListener('input', recalculate2);
      inputV0.addEventListener('input', recalculate2);
      inputW.addEventListener('input', recalculate2);
      inputT1.addEventListener('input', recalculate2);
    }
  }
}

window.InteractiveProblemSolver = InteractiveProblemSolver;
