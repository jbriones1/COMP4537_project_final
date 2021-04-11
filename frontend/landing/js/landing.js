// When document is ready,
$(document).ready(() => {
    // See if there is an access token, if there is then redirect to welcome, else display this page
    if (Cookies.get('aToken')) {
        location.href= "/welcome"
    } else {
        $("body").css("display", "block")
    }

    // Login button
    $("#loginBtn").click(() => {
        location.href = "/login"
    });

    // Register button
    $("#registerBtn").click(() => {
        location.href = "/register"
    });
})