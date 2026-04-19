let charId = null;

function setPreview() {
  const preview = document.getElementById("preview");
  const mechaImageUrl = document.getElementById("mechaImageUrl").value.trim();
  const pilotImageUrl = document.getElementById("pilotImageUrl").value.trim();

  if (!mechaImageUrl) {
    preview.innerHTML = `<div class="preview-empty">No Machine Image</div>`;
    return;
  }

  preview.innerHTML = `
    <img src="${mechaImageUrl}" alt="機体画像">
    ${pilotImageUrl ? `
      <div class="pilot-label">Pilot</div>
      <img class="pilot" src="${pilotImageUrl}" alt="パイロット画像">
      <div class="pilot-frame"></div>
    ` : ""}
  `;
}

function fillClassOptions() {
  const mainClasses = ["", "ストライカー", "スイーパー", "コンダクター"];
  const subClasses = ["", "カバリエ", "クラッシャー", "スーパー", "ディザスター"];

  buildClassPicker(1, mainClasses);
  buildClassPicker(2, mainClasses);
  buildClassPicker(3, subClasses);
}

function buildClassPicker(num, classNames) {
  const select = document.getElementById(`class${num}`);
  const list = document.getElementById(`class${num}_list`);
  const display = document.getElementById(`class${num}_display`);

  if (!select || !list || !display) return;

  select.innerHTML = "";
  list.innerHTML = "";

  classNames.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name === "" ? "未選択" : name;
    select.appendChild(option);

    const item = document.createElement("div");
    item.className = "picker-item" + (name === "" ? " empty" : "");
    item.textContent = name === "" ? "未選択" : name;
    item.dataset.value = name;
    item.onclick = () => selectClassOption(num, name);
    list.appendChild(item);
  });

  display.textContent = "未選択";
}

function toggleClassPicker(num) {
  const panel = document.getElementById(`class${num}_panel`);
  if (!panel) return;

  document.querySelectorAll(".picker-panel").forEach(el => {
    if (el !== panel) el.classList.remove("open");
  });

  panel.classList.toggle("open");
}

function filterClassOptions(num) {
  const input = document.getElementById(`class${num}_search`);
  const list = document.getElementById(`class${num}_list`);
  if (!input || !list) return;

  const keyword = input.value.trim().toLowerCase();

  list.querySelectorAll(".picker-item").forEach(item => {
    const text = item.textContent.toLowerCase();
    item.classList.toggle("hidden", !text.includes(keyword));
  });
}

function selectClassOption(num, value) {
  const select = document.getElementById(`class${num}`);
  const display = document.getElementById(`class${num}_display`);
  const panel = document.getElementById(`class${num}_panel`);
  const search = document.getElementById(`class${num}_search`);

  if (!select || !display) return;

  select.value = value;
  display.textContent = value === "" ? "未選択" : value;

  if (panel) panel.classList.remove("open");
  if (search) search.value = "";

  const list = document.getElementById(`class${num}_list`);
  if (list) {
    list.querySelectorAll(".picker-item").forEach(item => {
      item.classList.remove("hidden");
    });
  }

  updateClassStats();
}

function updateClassDisplayFromSelect(num) {
  const select = document.getElementById(`class${num}`);
  const display = document.getElementById(`class${num}_display`);
  if (!select || !display) return;

  display.textContent = select.value === "" ? "未選択" : select.value;
}

function applyClassRow(rowNumber) {
  const className = document.getElementById(`class${rowNumber}`).value;
  const stats = CLASS_STATS[className] || {
    hp: 0, reflex: 0, sense: 0, intel: 0, will: 0, luck: 0
  };

  document.getElementById(`class${rowNumber}_hp`).textContent = stats.hp;
  document.getElementById(`class${rowNumber}_reflex`).textContent = stats.reflex;
  document.getElementById(`class${rowNumber}_sense`).textContent = stats.sense;
  document.getElementById(`class${rowNumber}_intel`).textContent = stats.intel;
  document.getElementById(`class${rowNumber}_will`).textContent = stats.will;
  document.getElementById(`class${rowNumber}_luck`).textContent = stats.luck;
}

function updateTotalStats() {
  let total = {
    hp: 0,
    reflex: 0,
    sense: 0,
    intel: 0,
    will: 0,
    luck: 0
  };

  for (let i = 1; i <= 3; i++) {
    total.hp += Number(document.getElementById(`class${i}_hp`).textContent || 0);
    total.reflex += Number(document.getElementById(`class${i}_reflex`).textContent || 0);
    total.sense += Number(document.getElementById(`class${i}_sense`).textContent || 0);
    total.intel += Number(document.getElementById(`class${i}_intel`).textContent || 0);
    total.will += Number(document.getElementById(`class${i}_will`).textContent || 0);
    total.luck += Number(document.getElementById(`class${i}_luck`).textContent || 0);
  }

  document.getElementById("total_hp").textContent = total.hp;
  document.getElementById("total_reflex").textContent = total.reflex;
  document.getElementById("total_sense").textContent = total.sense;
  document.getElementById("total_intel").textContent = total.intel;
  document.getElementById("total_will").textContent = total.will;
  document.getElementById("total_luck").textContent = total.luck;
}

