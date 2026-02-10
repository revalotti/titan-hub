const mounts = {
  neutrals: document.querySelector("#neutrals"),
  systemUi: document.querySelector("#systemUi"),
  basics: document.querySelector("#basics")
};

const NEUTRALS_ORDER = ["black", "steel", "blue"];
const SYSTEM_UI_ORDER = ["error", "warning", "information", "success", "disabled"];
const BASIC_ORDER = [
  "cacao", "brown", "mango", "yellow", "lime", "green", "teal", "avocado", "aquamarine", "turquoise",
  "indigo", "ocean", "blueberry", "violet", "purple", "pink", "magenta", "tomato", "red", "orange"
];

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function parsePathReference(ref) {
  const match = ref.match(/\{color\.primitive\.(.+)\.(\d+)\.value\}/);
  if (!match) return null;
  return { family: match[1], step: match[2] };
}

function buildFamilyCard(title, rows) {
  const article = document.createElement("article");
  article.className = "family";

  const tokenRows = rows.map((row) => `
    <li class="token-row">
      <span class="swatch" style="background:${row.hex}"></span>
      <span class="hex">${row.hex}</span>
      <span class="token">$color_${row.name}</span>
    </li>
  `).join("");

  article.innerHTML = `
    <h3 class="family__title">${title}</h3>
    <ul class="token-list">${tokenRows}</ul>
  `;
  return article;
}

function primitiveRows(tokens, family) {
  const scale = tokens.color.primitive[family];
  return Object.keys(scale)
    .sort((a, b) => Number(a) - Number(b))
    .map((step) => ({ name: `${family}-${step}`, hex: scale[step].value }));
}

function semanticRows(tokens, semanticName) {
  const scale = tokens.color.semantic["system-ui"][semanticName];
  return Object.keys(scale)
    .sort((a, b) => Number(a) - Number(b))
    .map((step) => {
      const parsed = parsePathReference(scale[step].value);
      const primitiveHex = parsed ? tokens.color.primitive[parsed.family][parsed.step].value : "#000000";
      return { name: `${semanticName}-${step}`, hex: primitiveHex };
    });
}

async function init() {
  const response = await fetch("./colors.tokens.json", { cache: "no-store" });
  const tokens = await response.json();

  NEUTRALS_ORDER.forEach((family) => {
    mounts.neutrals.appendChild(buildFamilyCard(titleCase(family), primitiveRows(tokens, family)));
  });

  SYSTEM_UI_ORDER.forEach((family) => {
    mounts.systemUi.appendChild(buildFamilyCard(titleCase(family), semanticRows(tokens, family)));
  });

  BASIC_ORDER.forEach((family) => {
    mounts.basics.appendChild(buildFamilyCard(titleCase(family), primitiveRows(tokens, family)));
  });
}

init();
