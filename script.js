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

  // Footer year
  $("#year").textContent = String(new Date().getFullYear());

  initTabs();
}

init();
