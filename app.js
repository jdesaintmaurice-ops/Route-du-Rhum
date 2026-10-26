(function () {
  let n = 0;
  const HORIZON = 60;
  const PAL = {
    "Ultim": { sky: ["#3E6FC8", "#8FB6EE", "#FBD9B0"], sea: ["#1F5AA8", "#0A2A62"], sun: "#FFF0C0" },
    "Ocean Fifty": { sky: ["#2F7FE0", "#8CC4FF", "#FFE6C0"], sea: ["#1E6FC0", "#0B3A80"], sun: "#FFF4CC" },
    "IMOCA": { sky: ["#3A5FC8", "#86A8EE", "#FFD9B8"], sea: ["#1D54B0", "#0A2468"], sun: "#FFEFC0" },
    "Vintage Multi": { sky: ["#2AA7C0", "#8FDCE4", "#FFEBC8"], sea: ["#17899E", "#08485A"], sun: "#FFF4D0" },
    "Vintage Mono": { sky: ["#6A7FB8", "#E7B98C", "#FFE2B8"], sea: ["#2A5890", "#10305A"], sun: "#FFEBB8" }
  };
  function backdrop(id, p) {
    return `<defs>
      <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset=".6" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[2]}"/></linearGradient>
      <linearGradient id="${id}sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sea[0]}"/><stop offset="1" stop-color="${p.sea[1]}"/></linearGradient>
      <radialGradient id="${id}sun"><stop offset="0" stop-color="${p.sun}" stop-opacity="1"/><stop offset=".25" stop-color="${p.sun}" stop-opacity=".55"/><stop offset="1" stop-color="${p.sun}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}sail" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#E9EEF8"/><stop offset="1" stop-color="#B9C6E0"/></linearGradient>
      <linearGradient id="${id}sail2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#EEF2FA"/><stop offset="1" stop-color="#C6D2EA"/></linearGradient>
      <linearGradient id="${id}hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2C2A66"/><stop offset=".45" stop-color="#17124A"/><stop offset="1" stop-color="#0B0830"/></linearGradient>
      <linearGradient id="${id}wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8683A"/><stop offset="1" stop-color="#5E3517"/></linearGradient>
      <linearGradient id="${id}cream" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D8D2C2"/></linearGradient>
      <filter id="${id}b" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
      <filter id="${id}b2"><feGaussianBlur stdDeviation=".7"/></filter>
      <clipPath id="${id}clip"><rect y="${HORIZON}" width="120" height="${100 - HORIZON}"/></clipPath>
    </defs>
    <rect width="120" height="100" fill="url(#${id}sky)"/>
    <circle cx="92" cy="${HORIZON - 14}" r="30" fill="url(#${id}sun)"/>
    <g filter="url(#${id}b)" fill="#fff" opacity=".55"><ellipse cx="26" cy="16" rx="20" ry="3.4"/><ellipse cx="40" cy="20" rx="14" ry="2.4"/><ellipse cx="98" cy="10" rx="16" ry="2.8"/></g>
    <path d="M0 ${HORIZON} H120" stroke="#fff" stroke-opacity=".5" stroke-width=".6"/>
    <rect y="${HORIZON}" width="120" height="${100 - HORIZON}" fill="url(#${id}sea)"/>
    <path d="M86 ${HORIZON + 1} L96 ${HORIZON + 1} L104 100 L80 100Z" fill="${p.sun}" opacity=".16"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${(i * 23) % 40 - 6} ${HORIZON + 5 + i * 6.5} q5 -2 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0" stroke="#fff" stroke-opacity="${(.1 + i * .02).toFixed(2)}" stroke-width="${(.5 + i * .12).toFixed(2)}" fill="none"/>`).join("")}`;
  }
  const seams = (pts, w) => pts.map((p) => `<path d="${p}" stroke="#7A8CB4" stroke-opacity=".22" stroke-width="${w || .35}" fill="none"/>`).join("");
  function front(id, y, op) {
    return `<path d="M0 ${y} q5 -3.2 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 V100 H0Z" fill="#0A2468" fill-opacity="${op}"/>`;
  }
  function foam(x, y, w) {
    let s = "";
    for (let i = 0; i < 9; i++) s += `<circle cx="${(x + (i * 7.3) % w).toFixed(1)}" cy="${(y + ((i * 3.7) % 3)).toFixed(1)}" r="${(0.7 + (i % 3) * 0.5).toFixed(1)}" fill="#fff" opacity="${(.5 + (i % 3) * .15).toFixed(2)}"/>`;
    return `<path d="M${x - 2} ${y + 1} q${w / 4} -3 ${w / 2} 0 t${w / 2} 0" stroke="#fff" stroke-width="1.6" fill="none" opacity=".75" stroke-linecap="round"/>` + s;
  }
  function reflect(id, boatId, yWater) {
    return `<g clip-path="url(#${id}clip)" opacity=".28"><use href="#${boatId}" transform="translate(0 ${2 * yWater}) scale(1 -1)" filter="url(#${id}b2)"/></g>`;
  }

  // ======== Vue 3/4 avant, silhouettes inspirées de l'infographie des classes ========
  const f1 = (x) => Math.round(x * 10) / 10;
  const P = (S, B, t, dx, dy) => [S[0] + (B[0] - S[0]) * t + (dx || 0), S[1] + (B[1] - S[1]) * t + (dy || 0)];
  const pts = (a) => a.map((p) => f1(p[0]) + " " + f1(p[1])).join(" L");
  // Coque vue de 3/4 : bord (livet) de la poupe à l'étrave, flanc visible et pont
  function hull(id, S, B, H, Wd, fill, stripe, opt) {
    opt = opt || {};
    const N = 14, top = [], bot = [], deckEdge = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, s = 0.72 + 0.62 * t;
      const sheer = -Math.sin(Math.PI * t) * (opt.sheer || 0.8);
      const p = P(S, B, t, 0, sheer);
      top.push(p);
      bot.push([p[0] + (opt.drift || 0) * t, p[1] + H * s * (1 - Math.pow(t, 2.6) * 0.96) * (1 + (opt.belly || 0) * Math.sin(Math.PI * t))]);
      deckEdge.push([p[0] + 3.2 * s * (1 - t), p[1] - Wd * s * (1 - Math.pow(t, 1.8) * 0.97)]);
    }
    const side = `M${pts(top)} L${pts(bot.slice().reverse())}Z`;
    const deck = `M${pts(top)} L${pts(deckEdge.slice().reverse())}Z`;
    const stripePath = `M${pts(top.map((p, i) => [p[0], p[1] + (bot[i][1] - p[1]) * 0.24]))}`;
    const hl = `M${pts(top.map((p, i) => [p[0], p[1] + (bot[i][1] - p[1]) * 0.08]).slice(2, N - 1))}`;
    return `<path d="${side}" fill="${fill}"/>
      <path d="${side}" fill="url(#${id}shade)"/>
      <path d="${deck}" fill="${opt.deck || "#8E9AC0"}"/>
      <path d="M${pts(deckEdge.slice(1, N - 2))}" stroke="#fff" stroke-opacity=".35" stroke-width=".7" fill="none"/>
      <path d="${stripePath}" stroke="${stripe}" stroke-width="${opt.sw || 1.8}" fill="none" stroke-linecap="round"/>
      <path d="${hl}" stroke="#fff" stroke-opacity=".3" stroke-width=".6" fill="none"/>`;
  }
  const bits = (id) => `<linearGradient id="${id}shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>`;
  function sailBattens(poly, n, c0, c1) {
    // lignes de lattes entre deux bords du chant (c0 -> c1)
    let s = "";
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1);
      s += `<path d="M${f1(c0[0] + (poly.luff[0] - c0[0]) * 0)} 0" stroke="none"/>`;
    }
    return s;
  }
  function mainsail(id, mast, head, clew, roach, c, battens, band) {
    // grand-voile : mât -> tête -> point d'écoute (chute arrondie)
    const tack = [mast[0], mast[1]];
    const mid = [(head[0] + clew[0]) / 2 - roach, (head[1] + clew[1]) / 2];
    let d = `M${head[0]} ${head[1]} Q${f1(mid[0])} ${f1(mid[1])} ${clew[0]} ${clew[1]} L${tack[0]} ${tack[1]}Z`;
    let b = "";
    for (let i = 1; i <= battens; i++) {
      const t = i / (battens + 1);
      const lx = tack[0], ly = head[1] + (tack[1] - head[1]) * t;
      // point sur la chute à la même hauteur (interpolation sur la courbe quadratique)
      const u = 1 - Math.sqrt(1 - Math.min(0.999, t)) ;
      const tt = t; // approx
      const cx = (1 - tt) * (1 - tt) * head[0] + 2 * (1 - tt) * tt * mid[0] + tt * tt * clew[0];
      const cy = (1 - tt) * (1 - tt) * head[1] + 2 * (1 - tt) * tt * mid[1] + tt * tt * clew[1];
      b += `<path d="M${tack[0]} ${f1(head[1] + (clew[1] - head[1]) * tt)} L${f1(cx)} ${f1(cy)}" stroke="#6F83B3" stroke-opacity=".28" stroke-width=".45"/>`;
    }
    const bandTop = band ? `<path d="M${head[0]} ${head[1]} Q${f1(mid[0] + (clew[0] - mid[0]) * 0)} ${f1(mid[1])} ${clew[0]} ${clew[1]} L${tack[0]} ${tack[1]}Z" fill="none"/>` : "";
    return `<path d="${d}" fill="url(#${id}sail2)"/>${b}
      <path d="M${head[0]} ${head[1]} Q${f1(mid[0])} ${f1(mid[1])} ${clew[0]} ${clew[1]}" stroke="#fff" stroke-width=".7" fill="none"/>
      <path d="M${head[0]} ${head[1]} Q${f1(mid[0])} ${f1(mid[1])} ${clew[0]} ${clew[1]}" stroke="${c}" stroke-width="1.3" fill="none" stroke-dasharray="6 3" opacity=".9"/>`;
  }
  function jib(id, head, tack, clew, belly, c, seams) {
    const mx = (head[0] + tack[0]) / 2 + belly, my = (head[1] + tack[1]) / 2;
    const d = `M${head[0]} ${head[1]} Q${f1(mx)} ${f1(my)} ${tack[0]} ${tack[1]} L${clew[0]} ${clew[1]}Z`;
    let s = "";
    for (let i = 1; i <= seams; i++) {
      const t = i / (seams + 1);
      const lx = (1 - t) * (1 - t) * head[0] + 2 * (1 - t) * t * mx + t * t * tack[0];
      const ly = (1 - t) * (1 - t) * head[1] + 2 * (1 - t) * t * my + t * t * tack[1];
      s += `<path d="M${f1(lx)} ${f1(ly)} L${f1(clew[0] + (head[0] - clew[0]) * (1 - t) * .15)} ${f1(clew[1] + (head[1] - clew[1]) * (1 - t) * .8)}" stroke="#6F83B3" stroke-opacity=".25" stroke-width=".45"/>`;
    }
    return `<path d="${d}" fill="url(#${id}sail)"/>${s}
      <path d="M${head[0]} ${head[1]} Q${f1(mx)} ${f1(my)} ${tack[0]} ${tack[1]}" stroke="${c}" stroke-width="1.5" fill="none" opacity=".95"/>
      <path d="M${head[0]} ${head[1]} L${clew[0]} ${clew[1]} L${tack[0]} ${tack[1]}" stroke="#fff" stroke-opacity=".6" stroke-width=".5" fill="none"/>`;
  }
  const mastLine = (a, b) => `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#2A2F55" stroke-width="2.3" stroke-linecap="round"/><path d="M${a[0] - .5} ${a[1]} L${b[0] - .5} ${b[1]}" stroke="#E6ECFB" stroke-width=".8" stroke-linecap="round"/>`;
  const wire = (a, b, o) => `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]}" stroke="#CDD7F0" stroke-width=".45" opacity="${o || .85}"/>`;
  const spray = (x, y, w) => foam(x, y, w);

  // ---------- ULTIM : maxi-trimaran, immense grand-voile à lattes, volant ----------
  function ultim(c, id) {
    const S = [18, 62], B = [100, 76];
    const mastB = P(S, B, 0.5, 4, -6), head = [mastB[0] - 2, 3];
    const boat = `
      ${hull(id, [22, 70], [88, 83], 6, 2.2, "#1C1A58", c, { sw: 1.4 })}
      ${hull(id, [36, 56], [108, 66], 4.5, 1.8, "#2A2A70", c, { sw: 1.2 })}
      <path d="M44 66 L56 74 M70 70 L84 80 M34 63 L50 61 M80 62 L96 62" stroke="#0E0A32" stroke-width="1.5" stroke-linecap="round" opacity=".9"/>
      <path d="M62 80 L60 88 L66 93 L72 90 L67 82Z" fill="#DDE6FA"/>
      ${hull(id, S, B, 9, 3.2, "url(#" + id + "hull)", c, { sw: 2, sheer: 1.2 })}
      <path d="M40 60 Q52 54 64 57 L68 61Z" fill="#2B3478"/><path d="M44 59 Q52 56 62 58" stroke="#A9BCF4" stroke-width="1" fill="none"/>
      ${mastLine(mastB, head)}
      ${mainsail(id, [mastB[0] - 1, mastB[1] - 1], [head[0] - 1, head[1] + 2], [14, 64], 6, c, 7)}
      ${jib(id, [head[0] + 1, head[1] + 4], [96, 73], [64, 66], 14, c, 4)}
      ${wire([head[0], head[1]], B, .7)}${wire([head[0], head[1]], S, .55)}`;
    return backdrop(id, PAL["Ultim"]).replace("</defs>", bits(id) + "</defs>") +
      `<g id="${id}boat">${boat}</g>` + reflect(id, id + "boat", 72) + spray(56, 90, 18) + spray(8, 80, 14) + front(id, 92, .45);
  }
  // ---------- OCEAN FIFTY : trimaran de 15 m, mât plus court ----------
  function fifty(c, id) {
    const S = [24, 66], B = [98, 79];
    const mastB = P(S, B, 0.5, 3, -5), head = [mastB[0] - 3, 14];
    const boat = `
      ${hull(id, [26, 73], [86, 84], 5.5, 2, "#1C1A58", c, { sw: 1.3 })}
      ${hull(id, [40, 60], [104, 68], 4, 1.6, "#2A2A70", c, { sw: 1.1 })}
      <path d="M44 68 L54 76 M70 72 L82 81 M40 64 L54 63 M80 64 L94 64" stroke="#0E0A32" stroke-width="1.4" stroke-linecap="round"/>
      ${hull(id, S, B, 8, 3, "url(#" + id + "hull)", c, { sw: 1.8 })}
      <path d="M44 63 Q54 58 66 60 L70 64Z" fill="#2B3478"/>
      ${mastLine(mastB, head)}
      ${mainsail(id, [mastB[0] - 1, mastB[1] - 1], [head[0] - 1, head[1] + 2], [22, 68], 4, c, 5)}
      ${jib(id, [head[0] + 1, head[1] + 4], [95, 76], [62, 69], 10, c, 3)}
      ${wire([head[0], head[1]], B, .7)}${wire([head[0], head[1]], S, .55)}`;
    return backdrop(id, PAL["Ocean Fifty"]).replace("</defs>", bits(id) + "</defs>") +
      `<g id="${id}boat">${boat}</g>` + reflect(id, id + "boat", 76) + spray(16, 86, 22) + spray(66, 90, 16) + front(id, 92, .45);
  }
  // ---------- IMOCA : monocoque fin, foils en C, mât haubané ----------
  function imoca(c, id) {
    const S = [18, 66], B = [102, 80];
    const mastB = P(S, B, 0.46, 3, -5), head = [mastB[0] - 3, 6];
    const boat = `
      <path d="M64 80 Q78 84 86 94 L83 96 Q74 88 60 83Z" fill="#E3ECFC"/>
      ${hull(id, S, B, 10, 3.6, "url(#" + id + "hull)", c, { sw: 2, belly: 0.1 })}
      <path d="M34 63 Q42 55 56 56 L62 63Z" fill="#2B3478"/><path d="M38 62 Q44 57 55 58" stroke="#A9BCF4" stroke-width="1" fill="none"/>
      ${mastLine(mastB, head)}
      <path d="M${mastB[0] - 3} ${mastB[1] - 18} L${mastB[0] + 3.5} ${mastB[1] - 20} M${mastB[0] - 3} ${mastB[1] - 36} L${mastB[0] + 3} ${mastB[1] - 37}" stroke="#E6ECFB" stroke-width=".8"/>
      ${mainsail(id, [mastB[0] - 1, mastB[1] - 1], [head[0] - 1, head[1] + 2], [20, 68], 5, c, 6)}
      ${jib(id, [head[0] + 1, head[1] + 5], [98, 77], [66, 69], 12, c, 4)}
      ${wire([head[0], head[1]], B, .7)}${wire([head[0], head[1]], S, .55)}`;
    return backdrop(id, PAL["IMOCA"]).replace("</defs>", bits(id) + "</defs>") +
      `<g id="${id}boat">${boat}</g>` + reflect(id, id + "boat", 80) + spray(18, 82, 26) + spray(80, 92, 14) + front(id, 92, .45);
  }
  // ---------- RHUM MULTI (Vintage Multi) : trimaran 39-60 pieds, grande chute ronde ----------
  function vmulti(c, id) {
    const S = [22, 66], B = [96, 79];
    const mastB = P(S, B, 0.48, 3, -5), head = [mastB[0] - 5, 10];
    const boat = `
      ${hull(id, [24, 72], [84, 83], 5, 1.9, "#E8E3D2", c, { sw: 1.3, deck: "#C9BFA6" })}
      ${hull(id, [40, 60], [102, 67], 3.8, 1.5, "#EFE9D8", c, { sw: 1, deck: "#C9BFA6" })}
      <path d="M44 66 L52 75 M70 70 L80 80 M42 62 L54 62 M80 63 L92 63" stroke="#8A6A3C" stroke-width="1.4" stroke-linecap="round"/>
      ${hull(id, S, B, 8, 3, "#F4EEDD", c, { sw: 1.8, deck: "#B9AD8E" })}
      <path d="M44 63 Q54 58 66 60 L70 64Z" fill="#B58A52"/>
      ${mastLine(mastB, head)}
      ${mainsail(id, [mastB[0] - 1, mastB[1] - 1], [head[0] - 1, head[1] + 2], [20, 67], 8, c, 3)}
      ${jib(id, [head[0] + 1, head[1] + 4], [93, 76], [60, 68], 12, c, 3)}
      ${wire([head[0], head[1]], B, .7)}${wire([head[0], head[1]], S, .55)}`;
    return backdrop(id, PAL["Vintage Multi"]).replace("</defs>", bits(id) + "</defs>") +
      `<g id="${id}boat">${boat}</g>` + reflect(id, id + "boat", 77) + spray(14, 86, 22) + spray(64, 90, 18) + front(id, 92, .45);
  }
  // ---------- RHUM MONO (Vintage Mono) : monocoque classique, grand-voile haute ----------
  function vmono(c, id) {
    const S = [20, 68], B = [100, 81];
    const mastB = P(S, B, 0.46, 3, -5), head = [mastB[0] - 4, 8];
    const boat = `
      ${hull(id, S, B, 12, 3.6, "url(#" + id + "wood)", c, { sw: 2, belly: 0.12, deck: "#C79A5E" })}
      <path d="M36 66 Q44 59 58 60 L64 66Z" fill="#B58A52"/><path d="M40 65 Q46 61 57 62" stroke="#6A4A2A" stroke-width=".8" fill="none"/>
      ${mastLine(mastB, head)}
      ${mainsail(id, [mastB[0] - 1, mastB[1] - 1], [head[0] - 1, head[1] + 2], [22, 70], 5, c, 4)}
      ${jib(id, [head[0] + 1, head[1] + 5], [97, 78], [64, 71], 12, c, 3)}
      ${wire([head[0], head[1]], B, .7)}${wire([head[0], head[1]], S, .55)}`;
    return backdrop(id, PAL["Vintage Mono"]).replace("</defs>", bits(id) + "</defs>") +
      `<g id="${id}boat">${boat}</g>` + reflect(id, id + "boat", 82) + spray(16, 84, 24) + spray(78, 92, 16) + front(id, 92, .45);
  }
  function render(cls, color) {
    const id = "b" + (n++);
    const fn = { "Ultim": ultim, "Ocean Fifty": fifty, "IMOCA": imoca, "Vintage Multi": vmulti, "Vintage Mono": vmono }[cls] || imoca;
    return `<svg viewBox="0 0 120 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${fn(color, id)}</svg>`;
  }
  window.RhumBoat = { render };
})();

