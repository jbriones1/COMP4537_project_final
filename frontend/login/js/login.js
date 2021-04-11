$(document).ready(function() {
    console.log("ready");

    // Submit button's onclick
    $("#submitBtn").click(function() {
        // Get values of inputs
        let username = $("#usernameInput").val();
        let password = $("#passwordInput").val();

        // Input validation (Right now just checks if empty)
        // Username
        if (!username || !username.trim()) {
            alert("You have not filled out the username field");
            return;
        } 
        // Password
        if (!password || !password.trim()) {
            alert("You have not filled out the password field");
            return;
        }

        // Create object to POST
        let userData = {};
        userData.username = username;
        userData.password = password;

        // POST Call for login
        $.ajax({
            type: "POST",
            url: 'https://brian-scheduler.herokuapp.com/login',
            data: JSON.stringify(userData),
            crossDomain: true,
            contentType: "application/json",
            success: function(res) {
                Cookies.set('aToken', res.accessToken);
                Cookies.set('rToken', res.refreshToken);
                Cookies.set('uid', res.user.userID);
                console.log(res)
                Cookies.set('admin', res.user.isAdmin);
                location.href = "/welcome"
            },
            error: function(xhr, status, err) {
                console.log(xhr, status, err);
                if (xhr.status === 400) {
                    alert("The credentials you have entered don't seem to match what we have. Please try again.");
                    $("#usernameInput").val("");
                    $("#passwordInput").val("");
                    return;
                }

                if (xhr.status === 500) {
                    alert("Something went wrong on our end. Please try again :)");
                    $("#usernameInput").val("");
                    $("#passwordInput").val("");
                    return;
                }

                
            },
        });
    
    });
});