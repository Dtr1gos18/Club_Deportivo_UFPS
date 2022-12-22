let abrirModal = document.getElementById('abrirModal');
let modal = document.getElementById('modal');
let cerrarModal = document.getElementById('cerrarModal');

abrirModal.addEventListener('click', function(){
    modal.style.visibility = 'visible';
});

cerrarModal.addEventListener('click', function(){
    modal.style.visibility = 'hidden';
});