(function () {
  "use strict";

  const CFG = window.RHUM_CONFIG || {};
  const app = document.getElementById("app");

  const CLASSES = {
    "Ultim": { color: "#D8445F", multi: true },
    "Ocean Fifty": { color: "#E9A23B", multi: true },
    "IMOCA": { color: "#3C7DF0", multi: false },
    "Class40": { color: "#2FA66A", multi: false },
    "Vintage Multi": { color: "#12A3B4", multi: true },
    "Vintage Mono": { color: "#B58A52", multi: false }
  };
  const RAR = ["legendaire", "epique", "rare", "commun"];
  const RAR_LABEL = { commun: "Commun", rare: "Rare", epique: "Épique", legendaire: "Légendaire" };
  const RAR_VALUE = { commun: 1, rare: 3, epique: 6, legendaire: 12 };
  const FLAGS = ["#DA532C", "#F5C518", "#5B8DEF", "#F4F7F9"];

  const S = {
    sb: null, me: null, tab: "album",
    players: [], cards: [], mine: [], boosters: [], quizzes: [], questions: [],
    subs: [], drops: [], claims: [], scores: [], daily: [],
    filters: { cls: "all", rar: "all", missing: false },
    run: null, overlay: false, adminCode: null, adminData: null,
    flash: [], myLevel: 3, hardSubs: [], streak: null, admin: { levels: [] },
    mk: { view: "search", playerId: null, q: "", decks: [], trades: [], perks: { leger: [], costaud: [] }, loaded: false }
  };

  // ---------- Utilitaires ----------
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clsInfo = (c) => CLASSES[c] || { color: "#7C93A6", multi: false };
  const cardById = (id) => S.cards.find((c) => c.id === id);
  const playerById = (id) => S.players.find((p) => p.id === id);
  const plural = (n, a, b) => (n > 1 ? b : a);

  function toast(msg, isErr) {
    const old = document.querySelector(".toast");
    if (old) old.remove();
    const t = document.createElement("div");
    t.className = "toast" + (isErr ? " err" : "");
    t.setAttribute("role", "status");
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), isErr ? 5000 : 2800);
  }

  async function rpc(name, args) {
    const { data, error } = await S.sb.rpc(name, args);
    if (error) throw new Error(error.message || "Erreur");
    return data;
  }

  async function q(promise) {
    const { data, error } = await promise;
    if (error) throw new Error(error.message || "Erreur de lecture");
    return data || [];
  }

  // ---------- Chargement ----------
  async function load() {
    const sb = S.sb;
    const me = S.me;
    const [players, cards, quizzes, questions, drops, scores] = await Promise.all([
      q(sb.from("players").select("*").order("id")),
      q(sb.from("cards_v").select("*").eq("active", true)),
      q(sb.from("quizzes").select("*").order("id", { ascending: false }).limit(12)),
      q(sb.from("quiz_questions").select("*").order("position")),
      q(sb.from("drops").select("*").gt("expires_at", new Date().toISOString()).order("id", { ascending: false })),
      q(sb.from("scores_v").select("*"))
    ]);
    S.players = players; S.cards = cards; S.quizzes = quizzes; S.questions = questions; S.drops = drops; S.scores = scores;
    if (me) {
      const [mine, boosters, subs, claims] = await Promise.all([
        q(sb.from("player_cards").select("card_id, source").eq("player_id", me.id)),
        q(sb.from("boosters").select("*").eq("player_id", me.id).is("opened_at", null).order("id")),
        q(sb.from("quiz_submissions").select("quiz_id, score, total").eq("player_id", me.id)),
        q(sb.from("drop_claims").select("drop_id").eq("player_id", me.id))
      ]);
      S.mine = mine; S.boosters = boosters; S.subs = subs; S.claims = claims;
      try { S.daily = await rpc("daily_slots", { p_player: me.id }); } catch (e) { S.daily = []; }
      try { await loadMarket(); } catch (e) { /* marché pas encore installé */ }
      try { S.myLevel = Number(await rpc("my_level", { p_player: me.id })) || 3; } catch (e) { S.myLevel = 3; }
    }
    try { await loadFlash(); } catch (e) { S.flash = []; }
    try {
      const hardIds = quizzes.filter((z) => z.kind === "hard").map((z) => z.id);
      S.hardSubs = hardIds.length ? await q(sb.from("quiz_submissions").select("quiz_id, player_id, score").in("quiz_id", hardIds)) : [];
    } catch (e) { S.hardSubs = []; }
  }

  async function loadFlash() {
    S.flash = await q(S.sb.from("flash_drops").select("*").order("id", { ascending: false }).limit(6));
  }

  async function loadMarket() {
    const [decks, perks, trades] = await Promise.all([
      rpc("market_decks", {}), rpc("market_perks", {}),
      q(S.sb.from("trades").select("*").order("id", { ascending: false }).limit(300))
    ]);
    S.mk.decks = decks; S.mk.perks = (perks && perks.leger) ? perks : { leger: [], costaud: [] }; S.mk.trades = trades; S.mk.loaded = true;
  }

  // ---------- Dessins ----------
  function pennants() {
    let p = "";
    for (let i = 0; i < 24; i++) p += `<polygon points="${i * 10},0 ${i * 10 + 10},0 ${i * 10 + 5},9" fill="${FLAGS[i % 4]}"/>`;
    return `<svg class="pennants" viewBox="0 0 240 9" preserveAspectRatio="none" aria-hidden="true">${p}</svg>`;
  }

  function boatArt(cls) {
    return window.RhumBoat.render(cls, clsInfo(cls).color);
  }

  function skipperArt(cls) {
    const color = clsInfo(cls).color;
    return `<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M18 92 Q22 60 60 58 Q98 60 102 92Z" fill="${color}"/><path d="M48 60 L60 74 L72 60Z" fill="rgba(0,0,0,.25)"/><circle cx="60" cy="36" r="17" fill="#E8BF9C"/><path d="M40 40 Q38 12 60 12 Q82 12 80 40 Q78 24 60 24 Q42 24 40 40Z" fill="${color}"/><path d="M40 40 Q38 12 60 12 Q82 12 80 40" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="2"/></svg>`;
  }

  function artHTML(c) {
    if (c.photo) return `<img src="${esc(c.photo)}" alt="" loading="lazy">`;
    return c.kind === "skipper" ? skipperArt(c.class) : boatArt(c.class);
  }

  function cardHTML(c, o) {
    o = o || {};
    const info = clsInfo(c.class);
    const val = RAR_VALUE[c.rarity] || 1;
    const attrs = o.action ? ` data-action="${o.action}" data-card="${c.id}"` : "";
    const tag = o.action ? "button" : "div";
    if (o.missing) {
      return `<${tag} class="card missing r-${c.rarity}" style="--cc:${info.color}"${attrs} aria-label="Carte à trouver : ${esc(c.name)}, ${esc(RAR_LABEL[c.rarity])}, ${esc(c.class)}"><div class="card-in">
        <div class="card-top"><span class="card-class">${esc(c.class)}</span><span class="card-val">${val}<small>pts</small></span></div>
        <div class="card-art">?</div>
        <div class="card-name${c.name.length > 19 ? " long" : ""}">${esc(c.name)}</div>
        <div class="card-sub">${c.kind === "skipper" ? "Skipper à trouver" : "Bateau à trouver"}</div>
        <div class="card-foot"><span class="card-rar">${RAR_LABEL[c.rarity]}</span></div></div></${tag}>`;
    }
    const long = c.name.length > 19 ? " long" : "";
    const sub = (c.kind === "skipper" ? "Skipper de " : "Barré par ") + c.partner_name;
    return `<${tag} class="card r-${c.rarity}" style="--cc:${info.color}"${attrs}><div class="card-in">
      ${o.isNew ? '<span class="ribbon">Nouvelle</span>' : ""}
      <div class="card-top"><span class="card-class">${esc(c.class)}</span><span class="card-val">${val}<small>pts</small></span></div>
      <div class="card-art">${artHTML(c)}</div>
      <div class="card-name${long}">${esc(c.name)}</div>
      <div class="card-sub">${esc(sub)}</div>
      <div class="card-foot"><span class="card-rar"><i class="stars" aria-hidden="true">${"★".repeat(({commun:1,rare:2,epique:3,legendaire:4})[c.rarity] || 1)}</i> ${RAR_LABEL[c.rarity]}</span>${o.count > 1 ? `<span class="card-n">×${o.count}</span>` : ""}</div></div></${tag}>`;
  }

  // ---------- Écrans ----------
  function renderSetup() {
    app.innerHTML = `<div class="setup"><h1>Il manque la connexion à la base.</h1>
      <p class="lede">Ouvrez <code>config.js</code> et renseignez l'adresse du projet Supabase et la clé « anon public », puis redéposez le dossier sur Netlify.</p></div>`;
  }

  function renderPin() {
    const p = S.pinFor, first = S.pinFirst;
    app.innerHTML = `<div class="picker">${pennants()}<div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:18px">${window.RhumAvatar.render(p.avatar, 96)}
      <h1 style="margin:0">${esc(p.first_name)}</h1>
      <p class="lede" style="text-align:center">${first ? "Première connexion : choisis ton code à 4 chiffres. Tu le retapes sur chaque appareil." : "Entre ton code à 4 chiffres."}</p>
      <input id="pin" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" type="password" aria-label="Code à 4 chiffres" style="font:800 34px/1 var(--display);letter-spacing:.5em;text-align:center;width:9ch;padding:12px;border-radius:12px;border:2px solid var(--sea-600);background:var(--sea-800);color:var(--ink)">
      <button class="btn" data-action="pin-go">${first ? "Créer mon code" : "Entrer"}</button>
      <button class="btn ghost" data-action="pin-back">Ce n'est pas moi</button></div></div>`;
    const inp = document.getElementById("pin");
    inp.addEventListener("input", () => { inp.value = inp.value.replace(/\D/g, "").slice(0, 4); });
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") actions["pin-go"](); });
    setTimeout(() => inp.focus(), 50);
  }

  function renderPicker() {
    if (S.pinFor) return renderPin();
    app.innerHTML = `<div class="picker">${pennants()}<h1 style="margin-top:18px">L'album<br>du Rhum</h1>
      <p class="lede">Tu es qui ?</p>
      <div class="who-grid">${S.players.map((p) => `<button class="who" data-action="pick" data-id="${p.id}">${window.RhumAvatar.render(p.avatar, 72)}<span>${esc(p.first_name)}</span></button>`).join("")}</div></div>`;
  }

  function myScore() {
    return S.scores.find((s) => S.me && s.player_id === S.me.id) || { total: 0 };
  }

  function shell(inner) {
    const pending = S.boosters.length + availableDrops().length + S.daily.filter((d) => d.state === "ready").length;
    const todo = openQuizzes().length;
    const tabs = [["marche", "Village"], ["album", "Album"], ["quiz", "Quiz"], ["boosters", "Boosters"], ["score", "Score"]];
    const incoming = S.mk.trades.filter((t) => t.to_player === S.me.id && t.status === "pending").length;
    const badge = { quiz: todo, boosters: pending, marche: incoming };
    try { if (navigator.setAppBadge) navigator.setAppBadge(todo + pending + incoming); } catch (e) {}
    app.innerHTML = `<header class="top"><div class="top-row">
        <button class="top-who" data-action="switch" aria-label="Changer de joueur">${window.RhumAvatar.render(S.me.avatar, 44)}
          <span><span class="top-name">${esc(S.me.first_name)}</span><br><span class="top-sub">Changer de joueur</span></span></button>
        <div class="top-score"><b>${myScore().total}</b><span>points</span></div></div>${pennants()}</header>
      <main id="view" class="view">${flashBanner()}${inner}</main>
      <nav class="tabbar" aria-label="Navigation"><div class="tabbar-in">${tabs.map(([k, l]) => `<button class="tab" data-action="tab" data-tab="${k}" ${S.tab === k ? 'aria-current="page"' : ""}>${l}${badge[k] ? `<span class="dot" aria-label="${badge[k]} à faire">${badge[k]}</span>` : ""}</button>`).join("")}</div></nav>`;
  }

  // --- Légendaire éclair ---
  function flashState() {
    const now = Date.now();
    const active = S.flash.find((f) => !f.winner_player && new Date(f.expires_at) > now);
    const recent = S.flash.find((f) => f.winner_player && f.won_at && now - new Date(f.won_at) < 20 * 60000);
    const iWon = S.me && S.flash.some((f) => f.winner_player === S.me.id);
    return { active, recent, iWon };
  }
  function flashBanner() {
    if (!S.me) return "";
    const { active, recent, iWon } = flashState();
    if (active && !iWon) return `<div class="flash"><div><b>Légendaire éclair</b><span>${esc(active.label)} : le plus rapide gagne. Une seule victoire par joueur.</span></div><button class="btn" data-action="claim-flash" data-id="${active.id}">Je le prends</button></div>`;
    if (active && iWon) return `<div class="flash dim"><div><b>Légendaire éclair en cours</b><span>Tu en as déjà gagné un : laisse la chance aux autres.</span></div></div>`;
    if (recent) { const w = playerById(recent.winner_player); return `<div class="flash dim"><div><b>Légendaire éclair pris</b><span>${esc(w ? w.first_name : "Quelqu'un")} a été le plus rapide.</span></div></div>`; }
    return "";
  }
  function marketBanner() {
    const incoming = S.mk.trades.filter((t) => t.to_player === S.me.id && t.status === "pending").length;
    return `<button class="mk-banner" data-action="tab" data-tab="marche"><b>Village</b><span>${incoming ? `${incoming} ${plural(incoming, "demande", "demandes")} pour toi` : "Deal tes cartes contre une autre carte ou une action"}</span></button>`;
  }

  // --- Album ---
  function ownedCounts() {
    const m = new Map();
    S.mine.forEach((x) => m.set(x.card_id, (m.get(x.card_id) || 0) + 1));
    return m;
  }

  function albumHTML() {
    const counts = ownedCounts();
    const entries = new Map();
    S.cards.forEach((c) => {
      if (!entries.has(c.entry_id)) entries.set(c.entry_id, { id: c.entry_id, cls: c.class, rarity: c.rarity, skipper: null, boat: null });
      entries.get(c.entry_id)[c.kind] = c;
    });
    let list = [...entries.values()].filter((e) => e.skipper && e.boat);
    const totalCards = list.length * 2;
    let have = 0, pairs = 0;
    list.forEach((e) => {
      const a = counts.has(e.skipper.id), b = counts.has(e.boat.id);
      have += (a ? 1 : 0) + (b ? 1 : 0);
      if (a && b) pairs++;
    });
    const f = S.filters;
    list = list.filter((e) => (f.cls === "all" || e.cls === f.cls) && (f.rar === "all" || e.rarity === f.rar) &&
      (!f.missing || !(counts.has(e.skipper.id) && counts.has(e.boat.id))));
    list.sort((x, y) => RAR.indexOf(x.rarity) - RAR.indexOf(y.rarity) || x.cls.localeCompare(y.cls) || x.skipper.name.localeCompare(y.skipper.name));

    const classes = [...new Set(S.cards.map((c) => c.class))];
    const chips = (items, key) => items.map(([v, l]) => `<button class="chip" data-action="filter" data-key="${key}" data-val="${v}" aria-pressed="${f[key] === v}">${l}</button>`).join("");
    const pct = totalCards ? Math.round((have / totalCards) * 100) : 0;

    const rows = list.map((e) => {
      const a = counts.get(e.skipper.id) || 0, b = counts.get(e.boat.id) || 0;
      const full = a && b;
      const bonus = 2 * RAR_VALUE[e.rarity];
      return `<section class="pair ${full ? "full" : ""}"><div class="pair-cards">
        ${a ? cardHTML(e.skipper, { action: "zoom", count: a }) : cardHTML(e.skipper, { missing: true })}
        ${b ? cardHTML(e.boat, { action: "zoom", count: b }) : cardHTML(e.boat, { missing: true })}
        </div><div class="pair-badge">${full ? `Paire complète : +${bonus} points` : `Paire : +${bonus} points`}</div></section>`;
    }).join("");

    return `<h1>Mon album Rhumini</h1>
      <div class="stats"><div><b>${have}/${totalCards}</b><span>cartes</span></div><div><b>${pairs}</b><span>${plural(pairs, "paire", "paires")}</span></div></div>
      <div class="progress" role="img" aria-label="${pct} % de l'album"><i style="width:${pct}%"></i></div>
      <div class="chips" role="group" aria-label="Filtrer par rareté">${chips([["all", "Toutes raretés"]].concat(RAR.map((r) => [r, RAR_LABEL[r]])), "rar")}
        <button class="chip" data-action="toggle-missing" aria-pressed="${f.missing}">Paires à compléter</button></div>
      ${rows || '<p class="empty">Aucune carte ne correspond à ce filtre.</p>'}`;
  }

  // --- Quiz ---
  const canSee = (z) => z.kind !== "hard" || S.myLevel >= (z.min_level || 1);
  function openQuizzes() {
    const done = new Set(S.subs.map((s) => s.quiz_id));
    return S.quizzes.filter((z) => z.is_open && !done.has(z.id) && canSee(z));
  }
  function quizQuestions(id) { return S.questions.filter((x) => x.quiz_id === id).sort((a, b) => a.position - b.position); }

  function quizHTML() {
    if (S.run) return quizRunHTML();
    const todo = openQuizzes();
    const done = S.quizzes.filter((z) => S.subs.some((s) => s.quiz_id === z.id));
    const card = (z) => `<div class="q-card ${z.kind === "hard" ? "hard" : ""}"><div class="grow"><h3>${esc(z.title)}</h3><span class="muted">${quizQuestions(z.id).length} questions${z.kind === "hard" ? " · points et titre, pas de cartes" : ""}</span></div><button class="btn small" data-action="start-quiz" data-id="${z.id}">Répondre</button></div>`;
    const normal = todo.filter((z) => z.kind !== "hard"), hard = todo.filter((z) => z.kind === "hard");
    return `<h1>Quiz</h1><p class="lede">Deux quiz par jour. Chaque bonne réponse te rapporte une carte (5 au maximum) et 10 points. Un sans-faute et tu gagnes une carte légendaire en bonus !</p>
      ${normal.length ? normal.map(card).join("") : '<p class="empty">Pas de nouveau quiz pour l\'instant. Le prochain arrive bientôt.</p>'}
      ${hard.length ? `<h2>Quiz difficile</h2><p class="muted" style="margin:-4px 0 12px;font-size:14px">20 points par bonne réponse et le titre de Maître du quiz. Pas de cartes.</p>${hard.map(card).join("")}` : ""}
      ${done.length ? `<h2>Déjà fait</h2>${done.map((z) => { const s = S.subs.find((x) => x.quiz_id === z.id); return `<div class="q-card"><div class="grow"><h3>${esc(z.title)}</h3></div><b style="font:800 30px/1 var(--display)">${s.score}/${s.total}</b></div>`; }).join("")}` : ""}`;
  }

  function quizRunHTML() {
    const r = S.run;
    if (r.result) {
      const res = r.result;
      const qs = r.qs;
      return `<p class="q-step">${esc(r.quiz.title)}</p><div class="result-score">${res.score}<small>/${res.total}</small></div>
        <p class="lede" style="margin-top:8px">${res.kind === "hard" ? `${res.score * 20} points ajoutés au classement.` : res.score === 0 ? "Aucune carte cette fois. Rendez-vous au prochain quiz !" : res.booster_id ? `Booster gagné : ${res.cards || res.score} ${plural(res.cards || res.score, "carte", "cartes")}${res.bonus_legendary ? " et une carte légendaire en bonus" : ""}.` : ""}</p>
        ${res.booster_id ? '<button class="btn" data-action="open-from-quiz" data-id="' + res.booster_id + '" data-bonus="' + (res.bonus_legendary ? 1 : 0) + '">Ouvrir mon booster</button> ' : ""}
        <button class="btn ghost" data-action="quiz-done">Retour</button>
        <div class="review">${qs.map((qq, i) => { const rr = res.results[i]; return `<div><b>${esc(qq.question)}</b>${rr.ok ? "Bonne réponse : " : `Ta réponse : ${rr.given == null ? "aucune" : esc(qq.choices[rr.given])}<br>Bonne réponse : `}${esc(qq.choices[rr.correct_index])}${rr.explanation ? `<div class="why">${esc(rr.explanation)}</div>` : ""}</div>`; }).join("")}</div>`;
    }
    const qq = r.qs[r.i];
    const sel = r.answers[r.i];
    return `<p class="q-step">${esc(r.quiz.title)} · question ${r.i + 1} sur ${r.qs.length}</p>
      ${qq.category === "perso" ? '<span class="q-perso">Question perso</span>' : ""}
      <h1 class="q-text">${esc(qq.question)}</h1>
      <div class="choices">${qq.choices.map((c, i) => `<button class="choice" data-action="answer" data-i="${i}" aria-pressed="${sel === i}">${esc(c)}</button>`).join("")}</div>
      <div style="margin-top:18px;display:flex;gap:10px">
        ${r.i > 0 ? '<button class="btn ghost" data-action="prev-q">Précédente</button>' : '<button class="btn ghost" data-action="quiz-done">Annuler</button>'}
        <button class="btn" data-action="next-q" ${sel == null ? "disabled" : ""}>${r.i === r.qs.length - 1 ? "Terminer" : "Suivante"}</button></div>`;
  }

  // --- Boosters ---
  function availableDrops() {
    const claimed = new Set(S.claims.map((c) => c.drop_id));
    return S.drops.filter((d) => !claimed.has(d.id) && new Date(d.expires_at) > new Date());
  }
  function fmtSlot(s) { const [h, m] = s.split(":"); return m === "00" ? Number(h) + "h" : Number(h) + "h" + m; }
  function fmtMin(m) { return m >= 60 ? Math.floor(m / 60) + " h " + String(m % 60).padStart(2, "0") : m + " min"; }
  function dailyHTML() {
    if (!S.daily.length) return "";
    return `<h2 style="margin-top:6px">Booster du jour</h2><p class="muted" style="margin:-4px 0 12px;font-size:14px">À ouvrir avant minuit, sinon il disparaît.</p>` +
      S.daily.map((d) => {
        const t = "Booster espresso " + fmtSlot(d.slot);
        if (d.state === "ready") return `<div class="pack-row"><div class="pack-ico"></div><div class="grow"><h3>${t}</h3><p>${d.size} cartes · encore ${fmtMin(d.closes_in_min)} pour l'ouvrir</p></div><button class="btn small" data-action="open-daily" data-slot="${esc(d.slot)}">Ouvrir</button></div>`;
        if (d.state === "locked") return `<div class="pack-row dim"><div class="pack-ico"></div><div class="grow"><h3>${t}</h3><p>Arrive à ${fmtSlot(d.slot)}, dans ${fmtMin(d.opens_in_min)}</p></div></div>`;
        return `<div class="pack-row dim"><div class="pack-ico"></div><div class="grow"><h3>${t}</h3><p>Ouvert aujourd'hui</p></div></div>`;
      }).join("");
  }
  function streakHTML() {
    const s = S.streak && S.streak.streak;
    if (!s) return "";
    const left = 3 - (s % 3);
    return `<div class="streak"><b>Série : ${s} ${plural(s, "jour", "jours")}</b><span>${left === 3 ? "Bonus reçu aujourd'hui, la suite dans 3 jours." : `Encore ${left} ${plural(left, "jour", "jours")} d'affilée pour une carte bonus.`}</span></div>`;
  }
  function minutesLeft(d) { return Math.max(1, Math.round((new Date(d.expires_at) - new Date()) / 60000)); }

  function boostersHTML() {
    const drops = availableDrops();
    return `<h1>Boosters</h1><p class="lede">Un booster espresso sponsorisé Café Joyeux, à ouvrir à l'heure du café. Ici tu trouves aussi des drops surprises envoyés par le dieu des cartes.</p>
      ${streakHTML()}
      ${dailyHTML()}
      ${drops.length ? `<h2 style="margin-top:${S.daily.length ? 26 : 6}px">Drop en cours</h2>${drops.map((d) => `<div class="pack-row"><div class="pack-ico"></div><div class="grow"><h3>${esc(d.label)}</h3><p>${d.size} cartes · encore ${minutesLeft(d)} min</p></div><button class="btn small" data-action="claim" data-id="${d.id}">Récupérer</button></div>`).join("")}` : ""}
      <h2 style="margin-top:${drops.length || S.daily.length ? 26 : 6}px">À ouvrir</h2>
      ${S.boosters.length ? S.boosters.map((b) => `<div class="pack-row"><div class="pack-ico"></div><div class="grow"><h3>${esc(b.label)}</h3><p>${b.size} ${plural(b.size, "carte", "cartes")}${b.luck ? " · chance bonus" : ""}</p></div><button class="btn small" data-action="open" data-id="${b.id}">Ouvrir</button></div>`).join("") :
        '<p class="empty">Aucun booster en attente. Réponds au quiz ou guette le prochain drop.</p>'}`;
  }

  // --- Score ---
  function scoreHTML() {
    const rows = S.scores.slice().sort((a, b) => b.total - a.total || a.first_name.localeCompare(b.first_name));
    const max = Math.max(1, ...rows.map((r) => r.total));
    const hardPts = new Map();
    S.hardSubs.forEach((h) => hardPts.set(h.player_id, (hardPts.get(h.player_id) || 0) + h.score));
    const best = Math.max(0, ...hardPts.values());
    const masters = new Set([...hardPts].filter(([, v]) => v === best && best > 0).map(([k]) => k));
    const last = rows[rows.length - 1];
    const lastLine = rows.length > 1 && rows[0].total > last.total ? `<p class="lede"><b>${esc(last.first_name)}</b>, gros nullos ! Pour info il manque un lit, j'espère que t'aimes le parquet.</p>` : "";
    return `<h1>Classement</h1>${lastLine}<p style="margin:0 0 14px"><button class="link" data-action="rules">Comment sont comptés les points ?</button></p>
      <div class="legend"><span><i style="background:var(--flag-blue)"></i>Quiz</span><span><i style="background:var(--flag-yellow)"></i>Cartes</span><span><i style="background:var(--flag-red)"></i>Paires</span></div>
      <ol class="board">${rows.map((r, i) => {
        const p = playerById(r.player_id) || { avatar: {} };
        const w = (v) => (v / max) * 100;
        return `<li class="row ${S.me && r.player_id === S.me.id ? "me" : ""}"><span class="rank">${i + 1}</span>${window.RhumAvatar.render(p.avatar, 48)}
          <div><div class="row-name">${esc(r.first_name)}${masters.has(r.player_id) ? ' <span class="title-tag">Maître du quiz</span>' : ""}</div><div class="bar"><i style="width:${w(r.quiz_points)}%"></i><i style="width:${w(r.card_points)}%"></i><i style="width:${w(r.pair_points)}%"></i></div>
          <div class="row-det">${r.n_cards} ${plural(r.n_cards, "carte", "cartes")} · ${r.n_pairs} ${plural(r.n_pairs, "paire", "paires")}</div></div>
          <span class="row-total">${r.total}</span></li>`;
      }).join("")}</ol>
      <p style="margin-top:28px"><button class="link" data-action="admin">Espace organisateur</button></p>`;
  }

  // --- Marché ---
  const STARS = { commun: 1, rare: 2, epique: 3, legendaire: 4 };
  function cardLabel(id) {
    const c = cardById(id);
    if (!c) return "carte retirée";
    return `<span class="mk-card r-${c.rarity}"><b>${esc(c.name)}</b> <small>${c.kind === "skipper" ? "skipper" : "bateau"} · ${"★".repeat(STARS[c.rarity] || 1)}</small></span>`;
  }
  const tierOf = (c) => (c && c.rarity === "legendaire" ? "costaud" : c && c.rarity === "epique" ? "leger" : null);
  const TIER_LABEL = { leger: "Léger", costaud: "Costaud" };
  const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  function deckOf(pid) {
    const m = new Map();
    S.mk.decks.forEach(([p, c, n]) => { if (p === pid) m.set(c, n); });
    return m;
  }
  function ownersOf(cid) {
    return S.mk.decks.filter(([p, c]) => c === cid).map(([p, c, n]) => ({ p, n }));
  }
  function marketSearchHTML() {
    const qs = norm(S.mk.q.trim());
    if (!qs) {
      const rows = S.players.filter((p) => p.id !== S.me.id).map((p) => {
        const n = [...deckOf(p.id).values()].reduce((x, y) => x + y, 0);
        return `<button class="who mk-p" data-action="mk-player" data-id="${p.id}">${window.RhumAvatar.render(p.avatar, 56)}<span>${esc(p.first_name)}</span><small>${n} ${plural(n, "carte", "cartes")}</small></button>`;
      }).join("");
      return `<p class="lede" style="margin-top:14px">Touche un joueur pour voir son deck, ou cherche une carte ci-dessus.</p><div class="who-grid">${rows}</div>`;
    }
    const pl = S.players.filter((p) => p.id !== S.me.id && norm(p.first_name).includes(qs));
    const cs = S.cards.filter((c) => norm(c.name).includes(qs) || norm(c.partner_name).includes(qs)).slice(0, 30);
    const plHTML = pl.map((p) => `<button class="mk-row" data-action="mk-player" data-id="${p.id}">${window.RhumAvatar.render(p.avatar, 36)}<span>Voir le deck de <b>${esc(p.first_name)}</b></span></button>`).join("");
    const csHTML = cs.map((c) => {
      const owners = ownersOf(c.id).filter((o) => o.p !== S.me.id);
      const mine = (S.mine.filter((x) => x.card_id === c.id).length);
      const chips = owners.length ? owners.map((o) => `<button class="chip" data-action="mk-want" data-player="${o.p}" data-card="${c.id}">${esc((playerById(o.p) || {}).first_name)}${o.n > 1 ? " ×" + o.n : ""} · demander</button>`).join("")
        : '<span class="mk-none">Personne ne l\'a pour l\'instant</span>';
      return `<div class="mk-res">${cardLabel(c.id)}${mine ? `<small class="mk-mine">Tu l'as${mine > 1 ? " ×" + mine : ""}</small>` : ""}<div class="chips">${chips}</div></div>`;
    }).join("");
    return `<div style="margin-top:12px">${plHTML}${csHTML || (plHTML ? "" : '<p class="empty">Aucun résultat.</p>')}</div>`;
  }
  function marketDeckHTML() {
    const p = playerById(S.mk.playerId);
    if (!p) return "";
    const deck = deckOf(p.id);
    const list = S.cards.filter((c) => deck.has(c.id)).sort((x, y) => RAR.indexOf(x.rarity) - RAR.indexOf(y.rarity) || x.name.localeCompare(y.name));
    const mine = new Set(S.mine.map((x) => x.card_id));
    const grid = list.map((c) => `<div class="mk-cell">${cardHTML(c, { action: "mk-want", count: deck.get(c.id) })}<small class="${mine.has(c.id) ? "mk-mine" : "mk-new"}">${mine.has(c.id) ? "Tu l'as" : "Il vous manque"}${tierOf(c) ? " · contrepartie " + TIER_LABEL[tierOf(c)] : ""}</small></div>`).join("");
    return `<button class="btn ghost" data-action="mk-back">← Retour</button>
      <div class="mk-head">${window.RhumAvatar.render(p.avatar, 56)}<div><h2 style="margin:0">Deck de ${esc(p.first_name)}</h2><p class="lede" style="margin:2px 0 0">${list.length} ${plural(list.length, "carte", "cartes")} · touche une carte pour la demander. Tu ne peux rien modifier dans son deck.</p></div></div>
      <div class="mk-grid">${grid || '<p class="empty">Ce deck est encore vide.</p>'}</div>`;
  }
  function tradeLine(t, mode) {
    const from = playerById(t.from_player), to = playerById(t.to_player);
    const fn = esc((from || {}).first_name), tn = esc((to || {}).first_name);
    const heavy = !t.give_card;
    const perk = t.perk ? `<div class="mk-perk">${heavy ? "Contrepartie" : "En plus"} : ${esc(t.perk)}</div>` : "";
    let head;
    if (mode === "in") head = heavy ? `<b>${fn}</b> veut ta ${cardLabel(t.want_card)}` : `<b>${fn}</b> te propose ${cardLabel(t.give_card)} contre ta ${cardLabel(t.want_card)}`;
    else if (mode === "out") head = heavy ? `Tu demandes ${cardLabel(t.want_card)} à <b>${tn}</b>` : `Tu proposes ${cardLabel(t.give_card)} à <b>${tn}</b> contre ${cardLabel(t.want_card)}`;
    else head = heavy ? `<b>${tn}</b> donne ${cardLabel(t.want_card)} à <b>${fn}</b>` : `<b>${fn}</b> ⇄ <b>${tn}</b> : ${cardLabel(t.give_card)} contre ${cardLabel(t.want_card)}`;
    return head + perk;
  }
  const STATUS = { accepted: "Accepté", declined: "Refusé", cancelled: "Annulé" };
  function marketTradesHTML() {
    const T = S.mk.trades, me = S.me.id;
    const inc = T.filter((t) => t.status === "pending" && t.to_player === me);
    const out = T.filter((t) => t.status === "pending" && t.from_player === me);
    const hist = T.filter((t) => t.status !== "pending" && (t.from_player === me || t.to_player === me)).slice(0, 12);
    const feed = T.filter((t) => t.status === "accepted").slice(0, 8);
    const box = (t, mode, btns) => `<div class="mk-trade">${tradeLine(t, mode)}<div class="mk-btns">${btns}</div></div>`;
    return `<h2>Demandes reçues</h2>${inc.map((t) => box(t, "in", `<button class="btn" data-action="mk-accept" data-id="${t.id}">Accepter</button><button class="btn ghost" data-action="mk-decline" data-id="${t.id}">Refuser</button>`)).join("") || '<p class="empty">Aucune demande pour le moment.</p>'}
      <h2>Mes demandes envoyées</h2>${out.map((t) => box(t, "out", `<button class="btn ghost" data-action="mk-cancel" data-id="${t.id}">Annuler</button>`)).join("") || '<p class="empty">Rien en attente.</p>'}
      ${hist.length ? `<h2>Historique</h2>${hist.map((t) => `<div class="mk-trade dim">${tradeLine(t, t.from_player === me ? "out" : "in")}<div class="mk-status s-${t.status}">${STATUS[t.status]}</div></div>`).join("")}` : ""}
      <h2>Activité du village</h2>${feed.map((t) => `<div class="mk-trade dim">${tradeLine(t, "feed")}</div>`).join("") || '<p class="empty">Aucun échange pour le moment.</p>'}`;
  }
  function marcheHTML() {
    const incoming = S.mk.trades.filter((t) => t.to_player === S.me.id && t.status === "pending").length;
    const v = S.mk.view;
    const nav = `<div class="chips" role="group" aria-label="Village"><button class="chip" data-action="mk-view" data-view="search" aria-pressed="${v !== "trades"}">Chercher une carte</button>
      <button class="chip" data-action="mk-view" data-view="trades" aria-pressed="${v === "trades"}">Mes échanges${incoming ? ` (${incoming})` : ""}</button></div>`;
    if (!S.mk.loaded) return `<h1>Village</h1><p class="empty">Le village n'est pas encore installé (relancez 01_schema.sql dans Supabase).</p>`;
    if (v === "trades") return `<h1>Village</h1>${nav}${marketTradesHTML()}`;
    if (S.mk.playerId) return `<h1>Village</h1>${nav}${marketDeckHTML()}`;
    return `<h1>Village</h1><p class="lede">Deal tes cartes contre une autre carte ou une action.</p><div class="mk-rules"><div class="t-costaud"><span><b>Tu veux une légendaire ?</b> Impossible de l'échanger avec une carte, tu dois proposer une action !</span></div></div>${nav}
      <div class="field"><label for="mq">Rechercher un joueur ou une carte</label><input id="mq" type="search" autocomplete="off" placeholder="Ex. Le Cam, Maxi Edmond de Rothschild, Marie…" value="${esc(S.mk.q)}"></div>
      <div id="mres">${marketSearchHTML()}</div>`;
  }
  function perkCards(list, name) {
    const groups = [["Week-end", []], ["Semaine", []], ["Autres", []]];
    list.forEach((p) => {
      const m = /^(Week-end|Semaine) · (.*)$/.exec(p);
      const g = m ? groups.find((x) => x[0] === m[1]) : groups[2];
      g[1].push([p, m ? m[2] : p]);
    });
    return groups.filter((g) => g[1].length).map((g) => `<div class="perk-group"><h4>${g[0]}</h4><div class="perk-grid">${g[1].map(([full, label]) => `<button type="button" class="perk" data-perk="${esc(full)}" aria-pressed="false">${esc(label)}</button>`).join("")}</div></div>`).join("");
  }
  function openCompose(playerId, cardId) {
    const to = playerById(playerId), want = cardById(cardId);
    const tier = tierOf(want);
    const counts = ownedCounts();
    const mine = S.cards.filter((c) => counts.has(c.id)).sort((x, y) => (counts.get(y.id) - counts.get(x.id)) || x.name.localeCompare(y.name));
    if (!tier && !mine.length) return toast("Tu n'as encore aucune carte à proposer.", true);
    const opts = mine.map((c) => `<option value="${c.id}">${esc(c.name)} (${c.kind === "skipper" ? "skipper" : "bateau"}, ${RAR_LABEL[c.rarity]})${counts.get(c.id) > 1 ? " ×" + counts.get(c.id) : ""}</option>`).join("");
    const list = (S.mk.perks && S.mk.perks[tier || "leger"]) || [];
    const m = document.createElement("div");
    m.className = "modal"; m.setAttribute("role", "dialog");
    m.innerHTML = `<div class="modal-in mk-compose"><h2 style="margin-top:0">Demander à ${esc(to.first_name)}</h2>
      <p>Tu veux : ${cardLabel(want.id)}</p>
      ${tier ? `<p class="tier-note t-${tier}">Carte ${RAR_LABEL[want.rarity].toLowerCase()} : pas d'échange de carte. Choisis une contrepartie <b>${TIER_LABEL[tier]}</b>.</p>`
        : `<div class="field"><label for="mkgive">Je donne</label><select id="mkgive">${opts}</select></div><p class="muted" style="font-size:14px">Un petit extra du week-end est facultatif.</p>`}
      <div class="perks">${perkCards(list)}</div>
      <div class="field"><label for="mkother">Autre : écris ta proposition</label><input id="mkother" maxlength="120" placeholder="Ex. je te paie un café samedi"></div>
      <button class="btn" id="mksend">Envoyer la demande</button><button class="btn alt" id="mkno" style="margin-top:8px">Annuler</button></div>`;
    document.body.appendChild(m);
    let chosen = "";
    const other = m.querySelector("#mkother");
    m.querySelectorAll(".perk").forEach((b) => b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") !== "true";
      m.querySelectorAll(".perk").forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", on ? "true" : "false");
      chosen = on ? b.dataset.perk : ""; if (on) other.value = "";
    }));
    other.addEventListener("input", () => { if (other.value) { chosen = ""; m.querySelectorAll(".perk").forEach((x) => x.setAttribute("aria-pressed", "false")); } });
    m.querySelector("#mkno").addEventListener("click", () => m.remove());
    m.addEventListener("click", (ev) => { if (ev.target === m) m.remove(); });
    m.querySelector("#mksend").addEventListener("click", async () => {
      const btn = m.querySelector("#mksend"); btn.disabled = true;
      let perk = chosen || (other.value.trim() ? "Autre : " + other.value.trim() : "");
      if (tier && !perk) { btn.disabled = false; return toast("Choisis une contrepartie.", true); }
      try {
        await rpc("propose_trade", { p_from: S.me.id, p_to: playerId, p_give: tier ? null : Number(m.querySelector("#mkgive").value), p_want: cardId, p_perk: perk || null });
        m.remove(); S.mk.view = "trades"; S.mk.playerId = null;
        toast("Demande envoyée à " + to.first_name + " !"); await refresh();
      } catch (e) { btn.disabled = false; toast(e.message, true); }
    });
  }

  // --- Admin ---
  function parseQuiz(text) {
    const blocks = text.trim().split(/\n\s*\n/).filter(Boolean);
    if (!blocks.length) throw new Error("Collez au moins une question.");
    return blocks.map((b) => {
      const lines = b.split("\n").map((l) => l.trim()).filter(Boolean);
      let question = lines[0], category = "rhum";
      if (/^\[perso\]/i.test(question)) { category = "perso"; question = question.replace(/^\[perso\]\s*/i, ""); }
      const choices = []; let correct = -1; let explanation = null;
      lines.slice(1).forEach((l) => {
        if (l.startsWith("*")) { correct = choices.length; choices.push(l.slice(1).trim()); }
        else if (l.startsWith("-")) choices.push(l.slice(1).trim());
        else if (l.startsWith(">")) explanation = l.slice(1).trim();
      });
      if (choices.length < 2 || correct < 0) throw new Error("Question mal formée : " + question);
      return { question, choices, correct, category, explanation };
    });
  }

  function adminHTML() {
    if (!S.adminCode) {
      return `<h1>Espace organisateur</h1><div class="panel"><div class="field"><label for="acode">Code organisateur</label><input id="acode" type="password" autocomplete="off"></div>
        <button class="btn" data-action="admin-login">Entrer</button> <button class="btn ghost" data-action="tab" data-tab="score">Retour</button></div>`;
    }
    const players = S.players.map((p) => `<option value="${p.id}">${esc(p.first_name)}</option>`).join("");
    const cardsOpt = S.cards.slice().sort((a, b) => a.name.localeCompare(b.name)).map((c) => `<option value="${c.id}">${esc(c.name)} (${c.kind === "skipper" ? "skipper" : "bateau"}, ${RAR_LABEL[c.rarity]})</option>`).join("");
    const fet = (S.adminData && S.adminData.fetish) || [];
    return `<h1>Espace organisateur</h1>
      <div class="panel"><h3>Publier un quiz</h3>
        <div class="field"><label for="qt">Titre</label><input id="qt" placeholder="Mardi : les bateaux"></div>
        <div class="field"><label for="qb">Questions</label><textarea id="qb" placeholder="Quelle classe compte le plus de skippers ?&#10;- Ultim&#10;* Class40&#10;- IMOCA&#10;&#10;[perso] Qui ronfle le plus ?&#10;* Paul&#10;- Manu&#10;> Explication facultative"></textarea></div>
        <p class="muted" style="font-size:14px;margin-bottom:10px">Une question par bloc, séparée par une ligne vide. * = bonne réponse, - = autre réponse, > = explication.</p>
        <div class="inline"><div class="field"><label for="qk">Type</label><select id="qk"><option value="normal">Normal (cartes et points)</option><option value="hard">Difficile (points et titre)</option></select></div>
          <div class="field"><label for="ql">Niveau minimum</label><select id="ql">${[1, 2, 3, 4, 5].map((n) => `<option value="${n}">${n}${n === 1 ? " (tout le monde)" : ""}</option>`).join("")}</select></div></div>
        <label class="check"><input type="checkbox" id="qn" checked> Prévenir les joueurs par notification</label>
        <button class="btn" data-action="publish-quiz">Publier</button></div>
      <div class="panel"><h3>Lâcher un drop</h3><div class="inline"><div class="field"><label for="dl">Nom</label><input id="dl" value="Drop de midi"></div><div class="field"><label for="dm">Minutes</label><input id="dm" type="number" value="60" min="5"></div></div>
        <div class="inline"><div class="field"><label for="ds">Cartes</label><input id="ds" type="number" value="5" min="1" max="10"></div><div class="field"><label for="dluck">Chance bonus</label><select id="dluck"><option value="0">Non</option><option value="1">Oui</option></select></div></div>
        <button class="btn" data-action="make-drop">Lâcher</button></div>
      <div class="panel"><h3>Donner un booster</h3><div class="inline"><div class="field"><label for="bp">À qui</label><select id="bp"><option value="">Tout le monde</option>${players}</select></div><div class="field"><label for="bs">Cartes</label><input id="bs" type="number" value="5" min="1" max="10"></div></div>
        <div class="field"><label for="bl">Nom</label><input id="bl" value="Cadeau"></div><button class="btn" data-action="give-booster">Donner</button></div>
      <div class="panel"><h3>Offrir une carte</h3><div class="field"><label for="gp">Joueur</label><select id="gp">${players}</select></div>
        <div class="field"><label for="gc">Carte</label><select id="gc">${cardsOpt}</select></div><button class="btn" data-action="give-card">Offrir</button></div>
      <div class="panel"><h3>Carte fétiche</h3><p class="muted" style="font-size:14px;margin-bottom:10px">Chance en % qu'elle sorte à chaque carte tirée par ce joueur. 0 pour retirer.</p>
        <div class="field"><label for="fp">Joueur</label><select id="fp">${players}</select></div><div class="field"><label for="fc">Carte</label><select id="fc">${cardsOpt}</select></div>
        <div class="field"><label for="fx">Chance (%)</label><input id="fx" type="number" value="10" min="0" max="100"></div><button class="btn" data-action="set-fetish">Enregistrer</button>
        ${fet.length ? `<div class="log" style="margin-top:12px">${fet.map((f) => `${esc(f.player)} : ${esc(f.card)} à ${f.chance} %`).join("<br>")}</div>` : ""}</div>
      <div class="panel"><h3>Légendaire éclair</h3><p class="muted" style="font-size:14px;margin-bottom:10px">Une carte légendaire pour le plus rapide. Une seule victoire par joueur.</p>
        <div class="inline"><div class="field"><label for="fl">Nom</label><input id="fl" value="Légendaire éclair"></div><div class="field"><label for="fm">Minutes</label><input id="fm" type="number" value="30" min="1"></div></div>
        <label class="check"><input type="checkbox" id="fn" checked> Prévenir les joueurs par notification</label>
        <button class="btn" data-action="make-flash">Lancer l'éclair</button></div>
      <div class="panel"><h3>Niveaux des joueurs</h3><p class="muted" style="font-size:14px;margin-bottom:10px">De 1 (débutant) à 5 (expert). Invisible pour les autres joueurs. Sert à choisir qui voit un quiz difficile.</p>
        ${((S.admin && S.admin.levels) || []).map((p) => `<div class="lvl"><span>${esc(p.name)}</span><select data-level="${p.id}">${[1, 2, 3, 4, 5].map((n) => `<option value="${n}" ${n === p.level ? "selected" : ""}>${n}</option>`).join("")}</select></div>`).join("") || '<p class="muted">Installez la dernière version de 01_schema.sql.</p>'}</div>
      <div class="panel"><h3>Envoyer une notification</h3>
        <div class="field"><label for="nt">Titre</label><input id="nt" value="Album du Rhum"></div>
        <div class="field"><label for="nb">Message</label><input id="nb" placeholder="Un nouveau quiz vient d'arriver"></div>
        <button class="btn" data-action="send-notif">Envoyer à tous</button></div>
      <div class="panel"><h3>Contreparties du marché</h3><p class="muted" style="font-size:14px;margin-bottom:10px">Une proposition par ligne, commençant par « Week-end · » ou « Semaine · ». Léger pour les cartes épiques, Costaud pour les légendaires. Les joueurs peuvent aussi écrire « Autre ».</p>
        <div class="field"><label for="pkl">Léger</label><textarea id="pkl">${esc(((S.mk.perks || {}).leger || []).join("\n"))}</textarea></div>
        <div class="field"><label for="pkc">Costaud</label><textarea id="pkc">${esc(((S.mk.perks || {}).costaud || []).join("\n"))}</textarea></div><button class="btn" data-action="save-perks">Enregistrer</button></div>
      <div class="panel"><h3>Quiz ouverts</h3>${S.quizzes.filter((z) => z.is_open).map((z) => `<div class="q-card"><div class="grow"><h3>${esc(z.title)}</h3></div><button class="btn small alt" data-action="close-quiz" data-id="${z.id}">Fermer</button></div>`).join("") || '<p class="muted">Aucun.</p>'}</div>
      <button class="btn ghost" data-action="tab" data-tab="score">Quitter l'espace organisateur</button>`;
  }

  // ---------- Rendu principal ----------
  function render() {
    if (!S.me) return renderPicker();
    let inner;
    switch (S.tab) {
      case "quiz": inner = quizHTML(); break;
      case "boosters": inner = boostersHTML(); break;
      case "score": inner = scoreHTML(); break;
      case "marche": inner = marcheHTML(); break;
      case "admin": inner = adminHTML(); break;
      default: inner = albumHTML();
    }
    shell(inner);
  }

  // ---------- Ouverture de booster ----------
  function openOverlay(cardsDrawn, label, bonusCount) {
    bonusCount = bonusCount || 0;
    S.overlay = true;
    const had = new Set(S.mine.map((m) => m.card_id));
    const list = cardsDrawn.map((c) => { const isNew = !had.has(c.id); had.add(c.id); return { c, isNew }; });
    const ov = document.createElement("div");
    ov.className = "ov";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-label", "Ouverture du booster");
    document.body.appendChild(ov);
    let i = 0, flipped = false;

    function stagePack() {
      ov.innerHTML = `<div class="pack" data-ov="tear"><b>${esc(label || "Booster")}</b></div><p class="hint">Touche le booster pour l'ouvrir</p>`;
      ov.querySelector(".pack").addEventListener("click", () => {
        const pk = ov.querySelector(".pack");
        pk.classList.add("tear");
        setTimeout(stageCard, 520);
      }, { once: true });
    }

    function stageCard() {
      flipped = false;
      const it = list[i];
      ov.className = "ov";
      ov.innerHTML = `<div class="ov-count">${i >= list.length - bonusCount ? "Carte bonus : légendaire" : "Carte " + (i + 1) + " sur " + (list.length - bonusCount)}</div>
        <div class="ov-card"><div class="flip" id="flip"><div class="card back"><div class="card-in"><div class="back-mark">RHUM<small>2026</small></div></div></div><div class="face">${cardHTML(it.c, { isNew: it.isNew })}</div></div></div>
        <div class="ov-blurb" id="blurb" hidden><b>${esc(it.c.name)}</b>${esc(it.c.blurb || "Pas encore de description.")}${it.c.length_m ? ` <i>(${esc(it.c.length_m)} m)</i>` : ""}</div>
        <p class="hint" id="hint">Touche la carte pour la retourner</p>`;
      ov.querySelector(".ov-card").addEventListener("click", onTap);
    }

    function onTap() {
      if (!flipped) {
        flipped = true;
        document.getElementById("flip").classList.add("on");
        const bl = document.getElementById("blurb"); if (bl) bl.hidden = false;
        if (list[i].c.rarity === "legendaire") { ov.classList.remove("flash"); void ov.offsetWidth; ov.classList.add("flash"); }
        document.getElementById("hint").textContent = i === list.length - 1 ? "Touche pour voir le résumé" : "Touche pour la carte suivante";
      } else if (i < list.length - 1) { i++; stageCard(); }
      else stageSummary();
    }

    function stageSummary() {
      ov.className = "ov";
      ov.innerHTML = `<div class="ov-count">Ton butin</div><div class="summary">${list.map((it) => cardHTML(it.c, { isNew: it.isNew })).join("")}</div><button class="btn" id="ovdone">Ajouter à mon album</button>`;
      document.getElementById("ovdone").addEventListener("click", async () => {
        ov.remove(); S.overlay = false;
        S.tab = "album";
        await refresh();
      });
    }
    stagePack();
  }

  async function showDrawn(ids, label, bonus) {
    const drawn = ids.map(cardById).filter(Boolean);
    if (!drawn.length) { toast("Cartes introuvables, recharge la page.", true); return; }
    openOverlay(drawn, label, bonus);
  }

  async function doOpen(boosterId, label, bonus) {
    try {
      const ids = await rpc("open_booster", { p_player: S.me.id, p_booster: Number(boosterId) });
      await showDrawn(ids, label, bonus);
    } catch (e) { toast(e.message, true); await refresh(); }
  }

  // ---------- Actions ----------
  const actions = {
    async pick(el) {
      const p = playerById(Number(el.dataset.id));
      try { S.pinFirst = !(await rpc("player_has_pin", { p_player: p.id })); } catch (e) { return toast(e.message, true); }
      S.pinFor = p; render();
    },
    "pin-back"() { S.pinFor = null; render(); },
    async "pin-go"() {
      const p = S.pinFor, pin = (document.getElementById("pin") || {}).value || "";
      if (!/^\d{4}$/.test(pin)) return toast("Le code doit faire 4 chiffres", true);
      try { await rpc("player_login", { p_player: p.id, p_pin: pin }); } catch (e) { return toast(e.message, true); }
      S.me = p; S.pinFor = null;
      try { localStorage.setItem("rhum_player", String(p.id)); localStorage.setItem("rhum_pin", pin); } catch (e) {}
      S.tab = "album"; await doStreak(); await refresh(true); maybeInvite();
    },
    switch() { S.me = null; try { localStorage.removeItem("rhum_player"); localStorage.removeItem("rhum_pin"); } catch (e) {} S.run = null; render(); },
    async tab(el) { S.tab = el.dataset.tab; S.run = null; render(); window.scrollTo(0, 0); if (S.tab === "marche") { try { await loadMarket(); if (S.tab === "marche") render(); } catch (e) {} } },
    filter(el) { S.filters[el.dataset.key] = el.dataset.val; render(); },
    "toggle-missing"() { S.filters.missing = !S.filters.missing; render(); },
    "mk-view"(el) { S.mk.view = el.dataset.view; S.mk.playerId = null; render(); },
    "mk-player"(el) { S.mk.playerId = Number(el.dataset.id); S.mk.view = "search"; render(); window.scrollTo(0, 0); },
    "mk-back"() { S.mk.playerId = null; render(); },
    "mk-want"(el) { openCompose(Number(el.dataset.player || S.mk.playerId), Number(el.dataset.card)); },
    async "mk-accept"(el) {
      const r = await rpc("respond_trade", { p_player: S.me.id, p_trade: Number(el.dataset.id), p_accept: true });
      toast(r === "accepted" ? "C'est fait ! N'oublie pas la contrepartie s'il y en a une." : "Échange impossible : une des cartes n'est plus disponible.", r !== "accepted");
      await refresh();
    },
    async "mk-decline"(el) { await rpc("respond_trade", { p_player: S.me.id, p_trade: Number(el.dataset.id), p_accept: false }); toast("Demande refusée."); await refresh(); },
    async "mk-cancel"(el) { await rpc("cancel_trade", { p_player: S.me.id, p_trade: Number(el.dataset.id) }); toast("Demande annulée."); await refresh(); },
    rules() {
      const m = document.createElement("div");
      m.className = "modal"; m.setAttribute("role", "dialog");
      m.innerHTML = `<div class="modal-in"><h2 style="margin-top:0">Comment sont comptés les points ?</h2>
        <div class="rules-list">
          <div><b class="pq">Quiz</b><span>10 pts par bonne réponse<br><small>20 pts au quiz difficile</small></span></div>
          <div><b class="pc">Cartes</b><span>Commun 1 · Rare 3 · Épique 6 · Légendaire 12<br><small>une seule fois par carte</small></span></div>
          <div><b class="pp">Paires</b><span>Skipper + son bateau = le double de la carte</span></div>
        </div>
        <p class="blurb">Les règles vont évoluer pendant le week-end : le dieu des cartes peut se venger régulièrement !</p>
        <button class="btn alt">Fermer</button></div>`;
      m.addEventListener("click", (ev) => { if (ev.target === m || ev.target.closest(".btn")) m.remove(); });
      document.body.appendChild(m);
    },
    zoom(el) {
      const c = cardById(Number(el.dataset.card));
      const m = document.createElement("div");
      m.className = "modal"; m.setAttribute("role", "dialog");
      m.innerHTML = `<div class="modal-in">${cardHTML(c)}<div class="blurb">${esc(c.blurb || "Pas encore de description.")}${c.length_m ? `<br>Longueur : ${esc(c.length_m)} m` : ""}</div><button class="btn alt">Fermer</button></div>`;
      m.addEventListener("click", (ev) => { if (ev.target === m || ev.target.closest(".btn")) m.remove(); });
      document.body.appendChild(m);
    },
    "start-quiz"(el) {
      const quiz = S.quizzes.find((z) => z.id === Number(el.dataset.id));
      const qs = quizQuestions(quiz.id);
      if (!qs.length) return toast("Ce quiz n'a pas de questions.", true);
      S.run = { quiz, qs, i: 0, answers: [], result: null }; render(); window.scrollTo(0, 0);
    },
    answer(el) { S.run.answers[S.run.i] = Number(el.dataset.i); render(); },
    "prev-q"() { S.run.i--; render(); },
    async "next-q"() {
      const r = S.run;
      if (r.i < r.qs.length - 1) { r.i++; render(); return; }
      try {
        const arr = r.qs.map((_, k) => (r.answers[k] == null ? null : r.answers[k]));
        r.result = await rpc("submit_quiz", { p_player: S.me.id, p_quiz: r.quiz.id, p_answers: arr });
        await load(); render(); window.scrollTo(0, 0);
      } catch (e) { toast(e.message, true); S.run = null; await refresh(); }
    },
    async "quiz-done"() { S.run = null; await refresh(); },
    async "open-from-quiz"(el) { S.run = null; S.tab = "boosters"; await doOpen(el.dataset.id, "Booster du quiz", Number(el.dataset.bonus || 0)); },
    async open(el) { const b = S.boosters.find((x) => x.id === Number(el.dataset.id)); await doOpen(el.dataset.id, b ? b.label : "Booster", b ? b.bonus_legendary : 0); },
    async "open-daily"(el) {
      try {
        const ids = await rpc("open_daily", { p_player: S.me.id, p_slot: el.dataset.slot });
        await showDrawn(ids, "Booster espresso " + fmtSlot(el.dataset.slot), 0);
      } catch (e) { toast(e.message, true); await refresh(); }
    },
    async "claim-flash"(el) {
      try {
        const cid = await rpc("claim_flash", { p_player: S.me.id, p_flash: Number(el.dataset.id) });
        await load();
        await showDrawn([cid], "Légendaire éclair", 0);
      } catch (e) { toast(e.message, true); await refresh(); }
    },
    async claim(el) {
      try { await rpc("claim_drop", { p_player: S.me.id, p_drop: Number(el.dataset.id) }); toast("Booster récupéré."); await refresh(); }
      catch (e) { toast(e.message, true); await refresh(); }
    },
    admin() { S.tab = "admin"; render(); },
    async "admin-login"() {
      const code = document.getElementById("acode").value;
      try {
        const ok = await rpc("admin_check", { p_code: code });
        if (!ok) throw new Error("Code incorrect.");
        S.adminCode = code; sessionStorage.setItem("rhum_admin", code); await loadAdmin(); render();
      } catch (e) { toast(e.message, true); }
    },
    async "publish-quiz"() {
      try {
        const title = document.getElementById("qt").value.trim();
        if (!title) throw new Error("Donnez un titre au quiz.");
        const parsed = parseQuiz(document.getElementById("qb").value);
        const kind = document.getElementById("qk").value, lvl = Number(document.getElementById("ql").value);
        await rpc("admin_publish_quiz", { p_code: S.adminCode, p_title: title, p_questions: parsed, p_kind: kind, p_min_level: kind === "hard" ? lvl : 1 });
        toast(`Quiz publié (${parsed.length} questions).`);
        if (document.getElementById("qn") && document.getElementById("qn").checked) notify("Nouveau quiz", kind === "hard" ? "Un quiz difficile vient d'arriver : " + title : title);
        await refresh();
      } catch (e) { toast(e.message, true); }
    },
    async "make-drop"() {
      try {
        await rpc("admin_create_drop", { p_code: S.adminCode, p_label: document.getElementById("dl").value || "Drop", p_size: Number(document.getElementById("ds").value), p_minutes: Number(document.getElementById("dm").value), p_luck: Number(document.getElementById("dluck").value) });
        toast("Drop lâché. Prévenez le groupe."); await refresh();
      } catch (e) { toast(e.message, true); }
    },
    async "give-booster"() {
      try {
        const v = document.getElementById("bp").value;
        const n = await rpc("admin_grant_booster", { p_code: S.adminCode, p_player: v ? Number(v) : null, p_label: document.getElementById("bl").value || "Cadeau", p_size: Number(document.getElementById("bs").value), p_luck: 0 });
        toast(`${n} booster${n > 1 ? "s" : ""} donné${n > 1 ? "s" : ""}.`); await refresh();
      } catch (e) { toast(e.message, true); }
    },
    async "give-card"() {
      try {
        await rpc("admin_grant_card", { p_code: S.adminCode, p_player: Number(document.getElementById("gp").value), p_card: Number(document.getElementById("gc").value) });
        toast("Carte offerte."); await refresh();
      } catch (e) { toast(e.message, true); }
    },
    async "save-perks"() {
      const f = (id) => document.getElementById(id).value.split("\n").map((x) => x.trim().replace(/\|/g, "/")).filter(Boolean).join("|");
      await rpc("admin_set_perks", { p_code: S.adminCode, p_leger: f("pkl"), p_costaud: f("pkc") });
      toast("Contreparties enregistrées."); await refresh();
    },
    async "make-flash"() {
      try {
        const label = document.getElementById("fl").value || "Légendaire éclair";
        await rpc("admin_create_flash", { p_code: S.adminCode, p_label: label, p_minutes: Number(document.getElementById("fm").value) });
        toast("Éclair lancé !");
        if (document.getElementById("fn") && document.getElementById("fn").checked) notify("Légendaire éclair", "Le plus rapide gagne une carte légendaire. Vite !");
        await refresh();
      } catch (e) { toast(e.message, true); }
    },
    async "send-notif"() {
      const r = await notify(document.getElementById("nt").value || "Album du Rhum", document.getElementById("nb").value || "Du nouveau dans le jeu", true);
      if (r) toast(r);
    },
    async "set-fetish"() {
      try {
        await rpc("admin_set_fetish", { p_code: S.adminCode, p_player: Number(document.getElementById("fp").value), p_card: Number(document.getElementById("fc").value), p_chance: Number(document.getElementById("fx").value) });
        toast("Carte fétiche enregistrée."); await loadAdmin(); render();
      } catch (e) { toast(e.message, true); }
    },
    async "close-quiz"(el) {
      try { await rpc("admin_close_quiz", { p_code: S.adminCode, p_quiz: Number(el.dataset.id) }); toast("Quiz fermé."); await refresh(); }
      catch (e) { toast(e.message, true); }
    }
  };

  async function loadAdmin() {
    try { S.adminData = { fetish: await rpc("admin_fetish_list", { p_code: S.adminCode }) }; } catch (e) { S.adminData = { fetish: [] }; }
    try { S.admin.levels = await rpc("admin_levels", { p_code: S.adminCode }); } catch (e) { S.admin.levels = []; }
  }

  // Envoie une notification push à tous via la fonction Supabase "send-push" (voir LISEZ-MOI)
  async function notify(title, body, verbose) {
    try {
      const res = await fetch(CFG.SUPABASE_URL.replace(/\/$/, "") + "/functions/v1/send-push", {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: CFG.SUPABASE_ANON_KEY, Authorization: "Bearer " + CFG.SUPABASE_ANON_KEY },
        body: JSON.stringify({ code: S.adminCode, title, body })
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "erreur " + res.status);
      const msg = `Notification envoyée à ${j.sent || 0} ${plural(j.sent || 0, "appareil", "appareils")}.`;
      if (verbose) return msg; toast(msg); return msg;
    } catch (e) {
      const msg = "Notification non envoyée (" + e.message + "). La fonction send-push est-elle installée ?";
      toast(msg, true); return null;
    }
  }

  app.addEventListener("change", async (ev) => {
    const el = ev.target;
    if (el && el.dataset && el.dataset.level) {
      try { await rpc("admin_set_level", { p_code: S.adminCode, p_player: Number(el.dataset.level), p_level: Number(el.value) }); toast("Niveau enregistré."); }
      catch (e) { toast(e.message, true); }
    }
  });

  app.addEventListener("input", (ev) => {
    if (ev.target && ev.target.id === "mq") {
      S.mk.q = ev.target.value;
      const r = document.getElementById("mres"); if (r) r.innerHTML = marketSearchHTML();
    }
  });

  app.addEventListener("click", async (ev) => {
    const el = ev.target.closest("[data-action]");
    if (!el || !app.contains(el)) return;
    const fn = actions[el.dataset.action];
    if (!fn) return;
    try { await fn(el); } catch (e) { toast(e.message || "Erreur", true); }
  });

  async function doStreak() {
    try {
      const r = await rpc("touch_streak", { p_player: S.me.id });
      S.streak = r;
      if (r && r.bonus) toast(`Série de ${r.streak} jours : une carte bonus t'attend dans Boosters.`);
    } catch (e) { /* série pas encore installée */ }
  }

  async function refresh() {
    try { await load(); } catch (e) { toast(e.message, true); }
    render();
  }


  // ---------- Notifications : ajout à l'écran d'accueil + push ----------
  const VAPID_PUBLIC_KEY = CFG.VAPID_PUBLIC_KEY || "BK99JFG5bgQsffvfrWWvQ3jFgNlaoPB_OZBXIezjYLrbhCZga-errNjuw8KyO5_dPu1t_pQzyyrdmv-lZpo3q-g";
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isStandalone = () => window.navigator.standalone === true || (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
  const urlB64 = (s) => { const p = "=".repeat((4 - (s.length % 4)) % 4); const b = (s + p).replace(/-/g, "+").replace(/_/g, "/"); const r = atob(b); return Uint8Array.from([...r].map((c) => c.charCodeAt(0))); };

  async function pushState() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return "unsupported";
    if (Notification.permission === "denied") return "denied";
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = reg && (await reg.pushManager.getSubscription());
      return sub ? "subscribed" : "ready";
    } catch (e) { return "unsupported"; }
  }
  async function saveSub(sub) {
    const j = sub.toJSON();
    await rpc("save_push_sub", { p_player: S.me.id, p_endpoint: j.endpoint, p_p256dh: j.keys.p256dh, p_auth: j.keys.auth });
  }
  async function enablePush() {
    const perm = await Notification.requestPermission();
    if (perm !== "granted") throw new Error("Notifications refusées. Tu pourras les activer dans les réglages du téléphone.");
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64(VAPID_PUBLIC_KEY) });
    await saveSub(sub);
  }
  function later(days) { try { localStorage.setItem("rhum_invite", String(Date.now() + (days || 1) * 86400000)); } catch (e) {} }

  async function maybeInvite() {
    if (!S.me || document.querySelector(".invite")) return;
    let flag = ""; try { flag = localStorage.getItem("rhum_invite") || ""; } catch (e) {}
    const st = await pushState();
    // déjà abonné : on rattache simplement cet appareil au joueur connecté
    if (st === "subscribed") {
      try { const reg = await navigator.serviceWorker.getRegistration(); await saveSub(await reg.pushManager.getSubscription()); } catch (e) {}
      return;
    }
    if (flag === "never" || (flag && Number(flag) > Date.now())) return;
    const needInstall = isIOS() && !isStandalone();
    if (!needInstall && (st !== "ready" || !VAPID_PUBLIC_KEY)) return;
    const m = document.createElement("div");
    m.className = "modal invite"; m.setAttribute("role", "dialog");
    m.innerHTML = needInstall
      ? `<div class="modal-in"><h2 style="margin-top:0">Ajoute l'album à ton écran d'accueil</h2>
          <p>Sur iPhone, les notifications ne marchent qu'une fois l'album ajouté à l'écran d'accueil. Trois gestes :</p>
          <ol class="steps"><li>Touche le bouton <b>Partager</b> (le carré avec une flèche) dans Safari.</li><li>Choisis <b>Sur l'écran d'accueil</b>, puis <b>Ajouter</b>.</li><li>Ouvre l'album depuis sa nouvelle icône : l'activation des notifications te sera proposée là.</li></ol>
          <button class="btn" id="inv-ok">J'ai compris</button></div>`
      : `<div class="modal-in"><h2 style="margin-top:0">Activer les notifications ?</h2>
          <p>Sois prévenu des nouveaux quiz, des <b>légendaires éclair</b> (le plus rapide gagne) et des demandes du village.</p>
          <button class="btn" id="inv-on">Activer les notifications</button>
          <button class="btn alt" id="inv-later" style="margin-top:8px">Plus tard</button></div>`;
    document.body.appendChild(m);
    const close = () => m.remove();
    const ok = m.querySelector("#inv-ok"); if (ok) ok.addEventListener("click", () => { later(1); close(); });
    const lt = m.querySelector("#inv-later"); if (lt) lt.addEventListener("click", () => { later(1); close(); });
    const on = m.querySelector("#inv-on");
    if (on) on.addEventListener("click", async () => {
      on.disabled = true;
      try { await enablePush(); toast("Notifications activées."); close(); }
      catch (e) { toast(e.message, true); on.disabled = false; }
    });
  }
  if ("serviceWorker" in navigator) window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });

  // ---------- Démarrage ----------
  async function start() {
    if (!CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY) return renderSetup();
    if (!window.supabase) { app.innerHTML = '<div class="setup"><h1>Connexion impossible.</h1><p class="lede">La bibliothèque Supabase ne s\'est pas chargée. Vérifiez votre connexion et recharge la page.</p></div>'; return; }
    S.sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
    const saved = Number(localStorage.getItem("rhum_player"));
    S.adminCode = sessionStorage.getItem("rhum_admin");
    try { await load(); } catch (e) {
      app.innerHTML = `<div class="setup"><h1>Impossible de lire la base.</h1><p class="lede">${esc(e.message)}</p></div>`; return;
    }
    S.me = S.players.find((p) => p.id === saved) || null;
    if (S.me) {
      let pin = ""; try { pin = localStorage.getItem("rhum_pin") || ""; } catch (e) {}
      try { await rpc("player_login", { p_player: S.me.id, p_pin: pin }); } catch (e) { S.me = null; }
    }
    if (S.me) { await doStreak(); await load(); }
    if (S.adminCode) loadAdmin();
    render();
    if (S.me) maybeInvite();
    setInterval(() => {
      if (document.hidden || S.overlay || S.run || !S.me || S.tab === "admin") return;
      refresh();
    }, 45000);
    setInterval(async () => {
      if (document.hidden || !S.me || S.overlay || S.run || S.tab === "admin") return;
      const sig = () => JSON.stringify(S.flash.map((f) => [f.id, f.winner_player]));
      const before = sig();
      try { await loadFlash(); } catch (e) { return; }
      if (sig() !== before) render();
    }, 15000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && S.me && !S.overlay && !S.run && S.tab !== "admin") refresh();
    });
  }

  start();
})();
