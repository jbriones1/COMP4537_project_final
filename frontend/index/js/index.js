// When the document is ready
$(document).ready(function () {
    // If user isn't signed in, redirect to landing page.
    if (!Cookies.get("uid")) {
        location.href = "/"
    } else {
        // Set logout button's onclick to the onClickLogout function
        $("#logOut").click(onClickLogout);
        // Set the new task button's onclick to the onClickNewTask function
        $("#newTaskBtn").click(onClickNewTaskList);
        // Set the go button's onclick to redirect to the task list page
        $('#goBtn').click(() => {
            location.href = "/taskList"
        })
        getNewToken();
        // Get the user data
        getUserData();
        // Check if user is an admin, if so display the admin option, else don't display it
        if (Cookies.get("admin") == 0) {
            $("#nav-admin").css("display", "none")
        } else {
            $("#nav-admin").css("display", "list-item")
        }

        // Check for a today task list 
        checkForTaskList();

        // Check for yesterday's tasks
        getYesterday();
    }
});

// Function used to obtain a new token 
const getNewToken = async () => {
    // req body 
    let req = {token: Cookies.get("rToken")};

    // ajax call
    $.ajax({
        type: "POST",
        url: "http://brian-scheduler.herokuapp.com/token",
        data: JSON.stringify(req),
        crossDomain: true,
        contentType: "application/json",
        success: function (res) {
            console.log("received new token");
            Cookies.set("aToken", res.accessToken);
        },
        error: function (xhr, status, err) {
            // Referesh token is invalid, just sign the user out
            if (xhr.status === 403) {
                alert("Invalid token. Signing out");
            }
        }
    })
}

// Function used to obtain a new token
const getUserData = () => {
    // Access token from Cookies
    let aToken = Cookies.get("aToken");

    // AJAX call to get user
    $.ajax({
        type: "GET",
        url: `https://brian-scheduler.herokuapp.com/v1/user/`,
        crossDomain: true,
        beforeSend: (xhr) => {
            xhr.setRequestHeader('Authorization', `Bearer ${aToken}`)
        },
        contentType: "application/json",
        success: (res) => {
            // Display welcome back message and the header
            $("#name").html(`Welcome Back ${res.name}!`);
            $("#header").css("display", "block");
        },
        error: async (xhr, status, err) => {
            // Error 403: Token has expired
            if (xhr.status === 403) {
                // get new token, then re-call function.
                await getNewToken();
                getUserData();
                return;
            }

            // Error 400: Bad token
            if (xhr.status === 400) {
                alert("Bad token, logging off");
                onClickLogout();
                return;
            }

            // Error 401: Not authenticated
            if (xhr.status === 401) {
                alert("You are not signed in, please go log-in.");
                location.href = "/login"
            }

            // Error 500: Server error
            if (xhr.status === 500) {
                alert("Something went wrong on our end. Please try again");
                return;
            }
        }
    });
}
// Function used to obtain yesterday's task list
const getYesterday = () => {
    // Get the date
    let m = new Date();
    // Build our date string to pass into the request
    let dateString = m.getUTCFullYear() + "-" + (m.getUTCMonth() + 1) + "-" + (m.getUTCDate() - 1)
    // Actual GET request
    $.ajax({
        type: "GET",
        url: `https://brian-scheduler.herokuapp.com/v1/taskList?date=${dateString}`,
        headers: {
            'Authorization': `Bearer ${Cookies.get("aToken")}`
        },
        // Errors while trying to GET yesterday's task list
        error: async (xhr, status, err) => {
            // Bad token error need to refresh
            if (xhr.status === 403) {
                // Get new token 
                await getNewToken()
                // Re-run function
                getYesterday();
            }

            // Error 404: Not found -> Therefore there was no tasklist yesterday. Tell the user this
            if (xhr.status === 404) {
                $("#yesterday").css("display", "block")
                $("#ystdTitle").html("You didn't have any completed tasks yesterday")
            }
        },
        // If getting yesterday's task like is successful,
        success: (res) => {
            // Display the yesterday container
            $("#yesterday").css("display", "block")
            // Empty tasklist case
            if (res.tasks.length === 0) {
                $("#ystdTitle").html("You didn't have any completed tasks yesterday")
            } else {
                // loop through all tasks and append them to the yesterday div
                for (let i = 0; i < res.tasks.length; i++) {
                    if (res.tasks[i].isComplete) {
                        $("#yesterday").append(`<div class="task"><p class="taskText"><b>${res.tasks[i].taskName}</b> - ${res.tasks[i].taskDescription}</p></div>`)
                    }
                }
            }
        }
    })
}

