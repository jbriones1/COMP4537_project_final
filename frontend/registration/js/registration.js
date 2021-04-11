// When document is ready
$(document).ready(function() {

    // Submit button's onclick
    $("#submitBtn").click(function() {
        // Loading spinner
        $("#loading").css("display", "inline-block");

        // Get values of inputs
        let username = $("#usernameInput").val();
        let password = $("#passwordInput").val();
        let name = $("#nameInput").val();

        // Input validation (Right now just checks if empty)
        // Username
        if (!username || !username.trim()) {
            alert("You have not filled out the username field");
            $("#loading").css("display", "none");
            return;
        } 
        // Password
        if (!password || !password.trim()) {
            alert("You have not filled out the password field");
            $("#loading").css("display", "none");
            return;
        }
        // Name
        if (!name || !name.trim()) {
            alert("You have not filled out the full name field");
            $("#loading").css("display", "none");
            return;
        }

        // Create object to POST
        let userData = {};
        userData.username = username;
        userData.password = password;
        userData.name = name;
        userData.isAdmin = false;

        // POST Call for registration
        $.ajax({
            type: "POST",
            url: 'https://brian-scheduler.herokuapp.com/user',
            data: JSON.stringify(userData),
            crossDomain: true,
            contentType: "application/json",
            success: function(res) {
                $("#loading").css("display", "none");
                let login = {};
                login.username = username;
                login.password = password;
                $.ajax({
                    type: "POST",
                    url: 'https://brian-scheduler.herokuapp.com/login',
                    data: JSON.stringify(login),
                    crossDomain: true,
                    contentType: "application/json",
                    success: function(res) {
                        console.log("success")
                        Cookies.set('aToken', res.accessToken);
                        Cookies.set('rToken', res.refreshToken);
                        Cookies.set('uid', res.user.userID);
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
                    }
                })
            },
            error: function(xhr, status, err) {
                if (xhr.status === 409) {
                    alert("There is already a user with this username");
                    $("#loading").css("display", "none");
                    return;
                }
                
            }
        });
    
    });
});