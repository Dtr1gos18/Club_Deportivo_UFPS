var habilitarname = document.getElementById("name");
var habilitarlastName = document.getElementById("lastName");
var habilitaremail = document.getElementById("email");
var habilitarpassword = document.getElementById("password");

//habilitar
document.getElementById("habilitar").addEventListener("click", function (e) {
    habilitarname.disabled = false;
});
document.getElementById("habilitar").addEventListener("click", function (e) {
    habilitarlastName.disabled = false;
});
document.getElementById("habilitar").addEventListener("click", function (e) {
    habilitaremail.disabled = false;
});
document.getElementById("habilitar").addEventListener("click", function (e) {
    habilitarpassword.disabled = false;
});

//desabilitar
document.getElementById("desabilitar").addEventListener("click", function (e) {
    habilitarname.disabled = true;
});
document.getElementById("desabilitar").addEventListener("click", function (e) {
    habilitarlastName.disabled = true;
});
document.getElementById("desabilitar").addEventListener("click", function (e) {
    habilitaremail.disabled = true;
});
document.getElementById("desabilitar").addEventListener("click", function (e) {
    habilitarpassword.disabled = true;
});
