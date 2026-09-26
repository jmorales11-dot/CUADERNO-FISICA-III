/**
 * ============================================================================
 * MAPA MENTAL INTERACTIVO SVG: MOVIMIENTO OSCILATORIO Y MAS
 * Nodos ramificados, efectos hover, descripciones emergentes y salto a páginas
 * ============================================================================
 */

function renderInteractiveMindMap(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const svgData = `
    <svg viewBox="0 0 920 460" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradCenter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#4c1d95"/>
        </linearGradient>
        <linearGradient id="gradGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#d4af37"/>
        </linearGradient>
        <linearGradient id="gradNode" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f5f3ff"/>
          <stop offset="100%" stop-color="#ede9fe"/>
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#2c1a4d" flood-opacity="0.18"/>
        </filter>
      </defs>

      <!-- Conectores / Ramas Curvas -->
      <!-- Rama 1: Cinemática (Arriba Izq) -->
      <path d="M 460 230 C 350 210, 260 120, 200 110" fill="none" stroke="#a78bfa" stroke-width="3" stroke-dasharray="4,4"/>
      <!-- Rama 2: Dinámica y Newton (Abajo Izq) -->
      <path d="M 460 230 C 350 250, 260 340, 200 350" fill="none" stroke="#a78bfa" stroke-width="3"/>
      <!-- Rama 3: Energía (Arriba Der) -->
      <path d="M 460 230 C 570 210, 660 120, 720 110" fill="none" stroke="#a78bfa" stroke-width="3"/>
      <!-- Rama 4: Modelos Físicos (Abajo Der) -->
      <path d="M 460 230 C 570 250, 660 340, 720 350" fill="none" stroke="#a78bfa" stroke-width="3" stroke-dasharray="4,4"/>

      <!-- Sub-ramas Cinemática -->
      <path d="M 200 110 C 130 90, 100 60, 80 50" fill="none" stroke="#c4b5fd" stroke-width="2"/>
      <path d="M 200 110 C 130 130, 100 160, 80 170" fill="none" stroke="#c4b5fd" stroke-width="2"/>

      <!-- Sub-ramas Dinámica -->
      <path d="M 200 350 C 130 330, 100 300, 80 290" fill="none" stroke="#c4b5fd" stroke-width="2"/>
      <path d="M 200 350 C 130 370, 100 400, 80 410" fill="none" stroke="#c4b5fd" stroke-width="2"/>

      <!-- Sub-ramas Energía -->
      <path d="M 720 110 C 790 90, 820 60, 840 50" fill="none" stroke="#c4b5fd" stroke-width="2"/>
      <path d="M 720 110 C 790 130, 820 160, 840 170" fill="none" stroke="#c4b5fd" stroke-width="2"/>

      <!-- Sub-ramas Modelos -->
      <path d="M 720 350 C 790 330, 820 300, 840 290" fill="none" stroke="#c4b5fd" stroke-width="2"/>
      <path d="M 720 350 C 790 370, 820 400, 840 410" fill="none" stroke="#c4b5fd" stroke-width="2"/>

      <!-- NODO CENTRAL -->
      <g class="mindmap-node" onclick="window.NotebookApp.goToPage(5)">
        <rect x="340" y="195" width="240" height="70" rx="35" fill="url(#gradCenter)" stroke="#d4af37" stroke-width="2.5" filter="url(#shadow)"/>
        <text x="460" y="228" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="bold" font-size="16" fill="#ffffff">MOVIMIENTO</text>
        <text x="460" y="248" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="bold" font-size="14" fill="#fef08a">ARMÓNICO SIMPLE (MAS)</text>
      </g>

      <!-- NODO 1: CINEMÁTICA -->
      <g class="mindmap-node" onclick="window.NotebookApp.goToPage(7)">
        <rect x="110" y="80" width="180" height="58" rx="14" fill="url(#gradNode)" stroke="#7c3aed" stroke-width="2" filter="url(#shadow)"/>
        <text x="200" y="106" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="bold" font-size="14" fill="#3b0764">1. CINEMÁTICA</text>
        <text x="200" y="124" text-anchor="middle" font-family="'Inter', sans-serif" font-size="11" fill="#6b21a8">x(t), v(t), a(t), Fasores</text>
      </g>

      <!-- NODO 2: DINÁMICA -->
      <g class="mindmap-node" onclick="window.NotebookApp.goToPage(6)">
        <rect x="110" y="320" width="180" height="58" rx="14" fill="url(#gradNode)" stroke="#7c3aed" stroke-width="2" filter="url(#shadow)"/>
        <text x="200" y="346" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="bold" font-size="14" fill="#3b0764">2. DINÁMICA</text>
        <text x="200" y="364" text-anchor="middle" font-family="'Inter', sans-serif" font-size="11" fill="#6b21a8">Ley de Hooke: F = -kx</text>
      </g>

      <!-- NODO 3: ENERGÍA -->
      <g class="mindmap-node" onclick="window.NotebookApp.goToPage(9)">
        <rect x="630" y="80" width="180" height="58" rx="14" fill="url(#gradNode)" stroke="#7c3aed" stroke-width="2" filter="url(#shadow)"/>
        <text x="720" y="106" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="bold" font-size="14" fill="#3b0764">3. ENERGÍA</text>
        <text x="720" y="124" text-anchor="middle" font-family="'Inter', sans-serif" font-size="11" fill="#6b21a8">E = Ec + Ep = cte</text>
      </g>

      <!-- NODO 4: MODELOS Y SISTEMAS -->
      <g class="mindmap-node" onclick="window.NotebookApp.goToPage(9)">
        <rect x="630" y="320" width="180" height="58" rx="14" fill="url(#gradNode)" stroke="#7c3aed" stroke-width="2" filter="url(#shadow)"/>
        <text x="720" y="346" text-anchor="middle" font-family="'Playfair Display', serif" font-weight="bold" font-size="14" fill="#3b0764">4. SISTEMAS</text>
        <text x="720" y="364" text-anchor="middle" font-family="'Inter', sans-serif" font-size="11" fill="#6b21a8">Resorte y Péndulo</text>
      </g>

      <!-- SUB-NODOS (HOJAS) -->
      <!-- Cinemática Hojas -->
      <g class="mindmap-node">
        <rect x="15" y="32" width="125" height="34" rx="8" fill="#ffffff" stroke="#caa355" stroke-width="1.2"/>
        <text x="77" y="53" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#4c1d95">Desfasajes (π/2, π)</text>
      </g>
      <g class="mindmap-node">
        <rect x="15" y="152" width="125" height="34" rx="8" fill="#ffffff" stroke="#caa355" stroke-width="1.2"/>
        <text x="77" y="173" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#4c1d95">Círculo Fasorial</text>
      </g>

      <!-- Dinámica Hojas -->
      <g class="mindmap-node">
        <rect x="15" y="272" width="125" height="34" rx="8" fill="#ffffff" stroke="#caa355" stroke-width="1.2"/>
        <text x="77" y="293" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#4c1d95">Ecuación Dif. d²x/dt²</text>
      </g>
      <g class="mindmap-node">
        <rect x="15" y="392" width="125" height="34" rx="8" fill="#ffffff" stroke="#caa355" stroke-width="1.2"/>
        <text x="77" y="413" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#4c1d95">Frecuencia ω = √(k/m)</text>
      </g>

      <!-- Energía Hojas -->
      <g class="mindmap-node">
        <rect x="780" y="32" width="125" height="34" rx="8" fill="#ffffff" stroke="#caa355" stroke-width="1.2"/>
        <text x="842" y="53" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#4c1d95">Cinética: ½mv²</text>
      </g>
      <g class="mindmap-node">
        <rect x="780" y="152" width="125" height="34" rx="8" fill="#ffffff" stroke="#caa355" stroke-width="1.2"/>
        <text x="842" y="173" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#4c1d95">Potencial: ½kx²</text>
      </g>

      <!-- Sistemas Hojas -->
      <g class="mindmap-node">
        <rect x="780" y="272" width="125" height="34" rx="8" fill="#ffffff" stroke="#caa355" stroke-width="1.2"/>
        <text x="842" y="293" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#4c1d95">Péndulo Simple</text>
      </g>
      <g class="mindmap-node">
        <rect x="780" y="392" width="125" height="34" rx="8" fill="#ffffff" stroke="#caa355" stroke-width="1.2"/>
        <text x="842" y="413" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#4c1d95">Oscilador Horizontal</text>
      </g>
    </svg>
  `;

  container.innerHTML = svgData;
}

window.renderInteractiveMindMap = renderInteractiveMindMap;