function updateClassStats() {
  applyClassRow(1);
  applyClassRow(2);
  applyClassRow(3);
  updateTotalStats();
}

window.addEventListener("DOMContentLoaded", async () => {
  charId = new URLSearchParams(location.search).get("id");

  if (!charId) {
    alert("idがありません");
    return;
  }

  fillClassOptions();

  document.getElementById("mechaImageUrl").addEventListener("input", setPreview);
  document.getElementById("pilotImageUrl").addEventListener("input", setPreview);

  try {
    const doc = await db.collection("characters").doc(charId).get();

    if (!doc.exists) {
      alert("キャラが見つかりません");
      return;
    }

    const d = doc.data();

    document.getElementById("creator").value = d.creator || "";
    document.getElementById("pilotName").value = d.pilotName || "";
    document.getElementById("pilotKana").value = d.pilotKana || "";
    document.getElementById("gender").value = d.gender || "";
    document.getElementById("age").value = d.age || "";
    document.getElementById("eyeColor").value = d.eyeColor || "";
    document.getElementById("height").value = d.height || "";
    document.getElementById("weight").value = d.weight || "";
    document.getElementById("hairColor").value = d.hairColor || "";
    document.getElementById("cover").value = d.cover || "";
    document.getElementById("skinColor").value = d.skinColor || "";
    document.getElementById("mechaName").value = d.mechaName || "";
    document.getElementById("size").value = d.size || "";
    document.getElementById("pilotProfile").value = d.pilotProfile || "";
    document.getElementById("mechaImageUrl").value = d.mechaImageUrl || "";
    document.getElementById("pilotImageUrl").value = d.pilotImageUrl || "";
    document.getElementById("expDisplay").textContent = d.exp || "0";
    document.getElementById("levelDisplay").textContent = d.level || "3";

    document.getElementById("class1").value = d.class1 || "";
    document.getElementById("class2").value = d.class2 || "";
    document.getElementById("class3").value = d.class3 || "";
    document.getElementById("type1").value = d.type1 || "";
    document.getElementById("type2").value = d.type2 || "";
    document.getElementById("type3").value = d.type3 || "";

    updateClassDisplayFromSelect(1);
    updateClassDisplayFromSelect(2);
    updateClassDisplayFromSelect(3);
    updateClassStats();
    setPreview();
  } catch (error) {
    alert("読み込みエラー: " + error.message);
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".class-picker")) {
      document.querySelectorAll(".picker-panel").forEach(el => {
        el.classList.remove("open");
      });
    }
  });
});

async function save() {
  if (!charId) {
    alert("idがありません");
    return;
  }

  const payload = {
    creator: document.getElementById("creator").value.trim(),
    pilotName: document.getElementById("pilotName").value.trim(),
    pilotKana: document.getElementById("pilotKana").value.trim(),
    gender: document.getElementById("gender").value.trim(),
    age: document.getElementById("age").value.trim(),
    eyeColor: document.getElementById("eyeColor").value.trim(),
    height: document.getElementById("height").value.trim(),
    weight: document.getElementById("weight").value.trim(),
    hairColor: document.getElementById("hairColor").value.trim(),
    cover: document.getElementById("cover").value.trim(),
    skinColor: document.getElementById("skinColor").value.trim(),
    mechaName: document.getElementById("mechaName").value.trim(),
    size: document.getElementById("size").value.trim(),
    pilotProfile: document.getElementById("pilotProfile").value.trim(),
    mechaImageUrl: document.getElementById("mechaImageUrl").value.trim(),
    pilotImageUrl: document.getElementById("pilotImageUrl").value.trim(),
    exp: document.getElementById("expDisplay").textContent.trim(),
    level: document.getElementById("levelDisplay").textContent.trim(),

    class1: document.getElementById("class1").value,
    class2: document.getElementById("class2").value,
    class3: document.getElementById("class3").value,
    type1: document.getElementById("type1").value.trim(),
    type2: document.getElementById("type2").value.trim(),
    type3: document.getElementById("type3").value.trim(),

    total_hp: document.getElementById("total_hp").textContent,
    total_reflex: document.getElementById("total_reflex").textContent,
    total_sense: document.getElementById("total_sense").textContent,
    total_intel: document.getElementById("total_intel").textContent,
    total_will: document.getElementById("total_will").textContent,
    total_luck: document.getElementById("total_luck").textContent
  };

  if (!payload.mechaName) {
    alert("機体名を入力してください");
    return;
  }

  try {
    await db.collection("characters").doc(charId).update(payload);
    setPreview();
    alert("保存完了");
  } catch (error) {
    alert("保存エラー: " + error.message);
  }
}

async function removeCharacter() {
  if (!charId) {
    alert("idがありません");
    return;
  }

  const ok = confirm("このキャラを削除しますか？");
  if (!ok) return;

  try {
    await db.collection("characters").doc(charId).delete();
    location.href = "index.html";
  } catch (error) {
    alert("削除エラー: " + error.message);
  }
}