const modalBody = document.querySelector('.modal_body');

function openModal() {

    document.querySelector('.overlay').style.display = 'block';
    document.querySelector('.modal').classList.add('modalOpen')

}

function closeModal() {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.modal').classList.remove('modalOpen')
}


function teamAddModal() {
    modalBody.innerHTML = "";
    let containerModalDiv = document.createElement("div");
    modalBody.appendChild(containerModalDiv);
    containerModalDiv.classList.add('containerModalDiv');
    let title = document.createElement('h2');
    title.textContent = "Création d'équipe";
    containerModalDiv.appendChild(title);
    let form = document.createElement("form");
    containerModalDiv.appendChild(form)
    form.setAttribute('action', '/teamAdd');
    form.setAttribute('method', 'post');
    let div = document.createElement('div');
    form.appendChild(div);
    let label = document.createElement('label');
    let input = document.createElement('input');
    div.appendChild(label);
    div.appendChild(input);
    label.setAttribute('for', 'name');
    label.textContent = "Nom de l'équipe :";
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'name');
    input.setAttribute('name', 'name');
    let button = document.createElement('button');
    form.appendChild(button);
    button.setAttribute('type', 'register');
    button.textContent = 'Valider';

    openModal();
}


function addPlayer(teamId) {
    modalBody.innerHTML = "";
    let divPlayerAdd = document.createElement("div");
    modalBody.appendChild(divPlayerAdd);
    divPlayerAdd.classList.add('containerModalDiv');
    let title = document.createElement('h2');
    title.textContent = "Ajout de joueur";
    divPlayerAdd.appendChild(title);
    let divBtn = document.createElement('div');
    divBtn.classList.add('divBtn')
    divPlayerAdd.appendChild(divBtn);
    let invitPlayerBtn = document.createElement('button');
    divBtn.appendChild(invitPlayerBtn);
    invitPlayerBtn.addEventListener('click', () => invitPlayer(teamId));
    invitPlayerBtn.textContent = "Inviter un joueur";
    let createPlayerBtn = document.createElement('button');
    divBtn.appendChild(createPlayerBtn);
    createPlayerBtn.addEventListener('click', () => createPlayer(teamId));
    createPlayerBtn.textContent = "Crée un joueur";

    openModal()
}

function invitPlayer(teamId) {
    modalBody.innerHTML = "";
    let containerModalDiv = document.createElement("div");
    modalBody.appendChild(containerModalDiv);
    containerModalDiv.classList.add('containerModalDiv');
    let title = document.createElement('h2');
    title.textContent = "Inviter un joueur";
    containerModalDiv.appendChild(title);
    let form = document.createElement("form");
    containerModalDiv.appendChild(form)
    let hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'teamId');
    hiddenInput.setAttribute('value', teamId);
    form.appendChild(hiddenInput);
    form.setAttribute('action', '/invitPlayer');
    form.setAttribute('method', 'post');
    let div = document.createElement('div');
    form.appendChild(div);
    let label = document.createElement('label');
    let input = document.createElement('input');
    div.appendChild(label);
    div.appendChild(input);
    label.setAttribute('for', 'mail');
    label.textContent = "Adresse mail du joueur :";
    input.setAttribute('type', 'email');
    input.setAttribute('id', 'mail');
    input.setAttribute('name', 'mail');
    let button = document.createElement('button');
    form.appendChild(button);
    button.setAttribute('type', 'submit');
    button.textContent = 'Valider';
}

function createPlayer(teamId){
    modalBody.innerHTML = "";
    let containerModalDiv = document.createElement("div");
    modalBody.appendChild(containerModalDiv);
    containerModalDiv.classList.add('containerModalDiv');
    let title = document.createElement('h2');
    title.textContent = "Créer un joueur";
    containerModalDiv.appendChild(title);
    let form = document.createElement("form");
    containerModalDiv.appendChild(form)
    form.setAttribute('action', '/createPlayer');
    form.setAttribute('method', 'post');
    let hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'teamId');
    hiddenInput.setAttribute('value', teamId);
    form.appendChild(hiddenInput);
    let div = document.createElement('div');
    form.appendChild(div);
    let label = document.createElement('label');
    let input = document.createElement('input');
    div.appendChild(label);
    div.appendChild(input);
    label.setAttribute('for', 'firstname');
    label.textContent = "Nom du joueur :";
    input.setAttribute('type', 'firstname');
    input.setAttribute('id', 'firstname');
    input.setAttribute('name', 'firstname');
    let button = document.createElement('button');
    form.appendChild(button);
    button.setAttribute('type', 'submit');
    button.textContent = 'Valider';
}