function openModal(){
   
        document.querySelector('.overlay').style.display ='block' ;
        document.querySelector('.modal').classList.add('modalOpen')
       
}

function closeModal(){
    document.querySelector('.overlay').style.display ='none' ;
    document.querySelector('.modal').classList.remove('modalOpen')   
}