// On Click Logout -> logs the user out of the app.
const onClickLogout = (e) => {
    // Our request
    let req = {token: Cookies.get("rToken")};
    // DELETE call, pass in our refresh token to be deleted from the database
    $.ajax({
        type: "DELETE",
        url: 'https://brian-scheduler.herokuapp.com/logout',
        data: JSON.stringify(req),
        crossDomain: true,
        contentType: "application/json",
        success: (res) => {
            // On success, remove all tokens, redirect to landing
            Cookies.remove("aToken");
            Cookies.remove("rToken");
            Cookies.remove("uid");
            location.href = "/"
        },
        error: function (xhr, status, err) {
            // Server error - just remove the cookies and redirect
            if (xhr.status === 500) {
                alert("Something went wrong on our end, but we will sign you out and redirect.");
                Cookies.remove("aToken");
                Cookies.remove("rToken");
                Cookies.remove("uid");
                location.href = "/"
            }
        }
    });
}

// On click function for a new task list
const onClickNewTaskList = () => {
    //  get today's date
    let m = new Date();
    let dateString = m.getUTCFullYear() + "/" + (m.getUTCMonth() + 1) + "/" + (m.getUTCDate())

    // POST call to create new task list
    $.ajax({
        type: "POST",
        url: `https://brian-scheduler.herokuapp.com/v1/taskList?date=${dateString}`,
        headers: {
            'Authorization': `Bearer ${Cookies.get("aToken")}`
        },
        error: async (xhr, status, err) => {
            // Need to refresh token
            if (xhr.status === 403) {
                await getNewToken();
                onClickNewTaskList();
            }
            // 401: Not authorized/logged in. Sign out
            if (xhr.status === 401) {
                alert("You are not signed in, please log-in.")
                onClickLogout();
                return;
                // $.ajax({
                //     type: "POST",
                //     url: `https://brian-scheduler.herokuapp.com/token`,
                //     crossDomain: true,
                //     contentType: 'application/json',
                //     data: JSON.stringify(Cookies.get("rToken")),
                //     success: function (res) {
                //         // Successfully obtained a new access token, run function again
                //         Cookies.set("aToken", res.accessToken);
                //         onClickNewTaskList();
                //         return;
                //     },
                //     error: function (xhr, status, err) {
                //         // 403: The refresh token is invalid
                //         if (xhr.status === 403) {
                //             alert("You are unauthorized for this session. Please login again.");
                //             onClickLogout();
                //             return;
                //         }

                //         // Something went wrong on our end.
                //         if (xhr.status === 500) {
                //             alert("Something went wrong on our end, please log-in and try again.");
                //             onClickLogout();
                //             return;
                //         }
                //     }
                // })
            }

            // Invalid body || server error. Logout and redirect
            if (xhr.status === 400 || xhr.status === 500) {
                alert("Something went wrong on our end");
                onClickLogout();
            }
        },
        // On success, redirect
        success: (res) => {
            location.href = "/taskList"
        }
    });
}

// Function that checks for a pre-existing task list for the day
const checkForTaskList = () => {
    //  get today's date
    let m = new Date();
    let dateString = m.getUTCFullYear() + "/" + (m.getUTCMonth() + 1) + "/" + (m.getUTCDate())

    // GET call for a task list for today
    $.ajax({
        type: "GET",
        url: `https://brian-scheduler.herokuapp.com/v1/taskList?date=${dateString}`,
        headers: {
            'Authorization': `Bearer ${Cookies.get("aToken")}`
        },
        error: async (xhr, status, err) => {
            // Error 403: Need to refresh token
            if (xhr.status === 403) {
                await getNewToken();
                checkForTaskList();
            }

            // Error 404: Not Found. Therefore we have no task list for the day, display new task list options
            if (xhr.status === 404) {
                $("#newTask").css("display", "block")
                $("#loading").css("display", "none")
                return;
            }

            // status 401: not authenticated, sign them off
            if (xhr.status === 401) {
                alert("You are not signed in, please log-in.")
                onClickLogout();
                return;
            }

            if (xhr.status === 500) {
                alert("Something went wrong on our end, please sign in and try again.");
                onClickLogout();
                return;
            }

        },
        success: (res) => {
            console.log(res);
            // Success case, so there is a task list for today
            // set tasklistId in cookies for ease
            Cookies.set("taskList", res.taskListID);
            $('#goTo').css('display', 'block')
            // display go to task list button
            $("#content").css("display", "block");
            $("#loadingContainer").css("display", "none");
        }
    })
}