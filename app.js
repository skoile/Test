const form = document.getElementById("form");
const input = document.getElementById("input");
const list = document.getElementById("list");
const empty = document.getElementById("empty");

const STORAGE_KEY = "todo-items";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function save(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Stockage indisponible : la liste reste utilisable pour la session.
  }
}

let items = load();

function render() {
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    if (item.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.addEventListener("change", () => {
      item.done = checkbox.checked;
      save(items);
      render();
    });

    const span = document.createElement("span");
    span.textContent = item.text;

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "Supprimer";
    del.addEventListener("click", () => {
      items = items.filter((i) => i.id !== item.id);
      save(items);
      render();
    });

    li.append(checkbox, span, del);
    list.appendChild(li);
  });
  empty.hidden = items.length > 0;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  items.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2), text, done: false });
  save(items);
  input.value = "";
  input.focus();
  render();
});

render();
