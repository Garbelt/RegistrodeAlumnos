import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, ref, get, remove, child } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// ✅ Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBVZaysx9d6u6P13DYINPtcinpf79Sgx4U",
  authDomain: "juego001-469b6.firebaseapp.com",
  projectId: "juego001-469b6",
  storageBucket: "juego001-469b6.appspot.com",
  messagingSenderId: "528847999661",
  appId: "1:528847999661:web:6085a104fe64262a042c24",
  measurementId: "G-XC212WQYHK",
  databaseURL: "https://juego001-469b6-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ✅ Función para obtener usuarios desde Firebase
async function getUsersList() {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, 'usuarios'));
  if (snapshot.exists()) {
    const usersObj = snapshot.val();
    return Object.values(usersObj).map(user => user.nombre);
  } else {
    return [];
  }
}

// ✅ Mostrar usuarios en la tabla
async function displayUsersList() {
  const usersListElement = document.getElementById('usersList');
  usersListElement.innerHTML = '';

  const users = await getUsersList();

  users.forEach(user => {
    const row = document.createElement('tr');

    const leftCell = document.createElement('td');
    leftCell.textContent = '';

    const usernameCell = document.createElement('td');
    usernameCell.textContent = user;

    const infoButton = document.createElement('button');
    infoButton.textContent = 'Ver Info';
    infoButton.classList.add('action-button');
    infoButton.addEventListener('click', () => {
      window.location.href = `reg.html?username=${encodeURIComponent(user)}`;
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('action-button');
    deleteButton.addEventListener('click', () => {
      deleteUser(user.toLowerCase());
    });

    const actionsCell = document.createElement('td');
    actionsCell.classList.add('action-buttons');
    actionsCell.appendChild(infoButton);
    actionsCell.appendChild(deleteButton);

    row.appendChild(leftCell);
    row.appendChild(usernameCell);
    row.appendChild(actionsCell);

    usersListElement.appendChild(row);
  });
}

// ✅ Eliminar usuario de Firebase
async function deleteUser(userKey) {
  if (confirm(`¿Eliminar usuario ${userKey}?`)) {
    await remove(ref(database, 'usuarios/' + userKey));
    displayUsersList();
  }
}

// ✅ Eliminar todos los usuarios de localStorage (no afecta Firebase)
document.getElementById('deleteAllButton').addEventListener('click', () => {
  localStorage.removeItem('users');
  displayUsersList();
});

// Inicializar lista
displayUsersList();
