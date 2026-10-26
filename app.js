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
    mk: { view: "search", playerId: null, q: "", decks: [], trades: [], perks: [], loaded: false }
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
    }
  }

  async function loadMarket() {
    const [decks, perks, trades] = await Promise.all([
      rpc("market_decks", {}), rpc("market_perks", {}),
      q(S.sb.from("trades").select("*").order("id", { ascending: false }).limit(300))
    ]);
    S.mk.decks = decks; S.mk.perks = perks; S.mk.trades = trades; S.mk.loaded = true;
  }

  // ---------- Dessins ----------
  function pennants() {
    let p = "";
    for (let i = 0; i < 24; i++) p += `<polygon points="${i * 10},0 ${i * 10 + 10},0 ${i * 10 + 5},9" fill="${FLAGS[i % 4]}"/>`;
    return `<svg class="pennants" viewBox="0 0 240 9" preserveAspectRatio="none" aria-hidden="true">${p}</svg>`;
  }

  function boatArt(cls) {
    const info = clsInfo(cls);
    const hull = "#1A1349";
    if (info.multi) {
      return `<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M64 6 L64 56 L104 56Z" fill="#fff"/><path d="M60 16 L60 56 L34 56Z" fill="rgba(255,255,255,.75)"/><path d="M14 60 H112 Q106 70 94 70 H34 Q22 70 14 60Z" fill="${hull}"/><path d="M8 80 H46 Q42 86 34 86 H14Z" fill="${hull}"/><path d="M78 80 H116 Q112 86 104 86 H84Z" fill="${hull}"/><path d="M30 70 L22 80 M96 70 L98 80" stroke="${hull}" stroke-width="2.5"/></svg>`;
    }
    return `<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M62 6 L62 62 L104 62Z" fill="#fff"/><path d="M57 14 L57 62 L26 62Z" fill="rgba(255,255,255,.75)"/><path d="M12 66 H110 Q102 82 80 82 H36 Q20 82 12 66Z" fill="${hull}"/><path d="M12 66 H110" stroke="${info.color}" stroke-width="3"/></svg>`;
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
      return `<${tag} class="card missing r-${c.rarity}" style="--cc:${info.color}"${attrs} aria-label="Carte à trouver : ${esc(RAR_LABEL[c.rarity])}, ${esc(c.class)}"><div class="card-in">
        <div class="card-top"><span class="card-class">${esc(c.class)}</span><span class="card-val">${val}<small>pts</small></span></div>
        <div class="card-art">?</div>
        <div class="card-name">À trouver</div>
        <div class="card-sub">${c.kind === "skipper" ? "Le skipper" : "Le bateau"}</div>
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
      <p class="lede" style="text-align:center">${first ? "Première connexion : choisissez votre code à 4 chiffres. Vous le retaperez à chaque appareil." : "Entrez votre code à 4 chiffres."}</p>
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
      <p class="lede">Vous êtes qui ?</p>
      <div class="who-grid">${S.players.map((p) => `<button class="who" data-action="pick" data-id="${p.id}">${window.RhumAvatar.render(p.avatar, 72)}<span>${esc(p.first_name)}</span></button>`).join("")}</div></div>`;
  }

  function myScore() {
    return S.scores.find((s) => S.me && s.player_id === S.me.id) || { total: 0 };
  }

  function shell(inner) {
    const pending = S.boosters.length + availableDrops().length + S.daily.filter((d) => d.state === "ready").length;
    const todo = openQuizzes().length;
    const tabs = [["album", "Album"], ["quiz", "Quiz"], ["boosters", "Boosters"], ["score", "Score"], ["marche", "Marché"]];
    const incoming = S.mk.trades.filter((t) => t.to_player === S.me.id && t.status === "pending").length;
    const badge = { quiz: todo, boosters: pending, marche: incoming };
    app.innerHTML = `<header class="top"><div class="top-row">
        <button class="top-who" data-action="switch" aria-label="Changer de joueur">${window.RhumAvatar.render(S.me.avatar, 44)}
          <span><span class="top-name">${esc(S.me.first_name)}</span><br><span class="top-sub">Changer de joueur</span></span></button>
        <div class="top-score"><b>${myScore().total}</b><span>points</span></div></div>${pennants()}</header>
      <main id="view" class="view">${inner}</main>
      <nav class="tabbar" aria-label="Navigation"><div class="tabbar-in">${tabs.map(([k, l]) => `<button class="tab" data-action="tab" data-tab="${k}" ${S.tab === k ? 'aria-current="page"' : ""}>${l}${badge[k] ? `<span class="dot" aria-label="${badge[k]} à faire">${badge[k]}</span>` : ""}</button>`).join("")}</div></nav>`;
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

    return `<h1>Mon album</h1>
      <div class="stats"><div><b>${have}/${totalCards}</b><span>cartes</span></div><div><b>${pairs}</b><span>${plural(pairs, "paire", "paires")}</span></div></div>
      <div class="progress" role="img" aria-label="${pct} % de l'album"><i style="width:${pct}%"></i></div>
      <div class="chips" role="group" aria-label="Filtrer par classe">${chips([["all", "Toutes"]].concat(classes.map((c) => [c, esc(c)])), "cls")}</div>
      <div class="chips" role="group" aria-label="Filtrer par rareté">${chips([["all", "Toutes raretés"]].concat(RAR.map((r) => [r, RAR_LABEL[r]])), "rar")}
        <button class="chip" data-action="toggle-missing" aria-pressed="${f.missing}">Paires à compléter</button></div>
      ${rows || '<p class="empty">Aucune carte ne correspond à ce filtre.</p>'}`;
  }

  // --- Quiz ---
  function openQuizzes() {
    const done = new Set(S.subs.map((s) => s.quiz_id));
    return S.quizzes.filter((z) => z.is_open && !done.has(z.id));
  }
  function quizQuestions(id) { return S.questions.filter((x) => x.quiz_id === id).sort((a, b) => a.position - b.position); }

  function quizHTML() {
    if (S.run) return quizRunHTML();
    const todo = openQuizzes();
    const done = S.quizzes.filter((z) => S.subs.some((s) => s.quiz_id === z.id));
    return `<h1>Quiz du jour</h1><p class="lede">Chaque bonne réponse vous rapporte une carte et 10 points. Un sans-faute ajoute une carte légendaire.</p>
      ${todo.length ? todo.map((z) => `<div class="q-card"><div class="grow"><h3>${esc(z.title)}</h3><span class="muted">${quizQuestions(z.id).length} questions</span></div><button class="btn small" data-action="start-quiz" data-id="${z.id}">Répondre</button></div>`).join("") :
        '<p class="empty">Pas de nouveau quiz pour l\'instant. Le prochain arrive demain matin.</p>'}
      ${done.length ? `<h2>Déjà fait</h2>${done.map((z) => { const s = S.subs.find((x) => x.quiz_id === z.id); return `<div class="q-card"><div class="grow"><h3>${esc(z.title)}</h3></div><b style="font:800 30px/1 var(--display)">${s.score}/${s.total}</b></div>`; }).join("")}` : ""}`;
  }

  function quizRunHTML() {
    const r = S.run;
    if (r.result) {
      const res = r.result;
      const qs = r.qs;
      return `<p class="q-step">${esc(r.quiz.title)}</p><div class="result-score">${res.score}<small>/${res.total}</small></div>
        <p class="lede" style="margin-top:8px">${res.score === 0 ? "Aucune carte cette fois. Rendez-vous demain." : res.booster_id ? `Booster gagné : ${Math.min(res.score, 10)} ${plural(res.score, "carte", "cartes")}${res.bonus_legendary ? " et une carte légendaire en bonus" : ""}.` : ""}</p>
        ${res.booster_id ? '<button class="btn" data-action="open-from-quiz" data-id="' + res.booster_id + '" data-bonus="' + (res.bonus_legendary ? 1 : 0) + '">Ouvrir mon booster</button> ' : ""}
        <button class="btn ghost" data-action="quiz-done">Retour</button>
        <div class="review">${qs.map((qq, i) => { const rr = res.results[i]; return `<div><b>${esc(qq.question)}</b>${rr.ok ? "Bonne réponse : " : `Votre réponse : ${rr.given == null ? "aucune" : esc(qq.choices[rr.given])}<br>Bonne réponse : `}${esc(qq.choices[rr.correct_index])}${rr.explanation ? `<div class="why">${esc(rr.explanation)}</div>` : ""}</div>`; }).join("")}</div>`;
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
    return `<h2 style="margin-top:6px">Boosters du jour</h2><p class="muted" style="margin:-4px 0 12px;font-size:14px">À ouvrir avant minuit, sinon ils disparaissent.</p>` +
      S.daily.map((d) => {
        const t = "Booster de " + fmtSlot(d.slot);
        if (d.state === "ready") return `<div class="pack-row"><div class="pack-ico"></div><div class="grow"><h3>${t}</h3><p>${d.size} cartes · encore ${fmtMin(d.closes_in_min)} pour l'ouvrir</p></div><button class="btn small" data-action="open-daily" data-slot="${esc(d.slot)}">Ouvrir</button></div>`;
        if (d.state === "locked") return `<div class="pack-row dim"><div class="pack-ico"></div><div class="grow"><h3>${t}</h3><p>Arrive à ${fmtSlot(d.slot)}, dans ${fmtMin(d.opens_in_min)}</p></div></div>`;
        return `<div class="pack-row dim"><div class="pack-ico"></div><div class="grow"><h3>${t}</h3><p>Ouvert aujourd'hui</p></div></div>`;
      }).join("");
  }
  function minutesLeft(d) { return Math.max(1, Math.round((new Date(d.expires_at) - new Date()) / 60000)); }

  function boostersHTML() {
    const drops = availableDrops();
    return `<h1>Boosters</h1><p class="lede">Deux boosters par jour, plus ceux des quiz, des drops surprise et des cadeaux.</p>
      ${dailyHTML()}
      ${drops.length ? `<h2 style="margin-top:${S.daily.length ? 26 : 6}px">Drop en cours</h2>${drops.map((d) => `<div class="pack-row"><div class="pack-ico"></div><div class="grow"><h3>${esc(d.label)}</h3><p>${d.size} cartes · encore ${minutesLeft(d)} min</p></div><button class="btn small" data-action="claim" data-id="${d.id}">Récupérer</button></div>`).join("")}` : ""}
      <h2 style="margin-top:${drops.length || S.daily.length ? 26 : 6}px">À ouvrir</h2>
      ${S.boosters.length ? S.boosters.map((b) => `<div class="pack-row"><div class="pack-ico"></div><div class="grow"><h3>${esc(b.label)}</h3><p>${b.size} ${plural(b.size, "carte", "cartes")}${b.luck ? " · chance bonus" : ""}</p></div><button class="btn small" data-action="open" data-id="${b.id}">Ouvrir</button></div>`).join("") :
        '<p class="empty">Aucun booster en attente. Répondez au quiz du jour ou guettez le prochain drop.</p>'}`;
  }

  // --- Score ---
  function scoreHTML() {
    const rows = S.scores.slice().sort((a, b) => b.total - a.total || a.first_name.localeCompare(b.first_name));
    const max = Math.max(1, ...rows.map((r) => r.total));
    return `<h1>Classement</h1><p class="lede">Les points viennent du quiz, des cartes que vous possédez et des paires skipper + bateau.</p>
      <div class="legend"><span><i style="background:var(--flag-blue)"></i>Quiz</span><span><i style="background:var(--flag-yellow)"></i>Cartes</span><span><i style="background:var(--flag-red)"></i>Paires</span></div>
      <ol class="board">${rows.map((r, i) => {
        const p = playerById(r.player_id) || { avatar: {} };
        const w = (v) => (v / max) * 100;
        return `<li class="row ${S.me && r.player_id === S.me.id ? "me" : ""}"><span class="rank">${i + 1}</span>${window.RhumAvatar.render(p.avatar, 48)}
          <div><div class="row-name">${esc(r.first_name)}</div><div class="bar"><i style="width:${w(r.quiz_points)}%"></i><i style="width:${w(r.card_points)}%"></i><i style="width:${w(r.pair_points)}%"></i></div>
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
      return `<p class="lede" style="margin-top:14px">Touchez un joueur pour voir son deck, ou cherchez une carte ci-dessus.</p><div class="who-grid">${rows}</div>`;
    }
    const pl = S.players.filter((p) => p.id !== S.me.id && norm(p.first_name).includes(qs));
    const cs = S.cards.filter((c) => norm(c.name).includes(qs) || norm(c.partner_name).includes(qs)).slice(0, 30);
    const plHTML = pl.map((p) => `<button class="mk-row" data-action="mk-player" data-id="${p.id}">${window.RhumAvatar.render(p.avatar, 36)}<span>Voir le deck de <b>${esc(p.first_name)}</b></span></button>`).join("");
    const csHTML = cs.map((c) => {
      const owners = ownersOf(c.id).filter((o) => o.p !== S.me.id);
      const mine = (S.mine.filter((x) => x.card_id === c.id).length);
      const chips = owners.length ? owners.map((o) => `<button class="chip" data-action="mk-want" data-player="${o.p}" data-card="${c.id}">${esc((playerById(o.p) || {}).first_name)}${o.n > 1 ? " ×" + o.n : ""} · demander</button>`).join("")
        : '<span class="mk-none">Personne ne l\'a pour l\'instant</span>';
      return `<div class="mk-res">${cardLabel(c.id)}${mine ? `<small class="mk-mine">Vous l'avez${mine > 1 ? " ×" + mine : ""}</small>` : ""}<div class="chips">${chips}</div></div>`;
    }).join("");
    return `<div style="margin-top:12px">${plHTML}${csHTML || (plHTML ? "" : '<p class="empty">Aucun résultat.</p>')}</div>`;
  }
  function marketDeckHTML() {
    const p = playerById(S.mk.playerId);
    if (!p) return "";
    const deck = deckOf(p.id);
    const list = S.cards.filter((c) => deck.has(c.id)).sort((x, y) => RAR.indexOf(x.rarity) - RAR.indexOf(y.rarity) || x.name.localeCompare(y.name));
    const mine = new Set(S.mine.map((x) => x.card_id));
    const grid = list.map((c) => `<div class="mk-cell">${cardHTML(c, { action: "mk-want", count: deck.get(c.id) })}<small class="${mine.has(c.id) ? "mk-mine" : "mk-new"}">${mine.has(c.id) ? "Vous l'avez" : "Il vous manque"}</small></div>`).join("");
    return `<button class="btn ghost" data-action="mk-back">← Retour</button>
      <div class="mk-head">${window.RhumAvatar.render(p.avatar, 56)}<div><h2 style="margin:0">Deck de ${esc(p.first_name)}</h2><p class="lede" style="margin:2px 0 0">${list.length} ${plural(list.length, "carte", "cartes")} · touchez une carte pour la demander. Vous ne pouvez rien modifier dans son deck.</p></div></div>
      <div class="mk-grid">${grid || '<p class="empty">Ce deck est encore vide.</p>'}</div>`;
  }
  function tradeLine(t, mode) {
    const from = playerById(t.from_player), to = playerById(t.to_player);
    const fn = esc((from || {}).first_name), tn = esc((to || {}).first_name);
    const perk = t.perk ? `<div class="mk-perk">+ ${esc(t.perk)}</div>` : "";
    let head;
    if (mode === "in") head = `<b>${fn}</b> vous propose ${cardLabel(t.give_card)} contre votre ${cardLabel(t.want_card)}`;
    else if (mode === "out") head = `Vous proposez ${cardLabel(t.give_card)} à <b>${tn}</b> contre ${cardLabel(t.want_card)}`;
    else head = `<b>${fn}</b> ⇄ <b>${tn}</b> : ${cardLabel(t.give_card)} contre ${cardLabel(t.want_card)}`;
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
      <h2>Activité du marché</h2>${feed.map((t) => `<div class="mk-trade dim">${tradeLine(t, "feed")}</div>`).join("") || '<p class="empty">Aucun échange pour le moment.</p>'}`;
  }
  function marcheHTML() {
    const incoming = S.mk.trades.filter((t) => t.to_player === S.me.id && t.status === "pending").length;
    const v = S.mk.view;
    const nav = `<div class="chips" role="group" aria-label="Marché"><button class="chip" data-action="mk-view" data-view="search" aria-pressed="${v !== "trades"}">Chercher une carte</button>
      <button class="chip" data-action="mk-view" data-view="trades" aria-pressed="${v === "trades"}">Mes échanges${incoming ? ` (${incoming})` : ""}</button></div>`;
    if (!S.mk.loaded) return `<h1>Marché</h1><p class="empty">Le marché n'est pas encore installé (relancez 01_schema.sql dans Supabase).</p>`;
    if (v === "trades") return `<h1>Marché</h1>${nav}${marketTradesHTML()}`;
    if (S.mk.playerId) return `<h1>Marché</h1>${nav}${marketDeckHTML()}`;
    return `<h1>Marché</h1><p class="lede">Chacun peut voir le deck des autres. Trouvez la carte qui vous manque, proposez un échange avec une contrepartie si vous voulez.</p>${nav}
      <div class="field"><label for="mq">Rechercher un joueur ou une carte</label><input id="mq" type="search" autocomplete="off" placeholder="Ex. Le Cam, Maxi Edmond de Rothschild, Marie…" value="${esc(S.mk.q)}"></div>
      <div id="mres">${marketSearchHTML()}</div>`;
  }
  function openCompose(playerId, cardId) {
    const to = playerById(playerId), want = cardById(cardId);
    const counts = ownedCounts();
    const mine = S.cards.filter((c) => counts.has(c.id)).sort((x, y) => (counts.get(y.id) - counts.get(x.id)) || x.name.localeCompare(y.name));
    if (!mine.length) return toast("Vous n'avez encore aucune carte à proposer.", true);
    const opts = mine.map((c) => `<option value="${c.id}">${esc(c.name)} (${c.kind === "skipper" ? "skipper" : "bateau"}, ${RAR_LABEL[c.rarity]})${counts.get(c.id) > 1 ? " ×" + counts.get(c.id) : ""}</option>`).join("");
    const perks = S.mk.perks.map((x) => `<option value="${esc(x)}">${esc(x)}</option>`).join("");
    const m = document.createElement("div");
    m.className = "modal"; m.setAttribute("role", "dialog");
    m.innerHTML = `<div class="modal-in mk-compose"><h2 style="margin-top:0">Demander à ${esc(to.first_name)}</h2>
      <p>Vous voulez : ${cardLabel(want.id)}</p>
      <div class="field"><label for="mkgive">Je donne</label><select id="mkgive">${opts}</select></div>
      <div class="field"><label for="mkperk">Contrepartie du week-end (facultatif)</label><select id="mkperk"><option value="">Aucune</option>${perks}<option value="__other">Autre…</option></select></div>
      <div class="field" id="mkotherw" hidden><label for="mkother">Autre : écrivez votre proposition</label><input id="mkother" maxlength="80" placeholder="Ex. je te paie un café samedi"></div>
      <button class="btn" id="mksend">Envoyer la demande</button><button class="btn alt" id="mkno" style="margin-top:8px">Annuler</button></div>`;
    document.body.appendChild(m);
    const perkSel = m.querySelector("#mkperk");
    perkSel.addEventListener("change", () => { m.querySelector("#mkotherw").hidden = perkSel.value !== "__other"; });
    m.querySelector("#mkno").addEventListener("click", () => m.remove());
    m.addEventListener("click", (ev) => { if (ev.target === m) m.remove(); });
    m.querySelector("#mksend").addEventListener("click", async () => {
      const btn = m.querySelector("#mksend"); btn.disabled = true;
      let perk = perkSel.value === "__other" ? m.querySelector("#mkother").value.trim() : perkSel.value;
      if (perkSel.value === "__other" && perk) perk = "Autre : " + perk;
      try {
        await rpc("propose_trade", { p_from: S.me.id, p_to: playerId, p_give: Number(m.querySelector("#mkgive").value), p_want: cardId, p_perk: perk || null });
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
      <div class="panel"><h3>Contreparties du marché</h3><p class="muted" style="font-size:14px;margin-bottom:10px">Une proposition par ligne. Les joueurs peuvent aussi écrire « Autre ».</p>
        <div class="field"><label for="pk">Liste</label><textarea id="pk">${esc((S.mk.perks || []).join("\n"))}</textarea></div><button class="btn" data-action="save-perks">Enregistrer</button></div>
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
      ov.innerHTML = `<div class="pack" data-ov="tear"><b>${esc(label || "Booster")}</b></div><p class="hint">Touchez le booster pour l'ouvrir</p>`;
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
        <p class="hint" id="hint">Touchez la carte pour la retourner</p>`;
      ov.querySelector(".ov-card").addEventListener("click", onTap);
    }

    function onTap() {
      if (!flipped) {
        flipped = true;
        document.getElementById("flip").classList.add("on");
        if (list[i].c.rarity === "legendaire") { ov.classList.remove("flash"); void ov.offsetWidth; ov.classList.add("flash"); }
        document.getElementById("hint").textContent = i === list.length - 1 ? "Touchez pour voir le résumé" : "Touchez pour la carte suivante";
      } else if (i < list.length - 1) { i++; stageCard(); }
      else stageSummary();
    }

    function stageSummary() {
      ov.className = "ov";
      ov.innerHTML = `<div class="ov-count">Votre butin</div><div class="summary">${list.map((it) => cardHTML(it.c, { isNew: it.isNew })).join("")}</div><button class="btn" id="ovdone">Ajouter à mon album</button>`;
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
    if (!drawn.length) { toast("Cartes introuvables, rechargez la page.", true); return; }
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
      S.tab = "album"; await refresh(true);
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
      toast(r === "accepted" ? "Échange fait ! Les cartes sont dans vos decks." : "Échange impossible : une des cartes n'est plus disponible.", r !== "accepted");
      await refresh();
    },
    async "mk-decline"(el) { await rpc("respond_trade", { p_player: S.me.id, p_trade: Number(el.dataset.id), p_accept: false }); toast("Demande refusée."); await refresh(); },
    async "mk-cancel"(el) { await rpc("cancel_trade", { p_player: S.me.id, p_trade: Number(el.dataset.id) }); toast("Demande annulée."); await refresh(); },
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
        await showDrawn(ids, "Booster de " + fmtSlot(el.dataset.slot), 0);
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
        await rpc("admin_publish_quiz", { p_code: S.adminCode, p_title: title, p_questions: parsed });
        toast(`Quiz publié (${parsed.length} questions).`); await refresh();
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
      const txt = document.getElementById("pk").value.split("\n").map((x) => x.trim().replace(/\|/g, "/")).filter(Boolean).join("|");
      await rpc("admin_set_perks", { p_code: S.adminCode, p_text: txt });
      toast("Contreparties enregistrées."); await refresh();
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
  }

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

  async function refresh() {
    try { await load(); } catch (e) { toast(e.message, true); }
    render();
  }

  // ---------- Démarrage ----------
  async function start() {
    if (!CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY) return renderSetup();
    if (!window.supabase) { app.innerHTML = '<div class="setup"><h1>Connexion impossible.</h1><p class="lede">La bibliothèque Supabase ne s\'est pas chargée. Vérifiez votre connexion et rechargez la page.</p></div>'; return; }
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
    if (S.me) await load();
    if (S.adminCode) loadAdmin();
    render();
    setInterval(() => {
      if (document.hidden || S.overlay || S.run || !S.me || S.tab === "admin") return;
      refresh();
    }, 45000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && S.me && !S.overlay && !S.run && S.tab !== "admin") refresh();
    });
  }

  start();
})();
