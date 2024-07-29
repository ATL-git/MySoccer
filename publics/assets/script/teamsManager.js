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
    modalBody.innerHTML="";
    let divTeamAdd = document.createElement("div");
    modalBody.appendChild(divTeamAdd);
    divTeamAdd.classList.add('teamCreate');
    let title = document.createElement('h2');
    title.textContent="Création d'équipe";
    divTeamAdd.appendChild(title);
    let form = document.createElement("form");
    divTeamAdd.appendChild(form)
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


function addPlayer(){
    
}