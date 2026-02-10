const $ = (sel) => document.querySelector(sel);

function toast(msg){
  const el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  window.clearTimeout(window.__toastTimer);
  window.__toastTimer = window.setTimeout(() => el.textContent = "", 1800);
}

function statusPill(status){
  const s = (status || "").toLowerCase();
  if (s.includes("next")) return `<span class="pill pill--next">Next</span>`;
  return `<span class="pill pill--current">Current</span>`;
}

function safeHref(href){
  return href && href.trim().length ? href : "#";
}


const COLOR_FOUNDATIONS = {
  brand: [
    { name: "White", token: "color-white-x", hex: "#FFFFFF" },
    { name: "Black", token: "color-black-x", hex: "#707070" },
    { name: "Steel", token: "color-steel-x", hex: "#6D838B" },
    { name: "Blue", token: "color-blue-x", hex: "#21366B" }
  ],
  scales: {
    white: { 900: "#FFFFFF" },
    black: { 100: "#F7F7F7", 200: "#DCDCDC", 300: "#C1C1C1", 400: "#A6A6A6", 500: "#8B8B8B", 600: "#707070", 700: "#555555", 800: "#3A3A3A", 900: "#1F1F1F" },
    steel: { 100: "#E7EAEC", 200: "#CED6D8", 300: "#B6C1C5", 400: "#9EACB2", 500: "#85989E", 600: "#6D838B", 700: "#57696F", 800: "#414F53", 900: "#2C3438" },
    blue: { 100: "#E9EBF0", 200: "#D3D7E1", 300: "#A6AFC4", 400: "#7A86A6", 500: "#4D5E89", 600: "#21366B", 700: "#1A2B56", 800: "#142040", 900: "#0D162B" },
    aquamarine: { 100: "#ECF7F6", 200: "#CEE8E5", 300: "#B0D8D4", 400: "#92C9C2", 500: "#74B9B1", 600: "#56AAA0", 700: "#448880", 800: "#336660", 900: "#214440" },
    avocado: { 100: "#E8F1ED", 200: "#C4D8CD", 300: "#A0BEAE", 400: "#7BA78E", 500: "#578E6F", 600: "#33754F", 700: "#285E3F", 800: "#1C462F", 900: "#112F1F" },
    blueberry: { 100: "#EDEDFB", 200: "#CDCDF4", 300: "#AEAEDD", 400: "#8E8ED5", 500: "#6F6FDE", 600: "#4F4DD7", 700: "#3F3EAC", 800: "#302E81", 900: "#201F56" },
    brown: { 100: "#F6EFEC", 200: "#EBD2CC", 300: "#DAB6AC", 400: "#CB998B", 500: "#BD7D6B", 600: "#AF604B", 700: "#8C4D3C", 800: "#69392D", 900: "#46261E" },
    cacao: { 100: "#EFE8E8", 200: "#D3C0C0", 300: "#B89898", 400: "#9C706F", 500: "#814847", 600: "#65201F", 700: "#511919", 800: "#3C1312", 900: "#280C0C" },
    green: { 100: "#ECFBE8", 200: "#D2F5CC", 300: "#B8EFAD", 400: "#9DEA8D", 500: "#83E46E", 600: "#69DE4F", 700: "#53B23F", 800: "#3D852E", 900: "#27591E" },
    indigo: { 100: "#EBF5F9", 200: "#CBE2EF", 300: "#ABCFE5", 400: "#8CBBDD", 500: "#6CAAD1", 600: "#4C97C7", 700: "#3C799F", 800: "#2D5A78", 900: "#1D3C50" },
    lime: { 100: "#F8FDE8", 200: "#ECFAC8", 300: "#E0F6A9", 400: "#D5F389", 500: "#C9EF6A", 600: "#BDEC4A", 700: "#92B737", 800: "#688225", 900: "#3D4D12" },
    magenta: { 100: "#F7E8EF", 200: "#EBC2D3", 300: "#DE9CB7", 400: "#D2779B", 500: "#C5517F", 600: "#B92B63", 700: "#94214F", 800: "#6F183C", 900: "#4A0E28" },
    mango: { 100: "#FDF6E8", 200: "#FAE7C5", 300: "#F7D8A3", 400: "#F3C880", 500: "#F0B95E", 600: "#EDAA3B", 700: "#BE882E", 800: "#8E6520", 900: "#5F4313" },
    ocean: { 100: "#E8F3FE", 200: "#C5DCFD", 300: "#A2C5FB", 400: "#7FAFFA", 500: "#5C98F8", 600: "#3981F7", 700: "#2C67C5", 800: "#1F4D94", 900: "#123362" },
    orange: { 100: "#FCF0E7", 200: "#F9D5C2", 300: "#F6B99C", 400: "#F29E77", 500: "#EF8251", 600: "#EC672C", 700: "#BD5221", 800: "#8D3E17", 900: "#5E290C" },
    pomegranate: { 100: "#FFDED5", 200: "#FEC1B1", 300: "#FDA48E", 400: "#FB876A", 500: "#F96B47", 600: "#F74F25", 700: "#E3370B", 800: "#B52F0B", 900: "#89250A" },
    pink: { 100: "#FBE7F3", 200: "#F8C3DF", 300: "#F49FCB", 400: "#F17BB7", 500: "#ED57A3", 600: "#EA338F", 700: "#BB2772", 800: "#8C1A56", 900: "#5D0E39" },
    purple: { 100: "#F3E9FD", 200: "#DFC3FB", 300: "#CB9DFA", 400: "#B878F8", 500: "#A452F7", 600: "#902CF5", 700: "#7323C4", 800: "#561A93", 900: "#391162" },
    red: { 100: "#FBEBEA", 200: "#F8C9C6", 300: "#F4A8A3", 400: "#F1867F", 500: "#ED655C", 600: "#EA4338", 700: "#BB352D", 800: "#8C2721", 900: "#5D1916" },
    teal: { 100: "#F5FFFB", 200: "#D3EFE0", 300: "#B1DFC6", 400: "#90D0AB", 500: "#6EC091", 600: "#4CB076", 700: "#3E9363", 800: "#2F774F", 900: "#215A3C" },
    tomato: { 100: "#F8E8EA", 200: "#EEC3C6", 300: "#E49EA3", 400: "#DA797F", 500: "#D0545C", 600: "#C62F38", 700: "#9E252C", 800: "#761A21", 900: "#4E1015" },
    turquoise: { 100: "#EBF9FA", 200: "#C7EEF1", 300: "#A2E2E7", 400: "#7DD7DE", 500: "#59CBD4", 600: "#35C0CB", 700: "#2A9AA2", 800: "#20737A", 900: "#154D51" },
    violet: { 100: "#F2EFFE", 200: "#DDB2FC", 300: "#C4B5FB", 400: "#AD97F9", 500: "#967AF8", 600: "#7F5DF6", 700: "#654AC5", 800: "#4C3893", 900: "#322662" },
    yellow: { 100: "#FEFAEA", 200: "#FDF1CA", 300: "#FBE8AA", 400: "#FAE08A", 500: "#F8D76A", 600: "#F7CE4A", 700: "#C6A53A", 800: "#947C2B", 900: "#63531B" }
  }
};

