// Funci�n para obtener la lista de usuarios almacenada localmente
function getUsersList() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Funci�n para mostrar la lista de usuarios en la interfaz
function displayUsersList() {
    var usersList = document.getElementById('usersList');
    var users = getUsersList();

    // Limpiar la tabla de usuarios existente
    usersList.innerHTML = '';

    // Agregar cada usuario a la tabla
    users.forEach(function(user) {
        var row = document.createElement('tr');

        // Crear celda para el margen izquierdo
        var leftMarginCell = document.createElement('td');
        leftMarginCell.textContent = ''; // Aqu� puedes colocar cualquier contenido o dejarlo vac�o

        // Crear celda para el nombre de usuario
        var usernameCell = document.createElement('td');
        usernameCell.textContent = user;

        // Crear bot�n de ver informaci�n
        var infoButton = document.createElement('button');
        infoButton.textContent = 'Ver Info';
        infoButton.classList.add('action-button'); // Agregar clase CSS
        infoButton.addEventListener('click', function() {
            var rowUsername = row.querySelector('td:nth-child(2)').textContent;
            window.location.href = 'reg.html?username=' + encodeURIComponent(rowUsername);
        });

        // Crear bot�n de eliminar
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('action-button'); // Agregar clase CSS
        deleteButton.addEventListener('click', function() {
            deleteUser(user);
            displayUsersList(); // Actualizar la lista despu�s de eliminar
        });

        // Crear celda para las acciones (botones de eliminar y ver info)
        var actionsCell = document.createElement('td');
        actionsCell.classList.add('action-buttons'); // Agregar clase CSS
        actionsCell.appendChild(infoButton); // Agregar el bot�n de ver info
        actionsCell.appendChild(deleteButton);

        // Agregar celdas a la fila
        row.appendChild(leftMarginCell);
        row.appendChild(usernameCell);
        row.appendChild(actionsCell);

        // Agregar fila a la tabla
        usersList.appendChild(row);
    });
}

// Funci�n para eliminar un usuario
function deleteUser(username) {
    var users = getUsersList();
    var index = users.indexOf(username);
    if (index !== -1) {
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Funci�n para eliminar todos los usuarios
function deleteAllUsers() {
    localStorage.removeItem('users');
    displayUsersList();
}

// Agregar un evento de escucha al bot�n de eliminar todos
var deleteAllButton = document.getElementById('deleteAllButton');
deleteAllButton.addEventListener('click', deleteAllUsers);

// Mostrar la lista de usuarios al cargar la p�gina
displayUsersList();
