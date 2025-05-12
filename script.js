const darkModeToggle = document.getElementById('darkMode');
const body = document.body;

// Dark mode sozlamasi
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
  body.classList.add("dark-mode");
}

darkModeToggle.onclick = function () {
  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
};

// API va elementlar
const API_URL = "https://680f7a4d67c5abddd1957b77.mockapi.io/hello/api/name";
const contactList = document.getElementById("contactList");
const addContactBtn = document.getElementById("addContact");
const searchNameInput = document.getElementById("searchName");
const searchNumberInput = document.getElementById("searchNumber");

// Global kontaktlar ro'yxati
let allContacts = [];

// Kontaktlarni olish
async function fetchContacts() {
  const response = await fetch(API_URL);
  allContacts = await response.json();
  renderContacts(allContacts);
}

// Kontaktlarni chiqarish
function renderContacts(contacts) {
  contactList.innerHTML = "";
  contacts.forEach(contact => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${contact.name} - ${contact.number}</span>
      <button class="edit-btn" data-id="${contact.id}">🖋</button>
      <button class="delete-btn" data-id="${contact.id}">🗑</button>`;
    contactList.appendChild(li);

    li.querySelector(".edit-btn").addEventListener("click", () => editContact(contact.id));
    li.querySelector(".delete-btn").addEventListener("click", () => deleteContact(contact.id));
  });
}

// Qo‘shish tugmasi
addContactBtn.onclick = async function () {
  const name = document.getElementById("name").value;
  const number = document.getElementById("number").value;

  if (name && number) {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, number })
    });
    document.getElementById("name").value = "";
    document.getElementById("number").value = "";
    fetchContacts();
  } else {
    alert("Iltimos, nom va raqamni kiriting!");
  }
};

// Kontaktni o‘chirish
async function deleteContact(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchContacts();
}

// Kontaktni tahrirlash
async function editContact(id) {
  const name = prompt("Yangi nomni kiriting:");
  const number = prompt("Yangi raqamni kiriting:");
  if (name && number) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, number })
    });
    fetchContacts();
  }
}

// Kontaktlarni filtrlash
function filterContacts() {
  const nameQuery = searchNameInput.value.toLowerCase();
  const numberQuery = searchNumberInput.value.toLowerCase();

  const filtered = allContacts.filter(contact => {
    const nameMatch = contact.name.toLowerCase().includes(nameQuery);
    const numberMatch = contact.number.toLowerCase().includes(numberQuery);
    return nameMatch && numberMatch;
  });

  renderContacts(filtered);
}

// Qidiruv inputlariga hodisa biriktirish
searchNameInput.addEventListener("input", filterContacts);
searchNumberInput.addEventListener("input", filterContacts);

// Boshlanishda kontaktlarni olish
fetchContacts();