function hexToRgb(hex){
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

function renderColorFoundations(){
  const brandMount = $("#brandColors");
  const scaleMount = $("#colorScales");
  if (!brandMount || !scaleMount) return;

  brandMount.innerHTML = "";
  scaleMount.innerHTML = "";

  COLOR_FOUNDATIONS.brand.forEach((c) => {
    const card = document.createElement("article");
    card.className = "swatch";
    card.innerHTML = `
      <div class="swatch__chip" style="background:${c.hex};"></div>
      <div class="swatch__name">${c.name}</div>
      <div class="swatch__token">$${c.token}</div>
      <div class="swatch__hex">${c.hex}</div>
      <div class="swatch__rgb">${hexToRgb(c.hex)}</div>
    `;
    brandMount.appendChild(card);
  });

  Object.entries(COLOR_FOUNDATIONS.scales).forEach(([family, scale]) => {
    const section = document.createElement("section");
    section.className = "scale-group";

    const title = document.createElement("h4");
    title.className = "scale-group__title";
    title.textContent = family.charAt(0).toUpperCase() + family.slice(1);
    section.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "scale-grid";

    Object.entries(scale).forEach(([step, hex]) => {
      const token = `color-${family}-${step}`;
      const item = document.createElement("article");
      item.className = "scale-item";
      item.innerHTML = `
        <div class="scale-item__chip" style="background:${hex};"></div>
        <div class="scale-item__token">${token}</div>
        <div class="scale-item__hex">${hex}</div>
        <div class="scale-item__rgb">${hexToRgb(hex)}</div>
      `;
      grid.appendChild(item);
    });

    section.appendChild(grid);
    scaleMount.appendChild(section);
  });
}

function createPreviewRow(colspan, embedUrl){
  const tr = document.createElement("tr");
  tr.className = "preview-row is-hidden";

  const td = document.createElement("td");
  td.colSpan = colspan;

  const wrap = document.createElement("div");
  wrap.className = "preview";

  if (embedUrl && embedUrl.trim().length){
    const iframe = document.createElement("iframe");
    iframe.loading = "lazy";
    iframe.title = "Storybook preview";
    iframe.src = embedUrl;
    wrap.appendChild(iframe);
  } else {
    const empty = document.createElement("div");
    empty.className = "preview__empty";
    empty.innerHTML = `No <strong>embedUrl</strong> set yet. Add a Storybook embeddable URL (recommended: <code>iframe.html?id=...</code>) in <code>manifest.json</code>.`;
    wrap.appendChild(empty);
  }

  td.appendChild(wrap);
  tr.appendChild(td);
  return tr;
}

function buildRow(c){
  const tr = document.createElement("tr");

  // Visual-only checkbox column
  const tdCheck = document.createElement("td");
  tdCheck.className = "col-check";
  tdCheck.innerHTML = `<input type="checkbox" aria-label="Select ${c.name} (visual only)" disabled>`;
  tr.appendChild(tdCheck);

  // Component
  const tdName = document.createElement("td");
  tdName.innerHTML = `
    <div class="component-name">
      <div class="component-name__title">${c.name}</div>
      <div class="component-name__meta">${(c.tags || []).join(" · ")}</div>
    </div>
  `;
  tr.appendChild(tdName);

  // Category
  const tdCat = document.createElement("td");
  tdCat.textContent = c.category || "—";
  tr.appendChild(tdCat);

  // Status
  const tdStatus = document.createElement("td");
  tdStatus.innerHTML = statusPill(c.status);
  tr.appendChild(tdStatus);

  // Links
  const tdLinks = document.createElement("td");
  tdLinks.innerHTML = `
    <div class="links">
      <a class="link" href="${safeHref(c.docsUrl)}" target="_blank" rel="noreferrer">Docs</a>
      <a class="link" href="${safeHref(c.storybookUrl)}" target="_blank" rel="noreferrer">Storybook</a>
    </div>
  `;
  tr.appendChild(tdLinks);

  // Preview toggle
  const tdPrev = document.createElement("td");
  const id = `prev-${Math.random().toString(16).slice(2)}`;
  tdPrev.innerHTML = `
    <label class="preview-toggle">
      <input id="${id}" type="checkbox" />
      <span>Show</span>
    </label>
  `;
  tr.appendChild(tdPrev);

  const previewRow = createPreviewRow(6, c.embedUrl || "");

  // Toggle behavior
  const input = tdPrev.querySelector("input");
  input.addEventListener("change", () => {
    previewRow.classList.toggle("is-hidden", !input.checked);
  });

  return { tr, previewRow };
}

function buildNextCard(n){
  const div = document.createElement("div");
  div.className = "next-card";
  div.innerHTML = `
    <div class="next-card__top">
      <div>
        <div class="next-card__title">${n.name}</div>
        <div style="margin-top:8px;">${statusPill(n.status || "Next")}</div>
      </div>
      ${n.link && n.link.trim().length ? `<a class="link" href="${n.link}" target="_blank" rel="noreferrer">Open</a>` : ``}
    </div>
    ${n.notes && n.notes.trim().length ? `<div class="next-card__notes">${n.notes}</div>` : ``}
  `;
  return div;
}

function initTabs(){
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const panes = Array.from(document.querySelectorAll("[data-pane]"));

  function setActive(tabName){
    tabs.forEach(t => {
      const active = t.dataset.tab === tabName;
      t.classList.toggle("tab--active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    panes.forEach(p => p.classList.toggle("is-hidden", p.dataset.pane !== tabName));
  }

  tabs.forEach(t => t.addEventListener("click", () => setActive(t.dataset.tab)));
}

async function init(){
  const res = await fetch("./manifest.json", { cache: "no-store" });
  const data = await res.json();

  $("#subtitle").textContent = data.meta?.subtitle || "Single source of truth for Titan status, docs, and previews.";
  $("#updated").textContent = data.meta?.updated || "";
  $("#zeroLink").href = data.meta?.zeroheight_home || "#";
  $("#sbLink").href = data.meta?.storybook_home || "#";

  // Current table
  const all = data.current_components || [];
  const tbody = $("#componentsTbody");
  tbody.innerHTML = "";

  const rowRefs = [];
  all.forEach(c => {
    const { tr, previewRow } = buildRow(c);
    tbody.appendChild(tr);
    tbody.appendChild(previewRow);
    rowRefs.push({ c, tr, previewRow });
  });

  // Search
  const search = $("#search");
  search.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    rowRefs.forEach(({ c, tr, previewRow }) => {
      const text = `${c.name} ${(c.category||"")} ${(c.tags||[]).join(" ")}`.toLowerCase();
      const show = text.includes(q);
      tr.style.display = show ? "" : "none";
      // Hide preview row too when filtering out
      previewRow.style.display = show ? "" : "none";
      if (!show) previewRow.classList.add("is-hidden");
      const toggle = tr.querySelector('input[type="checkbox"]:not([disabled])');
      if (toggle) toggle.checked = false;
    });
  });

  // Next
  const nextMount = $("#nextList");
  nextMount.innerHTML = "";
  (data.next_components || []).forEach(n => nextMount.appendChild(buildNextCard(n)));

  // Require
  const require = data.require_to_titan || {};
  const cta = $("#requireCta");
  cta.textContent = require.cta_label || "Request";
  cta.href = (require.cta_link && require.cta_link.trim().length) ? require.cta_link : (data.meta?.zeroheight_home || "#");

  const tpl = $("#requireTemplate");
  tpl.innerHTML = "";
  (require.template || []).forEach(line => {
    const li = document.createElement("li");
    li.textContent = line;
    tpl.appendChild(li);
  });

  const templateText = (require.template || []).map(x => `- ${x}`).join("\n");
  $("#templateText").textContent = templateText;

  $("#copyTemplate").addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(templateText);
      toast("Template copied.");
    } catch {
      toast("Couldn’t copy automatically. Select and copy manually.");
    }
  });

  renderColorFoundations();

  // Footer year
  $("#year").textContent = String(new Date().getFullYear());

  initTabs();
}

init();
