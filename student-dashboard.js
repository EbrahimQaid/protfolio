function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}



const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
document.querySelectorAll(".username")[2].innerHTML = currentUser.role + " مرحبا";
document.querySelectorAll(".username")[1].innerHTML = currentUser.role + " مرحبا";

alert(currentUser.role);

$(document).ready(function(){

    $(".testeeeer").css("color", "#ccc");
});


$("change-profile").attr("image0.jpg");