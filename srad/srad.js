// Configuración Firebase
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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Obtener usuarios de Firebase
async function getUsersFromFirebase() {
  try {
    const snapshot = await database.ref('usuarios').once('value');
    const data = snapshot.val();
    return data ? Object.keys(data) : [];
  } catch (error) {
    console.error("Error al leer de Firebase:", error);
    return [];
  }
}

// Obtener usuarios de localStorage
function getUsersFromLocal() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

// Mostrar usuarios en la tabla
async function displayUsersList() {
  const usersList = document.getElementById('usersList');
  usersList.innerHTML = '';

  const firebaseUsers = await getUsersFromFirebase();
  const localUsers = getUsersFromLocal();

  const allUsers = Array.from(new Set([...firebaseUsers, ...localUsers])).sort();

  allUsers.forEach(user => {
    const row = document.createElement('tr');

    const marginCell = document.createElement('td');
    marginCell.textContent = '';

    const userCell = document.createElement('td');
    userCell.textContent = user;

    const actionsCell = document.createElement('td');
    actionsCell.className = 'action-buttons';

    const infoButton = document.createElement('button');
    infoButton.textContent = 'Ver Info';
    infoButton.className = 'action-button';
    infoButton.addEventListener('click', () => {
      window.location.href = 'reg.html?username=' + encodeURIComponent(user);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.className = 'action-button';
    deleteButton.addEventListener('click', () => deleteUser(user));

    actionsCell.appendChild(infoButton);
    actionsCell.appendChild(deleteButton);

    row.appendChild(marginCell);
    row.appendChild(userCell);
    row.appendChild(actionsCell);

    usersList.appendChild(row);
  });
}

// Eliminar usuario de localStorage y Firebase
function deleteUser(username) {
  const localUsers = getUsersFromLocal();
  const index = localUsers.indexOf(username);
  if (index !== -1) {
    localUsers.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(localUsers));
  }

  database.ref('usuarios/' + username.toLowerCase()).remove()
    .then(() => {
      alert('Usuario eliminado.');
      displayUsersList();
    })
    .catch(error => {
      alert('Error al eliminar en Firebase: ' + error.message);
    });
}

// Eliminar todos los usuarios
function deleteAllUsers() {
  localStorage.removeItem('users');
  database.ref('usuarios').remove()
    .then(() => {
      alert('Todos los usuarios eliminados.');
      displayUsersList();
    })
    .catch(error => {
      alert('Error al eliminar todo: ' + error.message);
    });
}

document.getElementById('deleteAllButton').addEventListener('click', deleteAllUsers);

// Mostrar lista al iniciar
displayUsersList();

