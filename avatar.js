// Avatars illustrés de face (style aplat), générés depuis les caractéristiques de chaque joueur.
(function () {
  const SHADE = (c) => c; // réservé
  function faceShape(face) {
    switch (face) {
      case "round": return { rx: 30, ry: 31, jaw: 1 };
      case "full": return { rx: 31, ry: 31, jaw: 0.95 };
      case "thin": return { rx: 24, ry: 34, jaw: 0.8 };
      default: return { rx: 27, ry: 33, jaw: 0.9 };
    }
  }
  function hairBack(st, c) {
    switch (st) {
      case "long": return `<path d="M19 54 Q15 12 50 10 Q85 12 81 54 L84 94 L16 94Z" fill="${c}"/>`;
      case "medium": return `<path d="M20 52 Q17 12 50 10 Q83 12 80 52 L81 80 Q72 72 66 70 L34 70 Q28 72 19 80Z" fill="${c}"/>`;
      case "curlylong": return `<g fill="${c}"><circle cx="22" cy="44" r="12"/><circle cx="19" cy="60" r="12"/><circle cx="23" cy="76" r="11"/><circle cx="78" cy="44" r="12"/><circle cx="81" cy="60" r="12"/><circle cx="77" cy="76" r="11"/><circle cx="50" cy="22" r="26"/></g>`;
      case "curly": return `<g fill="${c}"><circle cx="50" cy="26" r="27"/><circle cx="24" cy="44" r="10"/><circle cx="76" cy="44" r="10"/></g>`;
      case "receding": return `<path d="M21 50 Q19 16 50 14 Q81 16 79 50 L80 70 L68 62 L32 62 L20 70Z" fill="${c}"/>`;
      default: return "";
    }
  }
  function hairFront(st, c, hi) {
    const h = `<path d="M30 24 Q40 16 52 18" stroke="${hi}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".55"/>`;
    switch (st) {
      case "long": return `<path d="M21 52 Q18 14 50 12 Q82 14 79 52 Q76 36 64 30 Q56 36 38 30 Q26 38 21 52Z" fill="${c}"/>${h}`;
      case "medium": return `<path d="M22 50 Q20 14 50 12 Q80 14 78 50 Q74 36 62 29 Q54 38 40 30 Q28 36 22 50Z" fill="${c}"/>${h}`;
      case "short": return `<path d="M23 46 Q21 12 50 10 Q79 12 77 46 Q73 32 60 28 Q46 34 34 28 Q26 34 23 46Z" fill="${c}"/>${h}`;
      case "curly": return `<g fill="${c}"><circle cx="31" cy="30" r="10"/><circle cx="43" cy="22" r="11"/><circle cx="57" cy="22" r="11"/><circle cx="69" cy="30" r="10"/><circle cx="25" cy="42" r="7"/><circle cx="75" cy="42" r="7"/></g>`;
      case "curlylong": return `<g fill="${c}"><circle cx="32" cy="30" r="10"/><circle cx="44" cy="22" r="11"/><circle cx="57" cy="22" r="11"/><circle cx="69" cy="30" r="10"/><circle cx="25" cy="44" r="7"/><circle cx="75" cy="44" r="7"/></g>`;
      case "curlyshort": return `<g fill="${c}"><circle cx="33" cy="30" r="8.5"/><circle cx="44" cy="24" r="9.5"/><circle cx="56" cy="24" r="9.5"/><circle cx="67" cy="30" r="8.5"/><circle cx="26" cy="40" r="6"/><circle cx="74" cy="40" r="6"/></g>`;
      case "receding": return `<path d="M23 48 Q21 20 36 16 Q40 28 44 30 Q50 24 56 30 Q60 28 64 16 Q79 20 77 48 Q73 36 66 34 L58 38 L50 33 L42 38 L34 34 Q27 38 23 48Z" fill="${c}"/>`;
      case "fine": return `<path d="M24 46 Q20 12 52 9 Q80 10 77 44 Q75 30 66 25 Q56 30 44 27 Q34 29 30 40 Q27 42 24 46Z" fill="${c}"/><path d="M44 27 Q56 22 70 27" stroke="${hi}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/><path d="M32 30 Q40 20 52 18" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      case "swept": return `<path d="M22 48 Q18 10 54 8 Q84 10 78 46 Q74 30 60 24 Q44 26 36 34 Q28 36 22 48Z" fill="${c}"/>${h}`;
      default: return "";
    }
  }
  function top(a, skinShade) {
    const col = a.top || "#DA532C";
    const k = a.kind || "tee";
    let body = `<path d="M8 104 Q10 80 50 78 Q90 80 92 104Z" fill="${col}"/>`;
    let extra = "";
    if (k === "stripes") extra = `<g clip-path="url(#bc)" stroke="${a.top2 || "#fff"}" stroke-width="3.4">${[82, 87, 92, 97, 102].map((y) => `<path d="M0 ${y} H100"/>`).join("")}</g>`;
    if (k === "floral") extra = `<g clip-path="url(#bc)">${[[22, 88], [36, 96], [50, 90], [64, 98], [78, 88], [30, 102], [70, 104], [14, 98], [86, 98]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="3" fill="${i % 2 ? "#F5C518" : "#2FA66A"}"/>`).join("")}</g>`;
    if (k === "hawaii") extra = `<g clip-path="url(#bc)">${[[22, 90], [36, 98], [62, 92], [78, 100], [14, 100], [86, 92]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="3.4" fill="${i % 2 ? "#F5C518" : "#FFF"}"/>`).join("")}<path d="M34 82 Q50 100 66 82" stroke="#E83F8C" stroke-width="4.5" fill="none" stroke-dasharray="1 5" stroke-linecap="round"/></g>`;
    if (k === "jacket") extra = `<path d="M50 80 V104" stroke="${a.top2 || "#00000033"}" stroke-width="2"/><path d="M36 80 L50 98 L64 80" fill="${skinShade}"/>`;
    if (k === "shirt") extra = `<path d="M38 79 L50 92 L62 79" fill="${skinShade}"/><path d="M36 78 L50 96 L40 104 L28 90Z M64 78 L50 96 L60 104 L72 90Z" fill="${col}" stroke="#0002" stroke-width="1"/>`;
    if (k === "scarf") extra = `<path d="M30 80 Q50 92 70 80 L72 88 Q50 100 28 88Z" fill="#DA532C"/><circle cx="50" cy="96" r="3.2" fill="#F5C518"/>`;
    if (k === "ruffle") extra = `<path d="M30 80 Q36 90 44 82 Q50 92 56 82 Q64 90 70 80" fill="${a.top2 || "#fff2"}" stroke="${a.top2 || "#fff4"}" stroke-width="1.5"/>`;
    if (k === "henley") extra = `<path d="M44 80 V90" stroke="#0003" stroke-width="1.6"/><circle cx="50" cy="84" r="1" fill="#0005"/>`;
    const collar = k === "tee" || k === "stripes" || k === "floral" || k === "henley" ? `<path d="M40 79 Q50 90 60 79" fill="${skinShade}"/>` : "";
    return `<clipPath id="bc"><path d="M8 104 Q10 80 50 78 Q90 80 92 104Z"/></clipPath>${body}${extra}${collar}`;
  }
  function render(av, size) {
    const a = av || {};
    const skin = a.skin || "#EBC3A0", shade = "#D49B78";
    const hair = a.hair || "#4A3426";
    const hi = a.hi || "#FFFFFF";
    const eyes = a.eyes || "#6B4423";
    const st = a.style || "short";
    const f = faceShape(a.face);
    const fy = 54, L = 50 - f.rx, R = 50 + f.rx;
    const ex = 11.5, ey = fy - 3;
    const P = [];
    const id = "c" + Math.random().toString(36).slice(2, 7);
    P.push(`<defs><clipPath id="${id}"><circle cx="50" cy="50" r="50"/></clipPath><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a.bg || "#4036A0"}"/><stop offset="1" stop-color="${a.bg2 || "#1A1349"}"/></linearGradient></defs>`);
    P.push(`<g clip-path="url(#${id})"><rect width="100" height="100" fill="url(#${id}g)"/>`);
    P.push(hairBack(st, hair));
    P.push(`<path d="M40 70 H60 V84 Q50 90 40 84Z" fill="${shade}"/>`);
    P.push(top(a, shade));
    P.push(`<ellipse cx="${L + 1}" cy="${fy + 3}" rx="4.6" ry="6.5" fill="${skin}"/><ellipse cx="${R - 1}" cy="${fy + 3}" rx="4.6" ry="6.5" fill="${skin}"/>`);
    if (a.earring) P.push(`<circle cx="${L + 1}" cy="${fy + 11}" r="3" fill="none" stroke="#F5C518" stroke-width="1.7"/>`);
    P.push(`<path d="M${L} ${fy - 6} Q${L} ${fy + f.ry * f.jaw + 6} 50 ${fy + f.ry * f.jaw + 8} Q${R} ${fy + f.ry * f.jaw + 6} ${R} ${fy - 6} Q${R} ${fy - f.ry} 50 ${fy - f.ry} Q${L} ${fy - f.ry} ${L} ${fy - 6}Z" fill="${skin}"/>`);
    if (a.beard === "short") P.push(`<path d="M${L + 2} ${fy + 6} Q${L + 3} ${fy + f.ry * f.jaw + 1} 50 ${fy + f.ry * f.jaw + 3} Q${R - 3} ${fy + f.ry * f.jaw + 1} ${R - 2} ${fy + 6} Q${R - 6} ${fy + 15} 50 ${fy + 16} Q${L + 6} ${fy + 15} ${L + 2} ${fy + 6}Z" fill="${hair}" opacity=".92"/>/>`);
    else if (a.beard) P.push(`<path d="M${L + 1} ${fy + 2} Q${L + 3} ${fy + f.ry * f.jaw + 3} 50 ${fy + f.ry * f.jaw + 6} Q${R - 3} ${fy + f.ry * f.jaw + 3} ${R - 1} ${fy + 2} Q${R - 6} ${fy + 12} 50 ${fy + 13} Q${L + 6} ${fy + 12} ${L + 1} ${fy + 2}Z" fill="${hair}"/>`);
    P.push(`<ellipse cx="${L + 8}" cy="${fy + 8}" rx="5" ry="3" fill="#E8836A" opacity=".28"/><ellipse cx="${R - 8}" cy="${fy + 8}" rx="5" ry="3" fill="#E8836A" opacity=".28"/>`);
    if (a.sides) P.push(`<path d="M${L - 1} ${fy - 12} Q${L - 6} ${fy + 20} ${L - 2} ${fy + 34} L${L + 5} ${fy + 30} Q${L + 3} ${fy + 8} ${L + 5} ${fy - 14}Z" fill="${hair}"/><path d="M${R + 1} ${fy - 12} Q${R + 6} ${fy + 20} ${R + 2} ${fy + 34} L${R - 5} ${fy + 30} Q${R - 3} ${fy + 8} ${R - 5} ${fy - 14}Z" fill="${hair}"/>`);
    P.push(hairFront(st, hair, hi));
    // yeux
    const brow = a.brow || hair;
    P.push(`<ellipse cx="${50 - ex}" cy="${ey}" rx="4.6" ry="3.6" fill="#fff"/><ellipse cx="${50 + ex}" cy="${ey}" rx="4.6" ry="3.6" fill="#fff"/>`);
    P.push(`<circle cx="${50 - ex}" cy="${ey + .2}" r="2.7" fill="${eyes}"/><circle cx="${50 + ex}" cy="${ey + .2}" r="2.7" fill="${eyes}"/><circle cx="${50 - ex}" cy="${ey + .2}" r="1.2" fill="#111"/><circle cx="${50 + ex}" cy="${ey + .2}" r="1.2" fill="#111"/><circle cx="${50 - ex + 1}" cy="${ey - 1}" r=".8" fill="#fff"/><circle cx="${50 + ex + 1}" cy="${ey - 1}" r=".8" fill="#fff"/>`);
    P.push(`<path d="M${50 - ex - 6} ${ey - 5.5} Q${50 - ex} ${ey - 8.5} ${50 - ex + 6} ${ey - 6} M${50 + ex - 6} ${ey - 6} Q${50 + ex} ${ey - 8.5} ${50 + ex + 6} ${ey - 5.5}" stroke="${brow}" stroke-width="2.3" fill="none" stroke-linecap="round"/>`);
    P.push(`<path d="M50 ${fy - 1} Q47 ${fy + 8} 48.5 ${fy + 9.5} Q50 ${fy + 11} 53 ${fy + 9}" stroke="${shade}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
    const my = fy + 17;
    if (a.mustache) P.push(`<path d="M37 ${my - 1} Q44 ${my - 6} 50 ${my - 2} Q56 ${my - 6} 63 ${my - 1} Q57 ${my + 3} 50 ${my + 1} Q43 ${my + 3} 37 ${my - 1}Z" fill="${hair}"/>`);
    P.push(`<path d="M42.5 ${my + 1.5} Q50 ${my + 8} 57.5 ${my + 1.5} Q50 ${my + 3.5} 42.5 ${my + 1.5}Z" fill="#fff" stroke="#A8554A" stroke-width="1.5" stroke-linejoin="round"/>`);
    if (a.glasses) P.push(`<g fill="rgba(255,255,255,.16)" stroke="#1C1A1F" stroke-width="1.9"><${a.round ? 'circle cx="' + (50 - ex) + '" cy="' + ey + '" r="8.2"' : 'rect x="' + (50 - ex - 9) + '" y="' + (ey - 6.5) + '" width="18" height="13" rx="4.5"'}/><${a.round ? 'circle cx="' + (50 + ex) + '" cy="' + ey + '" r="8.2"' : 'rect x="' + (50 + ex - 9) + '" y="' + (ey - 6.5) + '" width="18" height="13" rx="4.5"'}/><path d="M${50 - ex + 9} ${ey - 1} Q50 ${ey - 3} ${50 + ex - 9} ${ey - 1}" fill="none"/></g>`);
    P.push(`</g><circle cx="50" cy="50" r="49.2" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="1.6"/>`);
    return `<svg class="avatar" width="${size}" height="${size}" viewBox="0 0 100 100" role="img" aria-hidden="true">${P.join("")}</svg>`;
  }
  window.RhumAvatar = { render };
  if (typeof module !== "undefined") module.exports = window.RhumAvatar;
})();
