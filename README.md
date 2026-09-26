
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cuaderno Interactivo Virtual - Física 3 (UTP)</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            utp: {
              green: '#006837',
              gold: '#fdb913',
              blue: '#004274',
              dark: '#0f172a'
            },
            royal: {
              50: '#f0f7ff',
              100: '#e0effe',
              500: '#0c87e8',
              700: '#0254a3',
              900: '#0b3c70',
            }
          },
          fontFamily: {
            serif: ['Cormorant Garamond', 'Georgia', 'serif'],
            sans: ['Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace']
          }
        }
      }
    }
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet">

  <!-- KaTeX for crisp mathematical formulas -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>

  <!-- Three.js for 3D Physics Simulation -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>

  <style>
    body {
      background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
      min-height: 100vh;
    }

    .book-wrapper {
      perspective: 2200px;
      perspective-origin: 50% 50%;
    }

    .book-spread {
      position: relative;
      width: 100%;
      max-width: 1300px;
      min-height: 740px;
      background: linear-gradient(to right, #003358 0%, #004d80 50%, #003358 100%);
      border-radius: 20px;
      box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(253, 185, 19, 0.15);
      border: 3px solid #fdb913;
      display: flex;
      overflow: hidden;
      transition: all 0.4s ease;
    }

    .book-spine {
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 36px;
      transform: translateX(-50%);
      background: linear-gradient(to right, 
        rgba(0, 0, 0, 0.4) 0%, 
        rgba(0, 0, 0, 0.05) 40%, 
        rgba(0, 0, 0, 0.5) 50%, 
        rgba(0, 0, 0, 0.05) 60%, 
        rgba(0, 0, 0, 0.4) 100%);
      z-index: 30;
      pointer-events: none;
    }

    .book-page-half {
      width: 50%;
      min-height: 740px;
      background-color: #ffffff;
      color: #0f172a;
      padding: 2.25rem 2.5rem;
      position: relative;
      overflow-y: auto;
      max-height: 83vh;
      box-shadow: inset 0 0 20px rgba(0,0,0,0.03);
    }

    /* Standard high-resolution technical notebook background without external image files */
    .interior-page-template {
      background-color: #ffffff;
      background-image: 
        linear-gradient(rgba(0, 66, 116, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 66, 116, 0.05) 1px, transparent 1px);
      background-size: 20px 20px;
      position: relative;
    }

    .book-page-left {
      border-right: 1px solid #cbd5e1;
    }

    .book-page-right {
      border-left: 1px solid #cbd5e1;
    }

    .page-turn-anim-next {
      animation: turnNext 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .page-turn-anim-prev {
      animation: turnPrev 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes turnNext {
      0% { transform: rotateY(0deg); opacity: 1; }
      50% { transform: rotateY(-12deg) scale(0.98); opacity: 0.8; }
      100% { transform: rotateY(0deg); opacity: 1; }
    }

    @keyframes turnPrev {
      0% { transform: rotateY(0deg); opacity: 1; }
      50% { transform: rotateY(12deg) scale(0.98); opacity: 0.8; }
      100% { transform: rotateY(0deg); opacity: 1; }
    }

    .book-page-half::-webkit-scrollbar {
      width: 6px;
    }
    .book-page-half::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    .book-page-half::-webkit-scrollbar-thumb {
      background: #004274;
      border-radius: 3px;
    }

    .data-text { color: #0284c7; font-weight: 700; }
    .unknown-text { color: #dc2626; font-weight: 700; }
    .solved-text { color: #d97706; font-weight: 800; }

    .page-title-centered {
      text-align: center;
      font-family: 'Playfair Display', Georgia, serif;
      color: #0f172a;
      font-weight: 800;
      position: relative;
      padding-bottom: 0.75rem;
      margin-bottom: 1.25rem;
    }
    .page-title-centered::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 90px;
      height: 3px;
      background: linear-gradient(90deg, #006837, #fdb913, #004274);
      border-radius: 2px;
    }

    /* Concept map styling */
    .mindmap-node {
      transition: all 0.25s ease;
      cursor: pointer;
    }
    .mindmap-node:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 10px 20px -5px rgba(0, 66, 116, 0.3);
    }

    @keyframes syncOscillate {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-12px);
      }
    }
    .animate-sync-oscillation {
      animation: syncOscillate 3.5s ease-in-out infinite;
    }

    @media (max-width: 1024px) {
      .book-spread {
        flex-direction: column;
        max-height: none;
      }
      .book-page-half {
        width: 100%;
        max-height: none;
        min-height: auto;
      }
      .book-spine { display: none; }
    }
  </style>
</head>
<body class="text-slate-800 flex flex-col min-h-screen justify-between">

  <header class="bg-slate-900/95 backdrop-blur-md border-b-2 border-amber-500 text-white px-4 py-3 sticky top-0 z-50 shadow-xl">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
      
      <div class="flex items-center gap-3">
        <!-- Badge UTP -->
        <div class="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-600 to-blue-800 flex items-center justify-center shadow-lg shadow-amber-500/20 p-1">
          <div class="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center font-black text-amber-400 text-xs tracking-tighter">
            UTP
          </div>
        </div>
        <div>
          <h1 class="text-base md:text-lg font-black tracking-tight bg-gradient-to-r from-amber-300 via-emerald-200 to-cyan-100 bg-clip-text text-transparent">
            UNIVERSIDAD TECNOLÓGICA DE PEREIRA &bull; FÍSICA 3
          </h1>
          <p class="text-xs text-amber-200/90 font-medium">
            Cuaderno Interactivo Virtual &bull; Movimiento Oscilatorio y MAS
          </p>
        </div>
      </div>

      <!-- Authors Header Badge -->
      <div class="hidden lg:flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs">
        <span class="text-amber-400 font-bold">Autores UTP:</span>
        <span class="text-slate-200">Esley Bolaños B. | Ximena León R. | Ángela Johana Morales O.</span>
      </div>

      <div class="flex items-center gap-2">
        <button id="btn-fullscreen" class="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-blue-700 hover:from-emerald-500 hover:to-blue-600 active:scale-95 text-xs font-bold rounded-lg text-white transition flex items-center gap-1.5 shadow">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
          </svg>
          <span>Pantalla Completa</span>
        </button>
      </div>

    </div>
  </header>

  <main class="flex-grow flex items-center justify-center p-3 md:p-6">
    <div class="book-wrapper w-full flex justify-center">
      
      <article class="book-spread" id="book-spread">
        <div class="book-spine"></div>

        <!-- LEFT PAGE -->
        <section class="book-page-half book-page-left" id="page-left-content">
          <!-- Content injected dynamically -->
        </section>

        <!-- RIGHT PAGE -->
        <section class="book-page-half book-page-right" id="page-right-content">
          <!-- Content injected dynamically -->
        </section>

      </article>

    </div>
  </main>

  <footer class="bg-slate-900 border-t border-amber-500/40 text-slate-300 px-4 py-3 sticky bottom-0 z-50">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
      
      <button id="btn-prev-spread" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-xl shadow transition flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
        </svg>
        <span>Pliego Anterior</span>
      </button>

      <div class="flex flex-col items-center gap-1">
        <div class="px-4 py-1.5 bg-slate-950 rounded-full border border-amber-500/40 text-xs font-bold text-amber-300 tracking-wide shadow-inner" id="spread-indicator">
          Páginas 1 y 2 de 14
        </div>
        
        <div class="flex items-center gap-1.5 mt-1" id="spread-dots-container">
          <!-- Navigation dots -->
        </div>
      </div>

      <button id="btn-next-spread" class="px-4 py-2 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow transition flex items-center gap-2">
        <span>Pliego Siguiente</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

    </div>

    <div class="mt-2 text-center text-xs text-slate-400 font-medium border-t border-slate-800/80 pt-2">
      Universidad Tecnológica de Pereira &bull; Cuaderno elaborado por: <strong class="text-amber-300">Esley Bolaños Bolaños</strong>, <strong class="text-amber-300">Ximena León Rojas</strong> y <strong class="text-amber-300">Ángela Johana Morales Osorio</strong>
    </div>
  </footer>

  <script>
    const notebookPages = [
      
      // ------------------------------------------------------------------
      // PÁGINA 1: PORTADA OFICIAL UTP (PLIEGO 1 - HOJA IZQUIERDA)
      // ------------------------------------------------------------------
      {
        pageNumber: 1,
        title: "PORTADA OFICIAL UTP",
        htmlContent: `
          <div class="relative w-full h-full min-h-[690px] rounded-2xl overflow-hidden shadow-2xl bg-slate-950 p-6 md:p-8 flex flex-col justify-between text-white font-sans border-2 border-amber-500/40 selection:bg-amber-500 selection:text-slate-950">
            
            <!-- Dynamic Background Lighting & Grid -->
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 pointer-events-none"></div>
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/10 blur-[90px] pointer-events-none rounded-full"></div>
            <div class="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full"></div>
            
            <!-- Fine Mathematical Blueprint Grid Overlay -->
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-60"></div>

            <!-- Top Header: Institutional Identity Badge -->
            <div class="relative z-10 flex items-center justify-between border-b border-amber-500/30 pb-4">
              <div class="flex items-center gap-3.5">
                <!-- Glowing UTP Emblem -->
                <div class="relative group">
                  <div class="absolute -inset-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
                  <div class="relative w-12 h-12 bg-slate-900 border border-amber-400/60 rounded-xl flex flex-col items-center justify-center p-1 shadow-2xl">
                    <span class="text-[13px] font-black text-amber-400 tracking-tighter leading-none">UTP</span>
                    <span class="text-[7px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">Pereira</span>
                  </div>
                </div>
                <div>
                  <h3 class="text-xs font-black uppercase tracking-widest text-amber-300">Universidad Tecnológica de Pereira</h3>
                  <p class="text-[10px] text-slate-400 font-medium">Facultad de Ciencias Básicas &bull; Departamento de Física</p>
                </div>
              </div>

              <div class="hidden sm:flex flex-col items-end text-right">
                <span class="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                  FIS-III &bull; MAS-2026
                </span>
              </div>
            </div>

            <!-- Main Title Section (High Editorial Impact) -->
            <div class="relative z-10 text-center space-y-3 my-auto py-2">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold tracking-wide backdrop-blur-md shadow-lg">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Cuaderno Académico Interactivo Virtual</span>
              </div>

              <h1 class="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight text-white drop-shadow-2xl leading-tight">
                FÍSICA <span class="bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400 bg-clip-text text-transparent italic">III</span>
              </h1>

              <p class="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto leading-relaxed italic border-t border-b border-slate-800 py-2">
                Movimiento Oscilatorio y Movimiento Armónico Simple (MAS)
              </p>
            </div>

            <!-- Central Physics Visual Art: Neon Phase Diagram & Spring System -->
            <div class="relative z-10 my-2 grid grid-cols-12 gap-3 items-center bg-slate-900/70 border border-slate-800 p-3.5 rounded-2xl backdrop-blur-md shadow-2xl">
              
              <!-- Harmonic Wave Diagram -->
              <div class="col-span-7 flex flex-col justify-center space-y-1">
                <div class="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                  <span class="font-bold text-amber-400">Ecuación de Fase Harmonic:</span>
                  <span class="font-mono text-emerald-400">$x(t) = A\\cos(\\omega t + \\phi_0)$</span>
                </div>
                <svg viewBox="0 0 220 80" class="w-full h-16 filter drop-shadow-[0_0_8px_rgba(253,185,19,0.3)]">
                  <line x1="10" y1="40" x2="210" y2="40" stroke="#334155" stroke-width="1.5" stroke-dasharray="3 3"/>
                  <line x1="20" y1="10" x2="20" y2="70" stroke="#334155" stroke-width="1.5"/>
                  <!-- Sinusoidal Trajectory with glowing gradient -->
                  <path d="M 20 40 Q 45 10, 70 40 T 120 40 T 170 40 T 210 40" fill="none" stroke="url(#coverGoldGrad)" stroke-width="3.5" stroke-linecap="round"/>
                  <!-- Amplitude markers -->
                  <circle cx="45" cy="10" r="3.5" fill="#fdb913"/>
                  <circle cx="95" cy="70" r="3.5" fill="#10b981"/>
                  <text x="52" y="14" fill="#fdb913" font-size="8" font-weight="bold">+A</text>
                  <text x="102" y="74" fill="#10b981" font-size="8" font-weight="bold">-A</text>
                  <defs>
                    <linearGradient id="coverGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#fdb913"/>
                      <stop offset="50%" stop-color="#10b981"/>
                      <stop offset="100%" stop-color="#38bdf8"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <!-- Oscillation Badge -->
              <div class="col-span-5 flex flex-col items-center justify-center border-l border-slate-800 pl-3 text-center space-y-1">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono font-bold text-xs shadow-inner">
                  $\omega$
                </div>
                <span class="text-[10px] font-bold text-slate-200">Isocronismo</span>
                <span class="text-[9px] text-slate-400 leading-tight">$T = 2\pi\sqrt{m/k}$</span>
              </div>

            </div>

            <!-- Authors Showcase Card (Sleek Glassmorphic Grid) -->
            <div class="relative z-10 bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-slate-900/90 border border-amber-500/40 rounded-2xl p-3.5 text-center shadow-2xl space-y-2 backdrop-blur-lg">
              <div class="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                </svg>
                <span>Autores UTP:</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div class="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col items-center hover:border-amber-500/50 transition">
                  <span class="font-bold text-slate-100 text-[11px]">Esley Bolaños B.</span>
                </div>
                <div class="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col items-center hover:border-amber-500/50 transition">
                  <span class="font-bold text-slate-100 text-[11px]">Ximena León R.</span>
                </div>
                <div class="p-2 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col items-center hover:border-amber-500/50 transition">
                  <span class="font-bold text-slate-100 text-[11px]">Ángela J. Morales O.</span>
                </div>
              </div>
            </div>

            <!-- Footer Stamps -->
            <div class="relative z-10 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span class="flex items-center gap-1 text-amber-400 font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Pereira, Risaralda
              </span>
              <span class="font-medium text-slate-400">Edición Digital Interactiva &bull; 2026</span>
            </div>

          </div>
        `
      },

      // ------------------------------------------------------------------
      // PÁGINA 2: ÍNDICE GENERAL E INTERACTIVO (PLIEGO 1 - HOJA DERECHA)
      // ------------------------------------------------------------------
      {
        pageNumber: 2,
        title: "ÍNDICE Y NAVEGACIÓN",
        htmlContent: `
          <div class="space-y-4">
            <h2 class="page-title-centered text-xl">Índice General de Contenidos</h2>
            <p class="text-xs text-slate-600 text-center -mt-2 mb-3">
              Selecciona cualquier módulo para navegar directamente entre los pliegos del libro.
            </p>

            <div class="grid grid-cols-1 gap-2 text-xs">
              
              <div onclick="goToSpread(1)" class="p-2.5 bg-white hover:bg-amber-50 rounded-xl border border-slate-200 transition cursor-pointer flex items-center justify-between group shadow-sm">
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center">01</span>
                  <div>
                    <h4 class="font-bold text-slate-800 group-hover:text-amber-700">Portada Oficial UTP e Índice General</h4>
                    <p class="text-slate-500 text-[11px]">Créditos UTP, blueprint ilustrado y guía de estudio.</p>
                  </div>
                </div>
                <span class="text-slate-400 font-bold">Pág 1-2</span>
              </div>

              <div onclick="goToSpread(2)" class="p-2.5 bg-white hover:bg-emerald-50 rounded-xl border border-slate-200 transition cursor-pointer flex items-center justify-between group shadow-sm">
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center">02</span>
                  <div>
                    <h4 class="font-bold text-slate-800 group-hover:text-emerald-700">Historia & Mapa Conceptual Interactivo</h4>
                    <p class="text-slate-500 text-[11px]">Línea del tiempo (Galileo a Fourier) y nodos interactivos.</p>
                  </div>
                </div>
                <span class="text-slate-400 font-bold">Pág 3-4</span>
              </div>

              <div onclick="goToSpread(3)" class="p-2.5 bg-white hover:bg-blue-50 rounded-xl border border-slate-200 transition cursor-pointer flex items-center justify-between group shadow-sm">
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg bg-blue-700 text-white font-black flex items-center justify-center">03</span>
                  <div>
                    <h4 class="font-bold text-slate-800 group-hover:text-blue-700">Fundamentos y Ecuación Diferencial</h4>
                    <p class="text-slate-500 text-[11px]">Deducción paso a paso de $m\\ddot{x} + kx = 0$ y magnitudes.</p>
                  </div>
                </div>
                <span class="text-slate-400 font-bold">Pág 5-6</span>
              </div>

              <div onclick="goToSpread(4)" class="p-2.5 bg-white hover:bg-cyan-50 rounded-xl border border-slate-200 transition cursor-pointer flex items-center justify-between group shadow-sm">
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg bg-cyan-600 text-white font-black flex items-center justify-center">04</span>
                  <div>
                    <h4 class="font-bold text-slate-800 group-hover:text-cyan-700">Cinemática Diferencial & Plano GeoGebra</h4>
                    <p class="text-slate-500 text-[11px]">Ecuaciones $x(t), v(t), a(t)$ y trazador de gráficos dinámico.</p>
                  </div>
                </div>
                <span class="text-slate-400 font-bold">Pág 7-8</span>
              </div>

              <div onclick="goToSpread(5)" class="p-2.5 bg-white hover:bg-indigo-50 rounded-xl border border-slate-200 transition cursor-pointer flex items-center justify-between group shadow-sm">
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg bg-indigo-700 text-white font-black flex items-center justify-center">05</span>
                  <div>
                    <h4 class="font-bold text-slate-800 group-hover:text-indigo-700">Laboratorio GeoGebra & Simulación 3D</h4>
                    <p class="text-slate-500 text-[11px]">Laboratorio de energía y simulación WebGL Three.js 3D.</p>
                  </div>
                </div>
                <span class="text-slate-400 font-bold">Pág 9-10</span>
              </div>

              <div onclick="goToSpread(6)" class="p-2.5 bg-white hover:bg-amber-50 rounded-xl border border-slate-200 transition cursor-pointer flex items-center justify-between group shadow-sm">
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg bg-amber-600 text-white font-black flex items-center justify-center">06</span>
                  <div>
                    <h4 class="font-bold text-slate-800 group-hover:text-amber-700">Taller con Calculadora Interactiva</h4>
                    <p class="text-slate-500 text-[11px]">Problemas resueltos (Cromáticos) y calculadores instantáneos.</p>
                  </div>
                </div>
                <span class="text-slate-400 font-bold">Pág 11-12</span>
              </div>

              <div onclick="goToSpread(7)" class="p-2.5 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer flex items-center justify-between group shadow-sm">
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-lg bg-slate-800 text-white font-black flex items-center justify-center">07</span>
                  <div>
                    <h4 class="font-bold text-slate-800 group-hover:text-slate-900">Quiz Interactivo, Glosario & APA 7</h4>
                    <p class="text-slate-500 text-[11px]">Auto-evaluación dinámica, diccionario de conceptos y fuentes.</p>
                  </div>
                </div>
                <span class="text-slate-400 font-bold">Pág 13-14</span>
              </div>

            </div>
          </div>
        `
      },

      // ------------------------------------------------------------------
      // PÁGINA 3: RESEÑA HISTÓRICA E HITOS (PLIEGO 2 - HOJA IZQUIERDA)
      // ------------------------------------------------------------------
      {
        pageNumber: 3,
        title: "RESEÑA HISTÓRICA Y EVOLUCIÓN",
        htmlContent: `
          <div class="space-y-3 text-xs leading-relaxed">
            <h2 class="page-title-centered text-lg">Evolución Histórica del MAS</h2>
            
            <p class="text-slate-700">
              El estudio de los sistemas oscilatorios revolucionó la física clásica, permitiendo el desarrollo de relojes de precisión, análisis de estructuras e ingenierías modernas como las enseñadas en la UTP.
            </p>

            <div class="space-y-2">
              <div class="p-2.5 bg-slate-900 text-white rounded-xl border-l-4 border-amber-500 shadow-sm flex gap-3 items-center">
                <div class="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">1602</div>
                <div>
                  <strong class="text-amber-300">Galileo Galilei:</strong> Descubre el <em>isocronismo pendular</em> observando las lámparas de la catedral de Pisa.
                </div>
              </div>

              <div class="p-2.5 bg-slate-900 text-white rounded-xl border-l-4 border-emerald-500 shadow-sm flex gap-3 items-center">
                <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">1660</div>
                <div>
                  <strong class="text-emerald-300">Robert Hooke:</strong> Formula la Ley de Elasticidad $F = -k x$, principio de la fuerza restauradora elástica.
                </div>
              </div>

              <div class="p-2.5 bg-slate-900 text-white rounded-xl border-l-4 border-cyan-500 shadow-sm flex gap-3 items-center">
                <div class="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">1673</div>
                <div>
                  <strong class="text-cyan-300">Christiaan Huygens:</strong> Construye el primer reloj de péndulo y deduce $T = 2\\pi\\sqrt{L/g}$.
                </div>
              </div>

              <div class="p-2.5 bg-slate-900 text-white rounded-xl border-l-4 border-blue-500 shadow-sm flex gap-3 items-center">
                <div class="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0">1739</div>
                <div>
                  <strong class="text-blue-300">Leonhard Euler:</strong> Resuelve la ecuación diferencial ordinaria armónica $\\ddot{x} + \\omega^2 x = 0$.
                </div>
              </div>
            </div>
          </div>
        `
      },

      // ------------------------------------------------------------------
      // PÁGINA 4: MAPA CONCEPTUAL INTERACTIVO (PLIEGO 2 - HOJA DERECHA)
      // ------------------------------------------------------------------
      {
        pageNumber: 4,
        title: "MAPA CONCEPTUAL INTERACTIVO",
        htmlContent: `
          <div class="space-y-3">
            <h2 class="page-title-centered text-lg">Mapa Conceptual Dinámico</h2>
            <p class="text-xs text-slate-600 text-center -mt-2">
              Haz clic en los nodos para desplegar la explicación técnica correspondiente.
            </p>

            <div class="bg-slate-950 p-3 rounded-2xl border border-amber-500/30 text-white space-y-3">
              
              <!-- Core Node -->
              <div class="text-center p-2.5 bg-gradient-to-r from-amber-500 to-emerald-600 rounded-xl font-black text-slate-950 text-xs shadow-md">
                MOVIMIENTO ARMÓNICO SIMPLE (MAS)
              </div>

              <!-- Nodes Grid -->
              <div class="grid grid-cols-2 gap-2 text-[11px]">
                
                <div onclick="showConceptDetails('cinematica')" class="mindmap-node p-2.5 bg-slate-900 border border-blue-500/50 rounded-xl hover:border-blue-400">
                  <div class="font-bold text-blue-400 flex items-center justify-between">
                    <span>1. Cinemática</span>
                    <span class="text-[9px] bg-blue-950 px-1.5 py-0.5 rounded text-blue-300">x, v, a</span>
                  </div>
                  <p class="text-slate-400 text-[10px] mt-1">Ecuaciones armónicas $x(t) = A\\cos(\\omega t + \\phi_0)$.</p>
                </div>

                <div onclick="showConceptDetails('dinamica')" class="mindmap-node p-2.5 bg-slate-900 border border-emerald-500/50 rounded-xl hover:border-emerald-400">
                  <div class="font-bold text-emerald-400 flex items-center justify-between">
                    <span>2. Dinámica</span>
                    <span class="text-[9px] bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-300">Fuerzas</span>
                  </div>
                  <p class="text-slate-400 text-[10px] mt-1">Ley de Hooke y fuerza restauradora $F = -kx$.</p>
                </div>

                <div onclick="showConceptDetails('energia')" class="mindmap-node p-2.5 bg-slate-900 border border-amber-500/50 rounded-xl hover:border-amber-400">
                  <div class="font-bold text-amber-400 flex items-center justify-between">
                    <span>3. Energía</span>
                    <span class="text-[9px] bg-amber-950 px-1.5 py-0.5 rounded text-amber-300">E_total</span>
                  </div>
                  <p class="text-slate-400 text-[10px] mt-1">Conservación de energía $E = \\frac{1}{2}kA^2$.</p>
                </div>

                <div onclick="showConceptDetails('sistemas')" class="mindmap-node p-2.5 bg-slate-900 border border-cyan-500/50 rounded-xl hover:border-cyan-400">
                  <div class="font-bold text-cyan-400 flex items-center justify-between">
                    <span>4. Sistemas</span>
                    <span class="text-[9px] bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-300">Físicos</span>
                  </div>
                  <p class="text-slate-400 text-[10px] mt-1">Masa-resorte, péndulo simple y péndulo físico.</p>
                </div>

              </div>

              <!-- Interactive Display Box -->
              <div id="concept-display-box" class="p-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-slate-200 min-h-[70px] flex items-center justify-center text-center">
                <span class="text-amber-300 font-medium">👈 Haz clic en cualquiera de los nodos del mapa conceptual para examinar sus detalles y ecuaciones asociadas.</span>
              </div>

            </div>
          </div>
        `
      },

      // ------------------------------------------------------------------
      // PÁGINA 5: FUNDAMENTOS Y MAGNITUDES (PLIEGO 3 - HOJA IZQUIERDA)
      // ------------------------------------------------------------------
      {
        pageNumber: 5,
        title: "FUNDAMENTOS Y MAGNITUDES FÍSICAS",
        htmlContent: `
          <div class="space-y-3 text-xs leading-relaxed">
            <h2 class="page-title-centered text-lg">Magnitudes Fundamentales del MAS</h2>

            <div class="grid grid-cols-1 gap-2">
              <div class="p-2.5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                <div class="font-bold text-blue-900 flex justify-between">
                  <span>Elongación ($x$)</span>
                  <span class="text-[10px] font-mono text-blue-700">[m]</span>
                </div>
                <p class="text-slate-600 text-[11px]">Posición instantánea del objeto medida respecto a la posición de equilibrio.</p>
              </div>

              <div class="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm">
                <div class="font-bold text-emerald-900 flex justify-between">
                  <span>Amplitud ($A$)</span>
                  <span class="text-[10px] font-mono text-emerald-700">[m]</span>
                </div>
                <p class="text-slate-600 text-[11px]">Máxima distancia de alejamiento respecto al punto de equilibrio ($A > 0$).</p>
              </div>

              <div class="p-2.5 bg-amber-50 border border-amber-200 rounded-xl shadow-sm">
                <div class="font-bold text-amber-900 flex justify-between">
                  <span>Período ($T$) & Frecuencia ($f$)</span>
                  <span class="text-[10px] font-mono text-amber-700">[s] & [Hz]</span>
                </div>
                <p class="text-slate-600 text-[11px]">$T$ es el tiempo de una oscilación completa. $f = 1/T$ es la cantidad de ciclos por segundo.</p>
              </div>

              <div class="p-2.5 bg-purple-50 border border-purple-200 rounded-xl shadow-sm">
                <div class="font-bold text-purple-900 flex justify-between">
                  <span>Frecuencia Angular ($\\omega$)</span>
                  <span class="text-[10px] font-mono text-purple-700">[rad/s]</span>
                </div>
                <p class="text-slate-600 text-[11px]">Rapidez de variación de la fase circular: $\\omega = 2\\pi f = \\sqrt{k/m}$.</p>
              </div>
            </div>
          </div>
        `
      },

      // ------------------------------------------------------------------
      // PÁGINA 6: DEMOSTRACIÓN ECUACIÓN DIFERENCIAL (PLIEGO 3 - HOJA DERECHA)
      // ------------------------------------------------------------------
      {
        pageNumber: 6,
        title: "DEMOSTRACIÓN DE LA ECUACIÓN DEL MAS",
        htmlContent: `
          <div class="space-y-3 text-xs leading-relaxed">
            <h2 class="page-title-centered text-lg">Deducción de la Ecuación Diferencial</h2>

            <p class="text-slate-700">
              Aplicando la 2ª Ley de Newton a un oscilador elástico unidimensional:
            </p>

            <div class="p-3 bg-slate-950 text-white rounded-xl font-mono text-[11px] space-y-2 border border-slate-800">
              <div>$$\\sum F = m a \\implies -k x = m \\frac{d^2 x}{dt^2}$$</div>
              <div>$$\\frac{d^2 x}{dt^2} + \\left(\\frac{k}{m}\\right) x = 0$$</div>
              
              <div class="p-2 bg-slate-900 rounded border border-amber-500/40 text-amber-300 text-center font-bold">
                $$\\frac{d^2 x}{dt^2} + \\omega^2 x = 0 \\quad \\text{donde } \\omega = \\sqrt{\\frac{k}{m}}$$
              </div>
            </div>

            <p class="text-slate-700">
              Esta <strong>EDO lineal homogénea de 2º orden</strong> admite como solución general la función armónica:
            </p>

            <div class="p-3 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-xl border border-blue-500 text-center font-bold text-sm">
              $$x(t) = A \\cos(\\omega t + \\phi_0)$$
            </div>
          </div>
        `
      },

      // ------------------------------------------------------------------
      // PÁGINA 7: CINEMÁTICA DIFERENCIAL (PLIEGO 4 - HOJA IZQUIERDA)
      // ------------------------------------------------------------------
      {
        pageNumber: 7,
        title: "CINEMÁTICA DIFERENCIAL DEL MAS",
        htmlContent: `
          <div class="space-y-3 text-xs leading-relaxed">
            <h2 class="page-title-centered text-lg">Derivadas Cinemáticas $x, v, a$</h2>

            <div class="p-2.5 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-xl space-y-1">
              <div class="font-bold text-emerald-900">1. Velocidad Instantánea $v(t)$:</div>
              <div>$$v(t) = \\frac{dx}{dt} = -A\\omega \\sin(\\omega t + \\phi_0)$$</div>
              <p class="text-[10px] text-emerald-800">Rapidez máxima en el punto de equilibrio ($x=0$): $v_{\\max} = \\omega A$.</p>
            </div>

            <div class="p-2.5 bg-rose-50 border-l-4 border-rose-600 rounded-r-xl space-y-1">
              <div class="font-bold text-rose-900">2. Aceleración Instantánea $a(t)$:</div>
              <div>$$a(t) = \\frac{dv}{dt} = -A\\omega^2 \\cos(\\omega t + \\phi_0) = -\\omega^2 x(t)$$</div>
              <p class="text-[10px] text-rose-800">Aceleración máxima en los extremos ($x = \\pm A$): $a_{\\max} = \\omega^2 A$.</p>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-[10px] border-collapse bg-white rounded-lg overflow-hidden shadow-sm border">
                <thead class="bg-slate-900 text-amber-300">
                  <tr>
                    <th class="p-1.5 text-left">Estado</th>
                    <th class="p-1.5">Elongación $x$</th>
                    <th class="p-1.5">Velocidad $v$</th>
                    <th class="p-1.5">Aceleración $a$</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 text-center">
                  <tr>
                    <td class="p-1.5 text-left font-bold">Extremo +A</td>
                    <td>$+A$</td>
                    <td class="text-slate-400 font-bold">0</td>
                    <td class="text-rose-600 font-bold">$-\\omega^2 A$</td>
                  </tr>
                  <tr>
                    <td class="p-1.5 text-left font-bold">Equilibrio</td>
                    <td class="text-slate-400 font-bold">0</td>
                    <td class="text-emerald-600 font-bold">$\\pm \\omega A$</td>
                    <td class="text-slate-400 font-bold">0</td>
                  </tr>
                  <tr>
                    <td class="p-1.5 text-left font-bold">Extremo -A</td>
                    <td>$-A$</td>
                    <td class="text-slate-400 font-bold">0</td>
                    <td class="text-rose-600 font-bold">$+\\omega^2 A$</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `
      },

      // ------------------------------------------------------------------
      // PÁGINA 8: PLANO CARTESIANO GEOGEBRA (PLIEGO 4 - HOJA DERECHA)
      // ------------------------------------------------------------------
      {
        pageNumber: 8,
        title: "PLANO CARTESIANO DE FASE GEOGEBRA",
        htmlContent: `
          <div class="space-y-3">
            <h2 class="page-title-centered text-lg">Trazador Cartesiano de Ondas</h2>

            <div class="bg-slate-950 rounded-xl p-3 text-white border border-slate-800 shadow-md">
              <div class="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 text-xs">
                <span class="font-bold text-amber-400">Ondas Armónicas $x(t)$ y $v(t)$:</span>
                <div class="flex gap-2 text-[10px]">
                  <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> x(t)</span>
                  <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> v(t)</span>
                </div>
              </div>

              <!-- Canvas Plotter 2D GeoGebra -->
              <canvas id="geogebra-2d-canvas" class="w-full h-44 bg-slate-900 rounded-lg border border-slate-800 cursor-crosshair"></canvas>

              <div class="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label class="text-slate-300">Amplitud $A$: <span id="label-geo-a" class="text-amber-400 font-bold">1.5</span> m</label>
                  <input type="range" id="slider-geo-a" min="0.5" max="3" step="0.1" value="1.5" class="w-full accent-amber-500">
                </div>
                <div>
                  <label class="text-slate-300">Frecuencia $\\omega$: <span id="label-geo-w" class="text-amber-400 font-bold">2.0</span> rad/s</label>
                  <input type="range" id="slider-geo-w" min="0.5" max="5" step="0.1" value="2.0" class="w-full accent-amber-500">
                </div>
              </div>
            </div>
          </div>
        `
      },

      // ------------------------------------------------------------------
      // PÁGINA 9: LABORATORIO MAS GEOGEBRA (PLIEGO 5 - HOJA IZQUIERDA)
      // ------------------------------------------------------------------
      {
        pageNumber: 9,
        title: "LABORATORIO MAS GEOGEBRA & ENERGÍA",
        htmlContent: `
          <div class="space-y-3">
            <h2 class="page-title-centered text-lg">Laboratorio MAS de Energía</h2>

            <div class="bg-slate-950 rounded-xl p-3 text-white border border-slate-800 shadow-md">
              <div class="text-xs font-bold text-amber-300 mb-2 flex items-center justify-between">
                <span>Oscilador Elástico & Vectores Dinámicos</span>
                <span id="lab-time" class="font-mono text-cyan-400">t = 0.00 s</span>
              </div>

              <canvas id="geogebra-lab-canvas" class="w-full h-40 bg-slate-900 rounded-lg border border-slate-800 mb-3"></canvas>

              <!-- Barras Dinámicas de Energía -->
              <div class="space-y-1.5 text-[10px]">
                <div class="flex items-center gap-2">
                  <span class="w-20 text-emerald-400 font-bold">Cinética $E_k$:</span>
                  <div class="flex-grow h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div id="bar-ek" class="h-full bg-emerald-500 transition-all duration-75" style="width: 50%;"></div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span class="w-20 text-blue-400 font-bold">Potencial $E_p$:</span>
                  <div class="flex-grow h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div id="bar-ep" class="h-full bg-blue-500 transition-all duration-75" style="width: 50%;"></div>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-center gap-2 mt-3">
                <button id="btn-lab-play" class="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded transition">Pausar/Reanudar</button>
                <button id="btn-lab-reset" class="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded transition">Reiniciar</button>
              </div>
            </div>
          </div>
        `
      },

      // ------------------------------------------------------------------
      // PÁGINA 10: SIMULACIÓN TIPO 3D THREE.JS (PLIEGO 5 - HOJA DERECHA)
      // ------------------------------------------------------------------
      {
        pageNumber: 10,
        title: "SIMULACIÓN FÍSICA 3D CON THREE.JS",
        htmlContent: `
          <div class="space-y-3">
            <h2 class="page-title-centered text-lg">Simulador 3D Interactivo WebGL</h2>

            <div class="bg-slate-950 rounded-xl p-3 border border-amber-500/30 shadow-xl text-white">
              <div class="text-xs text-amber-300 font-semibold mb-2 flex items-center justify-between">
                <span>Modelo 3D Resorte-Masa (Three.js)</span>
                <span class="text-[10px] text-slate-400">Arrastra con el mouse para rotar en 3D</span>
              </div>

              <!-- Canvas 3D -->
              <div id="threejs-container" class="w-full h-48 bg-slate-900 rounded-lg overflow-hidden relative border border-slate-800">
                <!-- Three.js renderer -->
              </div>

              <div class="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label class="text-slate-300">Masa $m$: <span id="label-3d-m" class="text-amber-400 font-bold">1.0</span> kg</label>
                  <input type="range" id="slider-3d-m" min="0.2" max="3" step="0.1" value="1.0" class="w-full accent-amber-500">
                </div>
                <div>
                  <label class="text-slate-300">Constante $k$: <span id="label-3d-k" class="text-amber-400 font-bold">25</span> N/m</label>
                  <input type="range" id="slider-3d-k" min="5" max="80" step="5" value="25" class="w-full accent-amber-500">
                </div>
              </div>
            </div>
          </div>
        `
      },

      // ------------------------------------------------------------------
      // PÁGINA 11: TALLER RESUELTO CON CALCULADORA 1 (PLIEGO 6 - HOJA IZQUIERDA)
      // ------------------------------------------------------------------
      {
        pageNumber: 11,
        title: "TALLER CON CALCULADORA INTERACTIVA",
        htmlContent: `
          <div class="space-y-3 text-xs leading-relaxed">
            <h2 class="page-title-centered text-lg">Ejercicio Modelo 1 & Calculadora</h2>

            <div class="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
              <strong>Enunciado:</strong> Un bloque de masa $m = 0.5\\text{ kg}$ sujeto a un resorte de constante $k = 200\\text{ N/m}$ se desplaza $A = 0.08\\text{ m}$. Halle $\\omega$, $T$, $v_{\\max}$ y $E$.
            </div>

            <!-- Calculadora Interactiva de Ejercicio -->
            <div class="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2">
              <div class="font-bold text-amber-300 text-[11px] border-b border-slate-800 pb-1">
                Calculadora Numérica de Parámetros MAS:
              </div>

              <div class="grid grid-cols-3 gap-2 text-[10px]">
                <div>
                  <label class="text-slate-400">m [kg]:</label>
                  <input type="number" id="calc-m" value="0.5" step="0.1" class="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-amber-300 font-bold">
                </div>
                <div>
                  <label class="text-slate-400">k [N/m]:</label>
                  <input type="number" id="calc-k" value="200" step="10" class="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-amber-300 font-bold">
                </div>
                <div>
                  <label class="text-slate-400">A [m]:</label>
                  <input type="number" id="calc-a" value="0.08" step="0.01" class="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-amber-300 font-bold">
                </div>
              </div>

              <div id="calc-results-output" class="p-2 bg-slate-950 rounded border border-amber-500/30 text-emerald-400 font-mono text-[11px] space-y-0.5">
                <!-- Dynamic calculation results -->
              </div>
            </div>
          </div>
        `
      },

      // ------------------------------------------------------------------
      // PÁGINA 12: EJERCICIO RESUELTO 2 (PLIEGO 6 - HOJA DERECHA)
      // ------------------------------------------------------------------
      {
        pageNumber: 12,
        title: "TALLER DE EJERCICIOS RESUELTOS - PARTE 2",
        htmlContent: `
          <div class="space-y-3 text-xs leading-relaxed">
            <h2 class="page-title-centered text-lg">Ejercicio Modelo 2: Fase Inicial</h2>

            <div class="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
              <strong class="text-amber-900">Enunciado:</strong> Un oscilador con $\\omega = 10\\text{ rad/s}$ inicia en $t=0$ con $x_0 = 0.05\\text{ m}$ y $v_0 = -0.40\\text{ m/s}$. Calcule $A$ y $\\phi_0$.
            </div>

            <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
              <div>
                <span class="data-text">Protocolo Cromático - Datos (Azul):</span>
                <p class="text-slate-600">$x_0 = 0.05\\text{ m}$, $v_0 = -0.40\\text{ m/s}$, $\\omega = 10\\text{ rad/s}$.</p>
              </div>

              <div>
                <span class="solved-text">Resolución (Naranja):</span>
                <div class="bg-amber-50 p-2 rounded-lg space-y-1 font-mono text-[11px] border border-amber-200">
                  <div>$$A = \\sqrt{x_0^2 + \\left(\\frac{v_0}{\\omega}\\right)^2} = \\sqrt{(0.05)^2 + (-0.04)^2} = \\mathbf{0.064\\text{ m}}$$</div>
                  <div>$$\\tan \\phi_0 = -\\frac{v_0}{\\omega x_0} = \\frac{0.40}{10(0.05)} = 0.80 \\implies \\phi_0 = \\mathbf{0.675\\text{ rad}}$$</div>
                </div>
              </div>
            </div>
          </div>
        `
      },

      // ------------------------------------------------------------------
      // PÁGINA 13: QUIZ INTERACTIVO Y GLOSARIO (PLIEGO 7 - HOJA IZQUIERDA)
      // ------------------------------------------------------------------
      {
        pageNumber: 13,
        title: "QUIZ INTERACTIVO Y GLOSARIO",
        htmlContent: `
          <div class="space-y-3 text-xs leading-relaxed">
            <h2 class="page-title-centered text-lg">Quiz Interactivo de Comprobación</h2>

            <div class="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2">
              <div class="font-bold text-amber-300 text-xs">Pregunta de Comprobación Rápida:</div>
              <p class="text-slate-300 text-[11px]">¿En qué posición alcanza un oscilador armónico su velocidad máxima?</p>

              <div class="space-y-1.5 text-[11px]">
                <button onclick="checkQuizAnswer(1)" class="w-full text-left p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition">A) En la posición de máxima elongación $x = A$</button>
                <button onclick="checkQuizAnswer(2)" class="w-full text-left p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition">B) En el punto de equilibrio central $x = 0$</button>
                <button onclick="checkQuizAnswer(3)" class="w-full text-left p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition">C) En la posición de aceleración máxima $x = -A$</button>
              </div>

              <div id="quiz-feedback" class="p-2 rounded text-center font-bold text-[11px] hidden"></div>
            </div>

            <div class="p-2.5 bg-slate-100 rounded-xl border border-slate-200">
              <span class="font-bold text-slate-800 border-b border-slate-300 pb-0.5 block mb-1">Glosario Expres:</span>
              <ul class="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                <li><strong>Isocronismo:</strong> Propiedad donde el período no depende de la amplitud.</li>
                <li><strong>Fase Inicial ($\\phi_0$):</strong> Estado angular inicial del movimiento en $t=0$.</li>
              </ul>
            </div>
          </div>
        `
      },

      // ------------------------------------------------------------------
      // PÁGINA 14: REFERENCIAS Y CRÉDITOS APA 7 (PLIEGO 7 - HOJA DERECHA)
      // ------------------------------------------------------------------
      {
        pageNumber: 14,
        title: "REFERENCIAS APA 7 Y CRÉDITOS UTP",
        htmlContent: `
          <div class="space-y-3 text-xs leading-relaxed">
            <h2 class="page-title-centered text-lg">Referencias Bibliográficas (APA 7)</h2>

            <div class="space-y-2 text-slate-700">
              <div class="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                <strong>Serway, R. A., & Jewett, J. W. (2018).</strong> <em>Física para ciencias e ingeniería</em> (10.ª ed., Vol. 1). Cengage Learning.
              </div>

              <div class="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                <strong>Sears, F. W., & Zemansky, M. W. (2016).</strong> <em>Física universitaria</em> (14.ª ed., Vol. 1). Pearson Educación.
              </div>

              <div class="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                <strong>Halliday, D., Resnick, R., & Walker, J. (2014).</strong> <em>Fundamentals of Physics</em> (10th ed.). John Wiley & Sons.
              </div>
            </div>

            <div class="mt-4 p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl text-center space-y-1 shadow-lg border border-amber-500/40">
              <div class="font-black text-amber-400 text-xs tracking-wider uppercase">UNIVERSIDAD TECNOLÓGICA DE PEREIRA</div>
              <div class="text-[11px] text-slate-200 font-medium">
                Cuaderno Virtual de Física III &bull; 2026
              </div>
              <div class="text-[10px] text-amber-200 pt-1 border-t border-slate-800">
                Esley Bolaños Bolaños &bull; Ximena León Rojas &bull; Ángela Johana Morales Osorio
              </div>
            </div>
          </div>
        `
      }

    ];

    /* ====================================================================
       ESTADO GLOBAL Y CONTROL DE NAVEGACIÓN
       ==================================================================== */
    let currentSpreadIndex = 0;
    const totalSpreads = Math.ceil(notebookPages.length / 2);

    const pageLeftContainer = document.getElementById('page-left-content');
    const pageRightContainer = document.getElementById('page-right-content');
    const bookSpreadElement = document.getElementById('book-spread');
    const spreadIndicator = document.getElementById('spread-indicator');
    const spreadDotsContainer = document.getElementById('spread-dots-container');
    const btnPrev = document.getElementById('btn-prev-spread');
    const btnNext = document.getElementById('btn-next-spread');

    window.onload = function() {
      renderSpreadDots();
      loadSpread(0);

      btnPrev.addEventListener('click', () => {
        if (currentSpreadIndex > 0) {
          bookSpreadElement.classList.add('page-turn-anim-prev');
          setTimeout(() => {
            currentSpreadIndex--;
            loadSpread(currentSpreadIndex);
            bookSpreadElement.classList.remove('page-turn-anim-prev');
          }, 300);
        }
      });

      btnNext.addEventListener('click', () => {
        if (currentSpreadIndex < totalSpreads - 1) {
          bookSpreadElement.classList.add('page-turn-anim-next');
          setTimeout(() => {
            currentSpreadIndex++;
            loadSpread(currentSpreadIndex);
            bookSpreadElement.classList.remove('page-turn-anim-next');
          }, 300);
        }
      });

      document.getElementById('btn-fullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => console.log(err));
        } else {
          document.exitFullscreen();
        }
      });
    };

    function renderSpreadDots() {
      spreadDotsContainer.innerHTML = '';
      for (let i = 0; i < totalSpreads; i++) {
        const dot = document.createElement('button');
        dot.className = `w-2.5 h-2.5 rounded-full transition-all ${i === currentSpreadIndex ? 'bg-amber-400 w-6' : 'bg-slate-700 hover:bg-slate-500'}`;
        dot.title = `Pliego ${i + 1} (Págs ${i * 2 + 1}-${i * 2 + 2})`;
        dot.onclick = () => goToSpread(i + 1);
        spreadDotsContainer.appendChild(dot);
      }
    }

    function goToSpread(spreadNumOneBased) {
      currentSpreadIndex = spreadNumOneBased - 1;
      loadSpread(currentSpreadIndex);
    }

    function loadSpread(index) {
      const leftPageIndex = index * 2;
      const rightPageIndex = index * 2 + 1;

      const leftPageData = notebookPages[leftPageIndex];
      const rightPageData = notebookPages[rightPageIndex];

      // Apply notebook background to interior pages
      if (leftPageIndex > 0) {
        pageLeftContainer.classList.add('interior-page-template');
        pageRightContainer.classList.add('interior-page-template');
      } else {
        pageLeftContainer.classList.remove('interior-page-template');
        pageRightContainer.classList.remove('interior-page-template');
      }

      pageLeftContainer.innerHTML = leftPageData ? leftPageData.htmlContent : '';
      pageRightContainer.innerHTML = rightPageData ? rightPageData.htmlContent : '';

      spreadIndicator.textContent = `Páginas ${leftPageIndex + 1} y ${rightPageIndex + 1} de 14`;
      renderSpreadDots();

      btnPrev.disabled = index === 0;
      btnNext.disabled = index === totalSpreads - 1;
      btnPrev.style.opacity = index === 0 ? '0.4' : '1';
      btnNext.style.opacity = index === totalSpreads - 1 ? '0.4' : '1';

      if (window.renderMathInElement) {
        renderMathInElement(document.body, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
          ]
        });
      }

      setTimeout(() => {
        if (document.getElementById('geogebra-2d-canvas')) initGeoGebra2D();
        if (document.getElementById('geogebra-lab-canvas')) initGeoGebraLab();
        if (document.getElementById('threejs-container')) initThreeJS3D();
        if (document.getElementById('calc-m')) initCalculator();
      }, 100);
    }

    /* ====================================================================
       INTERACTIVE CONCEPT MAP DISCLOSURE
       ==================================================================== */
    function showConceptDetails(conceptKey) {
      const displayBox = document.getElementById('concept-display-box');
      if (!displayBox) return;

      const details = {
        cinematica: "<strong>Cinemática:</strong> Posición $x(t) = A\\cos(\\omega t + \\phi_0)$, Velocidad $v(t) = -A\\omega\\sin(\\omega t + \\phi_0)$, Aceleración $a(t) = -A\\omega^2\\cos(\\omega t + \\phi_0)$.",
        dinamica: "<strong>Dinámica:</strong> Basada en la fuerza restauradora lineal elástica de la Ley de Hooke $F = -kx$. La aceleración es proporcional y opuesta a la elongación: $a = -\\omega^2 x$.",
        energia: "<strong>Energía:</strong> Conservación mecánica total $E = E_k + E_p = \\frac{1}{2}m v^2 + \\frac{1}{2}k x^2 = \\frac{1}{2}k A^2$.",
        sistemas: "<strong>Sistemas Físicos:</strong> Sistema Masa-Resorte ($\\omega = \\sqrt{k/m}$), Péndulo Simple ($\\omega = \\sqrt{g/L}$), Péndulo Físico ($\\omega = \\sqrt{m g d / I}$)."
      };

      displayBox.innerHTML = details[conceptKey] || details.cinematica;
      if (window.renderMathInElement) {
        renderMathInElement(displayBox, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
          ]
        });
      }
    }

    /* ====================================================================
       PLANO CARTESIANO GEOGEBRA (PÁGINA 8)
       ==================================================================== */
    function initGeoGebra2D() {
      const canvas = document.getElementById('geogebra-2d-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      const sliderA = document.getElementById('slider-geo-a');
      const sliderW = document.getElementById('slider-geo-w');
      const labelA = document.getElementById('label-geo-a');
      const labelW = document.getElementById('label-geo-w');

      function draw() {
        if (!ctx) return;
        const A = parseFloat(sliderA.value);
        const w = parseFloat(sliderW.value);
        labelA.textContent = A.toFixed(1);
        labelW.textContent = w.toFixed(1);

        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;

        ctx.clearRect(0, 0, width, height);

        // Grid Milimetrado
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 20) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        for (let y = 0; y < height; y += 20) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // Axis
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); ctx.stroke();

        // Wave x(t) - Blue
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let px = 0; px < width; px++) {
          const t = px * 0.02;
          const x = A * Math.cos(w * t);
          const py = centerY - x * 25;
          if (px === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Wave v(t) - Emerald
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let px = 0; px < width; px++) {
          const t = px * 0.02;
          const v = -A * w * Math.sin(w * t);
          const py = centerY - v * 8;
          if (px === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      sliderA.oninput = draw;
      sliderW.oninput = draw;
      draw();
    }

    /* ====================================================================
       LABORATORIO MAS GEOGEBRA (PÁGINA 9)
       ==================================================================== */
    let labAnimId = null;
    function initGeoGebraLab() {
      const canvas = document.getElementById('geogebra-lab-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      let t = 0;
      let isRunning = true;
      const A = 1.5;
      const w = 2.5;
      const k = 25;
      const m = 1.0;

      const btnPlay = document.getElementById('btn-lab-play');
      const btnReset = document.getElementById('btn-lab-reset');
      const labTime = document.getElementById('lab-time');
      const barEk = document.getElementById('bar-ek');
      const barEp = document.getElementById('bar-ep');

      if (btnPlay) btnPlay.onclick = () => { isRunning = !isRunning; };
      if (btnReset) btnReset.onclick = () => { t = 0; };

      function animate() {
        if (!ctx) return;
        if (isRunning) t += 0.02;

        if (labTime) labTime.textContent = `t = ${t.toFixed(2)} s`;

        const x = A * Math.cos(w * t);
        const v = -A * w * Math.sin(w * t);

        const Ek = 0.5 * m * v * v;
        const Ep = 0.5 * k * x * x;
        const Etotal = Ek + Ep;

        if (barEk) barEk.style.width = `${(Ek / Etotal) * 100}%`;
        if (barEp) barEp.style.width = `${(Ep / Etotal) * 100}%`;

        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;
        const blockX = width / 2 + x * 40;

        ctx.clearRect(0, 0, width, height);

        // Ground
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(20, centerY + 25); ctx.lineTo(width - 20, centerY + 25); ctx.stroke();

        // Spring
        ctx.strokeStyle = '#fdb913';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(30, centerY);
        const coils = 14;
        const dx = (blockX - 30) / coils;
        for (let i = 0; i < coils; i++) {
          const coilY = centerY + (i % 2 === 0 ? -12 : 12);
          ctx.lineTo(30 + i * dx, coilY);
        }
        ctx.lineTo(blockX, centerY);
        ctx.stroke();

        // Block
        ctx.fillStyle = '#006837';
        ctx.fillRect(blockX, centerY - 20, 35, 40);
        ctx.strokeStyle = '#10b981';
        ctx.strokeRect(blockX, centerY - 20, 35, 40);

        if (document.getElementById('geogebra-lab-canvas')) {
          labAnimId = requestAnimationFrame(animate);
        }
      }

      if (labAnimId) cancelAnimationFrame(labAnimId);
      animate();
    }

    /* ====================================================================
       SIMULACIÓN FÍSICA 3D CON THREE.JS (PÁGINA 10)
       ==================================================================== */
    function initThreeJS3D() {
      const container = document.getElementById('threejs-container');
      if (!container || container.children.length > 0) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0f172a);

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 4, 8);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xfdb913, 1);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);

      const grid = new THREE.GridHelper(10, 10, 0x006837, 0x334155);
      grid.position.y = -1;
      scene.add(grid);

      const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const material = new THREE.MeshStandardMaterial({ color: 0x006837, roughness: 0.3, metalness: 0.8 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.y = -0.4;
      scene.add(cube);

      const sliderM = document.getElementById('slider-3d-m');
      const sliderK = document.getElementById('slider-3d-k');
      const labelM = document.getElementById('label-3d-m');
      const labelK = document.getElementById('label-3d-k');

      let clock = new THREE.Clock();

      function animate3D() {
        requestAnimationFrame(animate3D);

        const m = parseFloat(sliderM.value);
        const k = parseFloat(sliderK.value);
        labelM.textContent = m.toFixed(1);
        labelK.textContent = k.toFixed(0);

        const w = Math.sqrt(k / m);
        const time = clock.getElapsedTime();

        cube.position.x = 2.0 * Math.cos(w * time);

        controls.update();
        renderer.render(scene, camera);
      }

      animate3D();
    }

    /* ====================================================================
       INTERACTIVE CALCULATOR (PÁGINA 11)
       ==================================================================== */
    function initCalculator() {
      const inputM = document.getElementById('calc-m');
      const inputK = document.getElementById('calc-k');
      const inputA = document.getElementById('calc-a');
      const output = document.getElementById('calc-results-output');

      if (!inputM || !inputK || !inputA || !output) return;

      function calculate() {
        const m = parseFloat(inputM.value) || 1;
        const k = parseFloat(inputK.value) || 1;
        const A = parseFloat(inputA.value) || 0.1;

        const w = Math.sqrt(k / m);
        const T = (2 * Math.PI) / w;
        const vmax = w * A;
        const E = 0.5 * k * A * A;

        output.innerHTML = `
          <div>&bull; Frecuencia Angular (\\omega): <strong>${w.toFixed(2)} rad/s</strong></div>
          <div>&bull; Período de Oscilación (T): <strong>${T.toFixed(3)} s</strong></div>
          <div>&bull; Velocidad Máxima (v_max): <strong>${vmax.toFixed(3)} m/s</strong></div>
          <div>&bull; Energía Mecánica Total (E): <strong>${E.toFixed(4)} J</strong></div>
        `;
      }

      inputM.oninput = calculate;
      inputK.oninput = calculate;
      inputA.oninput = calculate;
      calculate();
    }

    /* ====================================================================
       QUIZ CHECKER (PÁGINA 13)
       ==================================================================== */
    function checkQuizAnswer(selectedOption) {
      const feedback = document.getElementById('quiz-feedback');
      if (!feedback) return;
      
      feedback.classList.remove('hidden', 'bg-emerald-900', 'text-emerald-300', 'bg-rose-900', 'text-rose-300');

      if (selectedOption === 2) {
        feedback.classList.add('bg-emerald-900', 'text-emerald-300');
        feedback.textContent = '¡Correcto! 🎉 La velocidad es máxima cuando x = 0, donde toda la energía es cinética (E_p = 0).';
      } else {
        feedback.classList.add('bg-rose-900', 'text-rose-300');
        feedback.textContent = 'Incorrecto ❌. Recuerda que en los extremos x = ±A la velocidad es 0 y la aceleración es máxima.';
      }
    }
  </script>
</body>
</html>
const CACHE_NAME = 'fisica3-notebook-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/variables.css',
  './css/notebook.css',
  './css/geogebra.css',
  './css/simulations.css',
  './css/components.css',
  './js/app.js',
  './js/geogebra-engine.js',
  './js/simulations.js',
  './js/problems.js',
  './js/mindmap.js',
  './js/timeline.js',
  './js/glossary.js',
  './imagenes/Portada.webp',
  './imagenes/Plantilla_contenido.webp',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});

{
  "name": "Cuaderno Interactivo Virtual: Física 3 - Movimiento Oscilatorio y MAS",
  "short_name": "Física 3: MAS",
  "description": "Cuaderno Interactivo Virtual SPA / PWA con simulaciones físicas, plano cartesiano estilo GeoGebra y ejercicios resueltos paso a paso.",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#12101a",
  "theme_color": "#7c3aed",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "imagenes/Portada.webp",
      "sizes": "512x512",
      "type": "image/webp"
    }
  ]
}
