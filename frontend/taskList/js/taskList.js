// When the document is loaded
$(document).ready(() => {
    // If not signed in, redirect to landing
    if (!Cookies.get("aToken")) {
        location.href = "/"
    } else {
        // Display the loader
        $("#loader").css("display", "block");
        // Hide the content container
        $("#content").css("display", "none");
        // Get the tasks
        getTasks();
        // Add click listeners
        $("#addBtn").click(onClickAdd)
        $("#saveBtn").click(onClickSave);
        $("#pushBtn").click(onClickPush);
        $("#logOut").click(onClickLogout);
        $('#backBtn').click(() => {
            location.href = "/welcome"
        })
        $('#dltAllBtn').click(onClickDeleteAll)
    }

});

// Function used to delete everything (starts new task list and deletes everything)
const onClickDeleteAll = () => {
    $.ajax({
        type: "DELETE",
        url: `https://brian-scheduler.herokuapp.com/v1/taskList/${Cookies.get("taskList")}`,
        headers: {
            'Authorization': `Bearer ${Cookies.get("aToken")}`
        },
        success: (res) => {
            onClickNewTask();
            return;
        },
        error: async (xhr, status, err) => {
            switch (xhr.status) {
                case 400:
                case 500:
                case 404: {
                    alert("Something went wrong on our end");
                    return;
                }
                case 401: {
                    alert("Not authenticated, redirecting")
                    onClickLogout();
                    return;
                }
                case 403: {
                    await getNewToken();
                    onClickDeleteAll();
                }
            }
        }
    })
}

// Function used to obtain a new token 
const getNewToken = async () => {
    // req body 
    let req = { token: Cookies.get("rToken") };

    // ajax call
    $.ajax({
        type: "POST",
        url: "http://brian-scheduler.herokuapp.com/token",
        data: JSON.stringify(req),
        crossDomain: true,
        contentType: "application/json",
        success: function (res) {
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

// Function used to create a new task list
const onClickNewTask = () => {
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
            // 403: , try to refresh token
            if (xhr.status === 403) {
                await getNewToken();
                onClickNewTask();
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
                //         onClickNewTask();
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

            // 400 || 500, something went wrong on our end
            if (xhr.status === 400 || xhr.status === 500) {
                alert("Something went wrong on our end");
                location.href = "/taskList"
            }

            // 401: Not authenticated, log out and redirect
            if (xhr.status === 401) {
                alert("You are not signed in.")
                onClickLogout();
            }
        },
        // Success
        success: (res) => {
            // Obtain task list
            getTasks();
            location.href="/taskList"
        }
    });
}

// Push tasks to the next day
const onClickPush = () => {
    //  get today's date
    let m = new Date();
    let dateString = m.getUTCFullYear() + "/" + (m.getUTCMonth() + 1) + "/" + (m.getUTCDate())

    // If there are no unfinished tasks,
    if ($(".todoTask").length === 0) {
        alert("You have no unfinished tasks");
        return;
    } else {
        // POST call to push tasks
        $.ajax({
            type: "POST",
            url: `https://brian-scheduler.herokuapp.com/v1/task/moveTasks?date=${dateString}`,
            headers: {
                'Authorization': `Bearer ${Cookies.get("aToken")}`
            },
            crossDomain: true,
            // On success just refresh the dom with the tasks
            success: (res) => {
                getTasks();
                return;
            },
            error: async (xhr, status, err) => {
                switch (xhr.status) {
                    // Invalid input
                    case 400:
                    // Server error
                    case 500:
                    // Not found
                    case 404: {
                        alert("Something went wrong on our end");
                        onClickLogout();
                        return;
                    }
                    // Not authenticated
                    case 401: {
                        alert("Not authenticated, redirecting you.")
                        onClickLogout();
                        return;
                    }
                    // Need a new token
                    case 403: {
                        await getNewToken();
                        onClickPush();
                        return;
                    }
                }
            }
        })
    }
}

// On Click Logout -> logs the user out of the app.
const onClickLogout = (e) => {
    // Our request
    let req = { token: Cookies.get("rToken") };
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

// Get TaskList
const getTasks = () => {
    //  get today's date
    let m = new Date();
    let dateString = m.getUTCFullYear() + "/" + (m.getUTCMonth() + 1) + "/" + (m.getUTCDate())
    // GET Request for today's task list
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
                getTasks();
                return;
                // let req = { token: Cookies.get("rToken") }
                // $.ajax({
                //     type: "POST",
                //     url: `https://brian-scheduler.herokuapp.com/token`,
                //     crossDomain: true,
                //     contentType: 'application/json',
                //     data: JSON.stringify(req),
                //     success: function (res) {
                //         // Successfully obtained a new access token, run function again
                //         Cookies.set("aToken", res.accessToken);
                //         getTasks();
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
        },
        success: (res) => {
            // Success case, so there is a task list for today
            // set tasklistId in cookies for ease
            Cookies.set("taskList", res.taskListID);
            console.log(res);

            // Make loader invisible, make content visible
            $("#loader").css("display", "none");
            $("#content").css("display", "block");

            // Check if there are tasks:
            if (res.tasks.length === 0) {
                $("#prompt").html("You have no tasks!")
                $("#completedTasks").css("display", "none")
                $("#incompleteTasks").css("display", "none")
            } else {
                // render them if there are.
                renderCurrentTasks(res.tasks);
            }
        }
    })
}

// Rendering the passed in tasks
const renderCurrentTasks = (taskList) => {
    // Empty prompt
    $("#prompt").html("")
    // Display the following containers
    $("#completedTasks").css("display", "block")
    $("#incompleteTasks").css("display", "block")
    // Remove all previous tasks
    $('.todoTaskContainer').remove();
    $('.completed').remove();
    // Loop through tasks
    for (let i = 0; i < taskList.length; i++) {
        // rendering complete tasks
        if (taskList[i].isComplete) {
            $("#completedTasks").append(`<div class="completed bg-success">
                <p class="description"><span class="taskName">${taskList[i].taskName}</span> - ${taskList[i].taskDescription}</p>
                </div>`)
        } else {
            // Else, render incomplete tasks
            $("#incompleteTasks").append(`<div class="todoTaskContainer task-${i}-container bg-info input-group mb-3">
                <div class="input-group-prepend">
                    <div class="checkbox-${taskList[i].taskID} checkbox input-group-text">
                        <input type="checkbox" class="checkbox-${i}"aria-label="Checkbox for following task">
                    </div>
                </div>
                <div class="todoTask" id="todoTask-${taskList[i].taskID}">
                    <span class="taskName">${taskList[i].taskName}</span> - ${taskList[i].taskDescription}
                </div>
            </div>`);

            // Give each task box an onclick
            $(`#todoTask-${taskList[i].taskID}`).click(() => {
                // When clicked, give each edit button in the modal this on click function
                $('#editBtn').click(() => {
                    // Fill in input values with the current values
                    $('#editTaskName').val(taskList[i].taskName);
                    $('#editTaskDescription').val(taskList[i].taskDescription);
                    // Show the modal
                    $('#editModal').modal('show');
                    // Give each save button in the modal this on click
                    $('#editSaveBtn').click(() => {
                        
                        // Obtain the values from the input fields
                        let updatedName = $('#editTaskName').val();
                        let updatedDescription = $('#editTaskDescription').val();
                        // Create a request body
                        let req = { taskName: updatedName, taskDescription: updatedDescription, isComplete: taskList[i].isComplete }
                        // PUT request to edit the task
                        console.log("editsave", req);
                        $.ajax({
                            type: "PUT",
                            url: `https://brian-scheduler.herokuapp.com/v1/task/${taskList[i].taskID}`,
                            headers: {
                                'Authorization': `Bearer ${Cookies.get("aToken")}`
                            },
                            crossDomain: true,
                            contentType: 'application/json',
                            data: JSON.stringify(req),
                            success: (res) => {
                                // Refresh tasks
                                getTasks();
                                // Hide modals
                                $('#editModal').modal('hide');
                                // Unbind click events
                                $('#editBtn').unbind('click')
                                $('#editSaveBtn').unbind('click')
                                $('#dltBtn').unbind('click')
                                return;
                            },
                            error: async (xhr, status, err) => {
                                switch (xhr.status) {
                                    // Invalid parameter or body
                                    case 400:
                                    // Server error
                                    case 500:
                                    // Not found
                                    case 404: {
                                        alert("Something went wrong on our end");
                                        onClickLogout();
                                        return;
                                    }
                                    // Not authenticated
                                    case 401: {
                                        alert("You are not logged in, please sign in")
                                        onClickLogout();
                                        return;
                                    }
                                    // Need a new token
                                    case 403: {
                                        await getNewToken();
                                        getTasks();
                                        alert("Sorry, something went wrong on our end, please try again.");
                                        return;
                                    }
                                }
                            }
                        })
                    })
                });

                // Give delete button in modal this click function
                $('#dltBtn').click(() => {
                    console.log("dltbtn", taskList[i]);
                    // Delete the task
                    $.ajax({
                        type: "DELETE",
                        url: `https://brian-scheduler.herokuapp.com/v1/task/${taskList[i].taskID}`,
                        headers: {
                            'Authorization': `Bearer ${Cookies.get("aToken")}`
                        },
                        crossDomain: true,
                        success: (res) => {
                            // re-render tasks
                            getTasks();
                            // close the options modal
                            $('#optionsModal').modal('hide');
                            // unbind the click event
                            $('#dltBtn').unbind('click');
                            return;
                        },
                        error: async (xhr, status, err) => {
                            switch (xhr.status) {
                                // Invalid parameter
                                case 400:
                                // Server error
                                case 500:
                                // Not found
                                case 404: {
                                    alert("Something went wrong on our end");
                                    onClickLogout();
                                    return;
                                }
                                // Not authenticated
                                case 401: {
                                    alert("You are not logged in, please sign in");
                                    onClickLogout();
                                    return;
                                }
                                // Need a new token
                                case 403: {
                                    await getNewToken();
                                    getTasks();
                                    alert("Sorry, something went wrong on our end, please try again.");
                                    return;
                                }
                            }
                        }
                    })
                })
                // Show the options modal 
                $('#optionsModal').modal('show');
            });

            // add listeners to the check boxes
            $(`input.checkbox-${i}`).change(() => {
                console.log(taskList[i]);
                // mark a task as complete
                $.ajax({
                    type: "PUT",
                    url: `https://brian-scheduler.herokuapp.com/v1/task/${taskList[i].taskID}/complete`,
                    headers: {
                        'Authorization': `Bearer ${Cookies.get("aToken")}`
                    },
                    success: (res) => {
                        $(`div.task-${i}-container`).remove();
                        $("#completedTasks").append(`<div class="completed bg-success">
                        <p class="description"><span class="taskName">${taskList[i].taskName}</span> - ${taskList[i].taskDescription}</p>
                        </div>`)
                    },
                    error: async (xhr, status, err) => {
                        switch (xhr.status) {
                            // server error
                            case 500:
                            // not found
                            case 404:
                            // invalid parameter
                            case 400: {
                                alert("Something went wrong on our end. Please log-in and try again");
                                onClickLogout();
                                return;
                            }
                            // 401: Not signed in
                            case 401: {
                                alert("You are not signed in, please log-in.");
                                onClickLogout();
                                return;
                            }
                            // 403: new token required
                            case 403: {
                                await getNewToken();
                                alert("Something went wrong on our end, please try again");
                                getTasks();
                                return;
                            }
                        }
                    }
                })
            });
        }
    }
}

// When a user clicks the plus button to add a new task
const onClickAdd = (() => {
    // if there are no current new task containers, make save button appear
    if ($("div.newTask").length == 0) {
        $("#saveBtn").css("display", "inline-block");
    } else if ($("div.newTask").length == 1) {
        // if there is 1+ new task container, make the save button say save all
        $("#saveBtn").html("Save All");
    }
    // display the new tasks container
    $("#newTasksContainer").css("display", "block");
    // build the new task form
    $("#newTasksContainer").append(`            <div class="newTask">
    <p id="newTaskTitle">New Task</p>
    <div class="input-group mb-3 taskName">
        <span class="bg-info input-group-text">Task</span>
        <input required type="text" class="form-control new-task-name" aria-label="taskName" aria-describedby="taskName"
            placeholder="Go for a jog, read 15 pages, ...">
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="bg-info input-group-text">Description</span>
        </div>
        <textarea
            placeholder="Does not need to be finished today, remember to set an alarm for 12 minutes, ..."
            class="form-control task-description" aria-label="taskDescription"></textarea>
    </div>
</div>`)
})

// When the save button is clicked, this function is called
const onClickSave = (() => {
    // taskNames
    let taskNames = []
    $.each($("input.new-task-name"), (index, ele) => {
        taskNames.push($(ele).val());
    });

    // taskDescriptions
    let taskDescs = [];
    $.each($("textarea.task-description"), (index, ele) => {
        taskDescs.push($(ele).val());
    });

    // build tasks
    let tasks = [];
    let incomplete = [];
    $.each(taskNames, (index, ele) => {
        // Check for incomplete new tasks
        if (ele.trim().length !== 0 && taskDescs[index].trim().length !== 0) {
            tasks.push({ taskName: ele, taskDescription: taskDescs[index], isComplete: false, taskListID: parseInt(Cookies.get('taskList')) });
        } else {
            incomplete.push(index + 1);
        }
    });

    // If there are incomplete tasks, alert user to fill them out
    if (incomplete.length > 0) {
        let prompt = `New Task(s): ${incomplete.join(", ")} are missing fields. All fields are required`;
        alert(prompt)
    }

    // Loop through and posts tasks
    $.each(tasks, (index, ele) => {
        console.log(ele)
        postTask(ele);
    });
});

// Function used to post a task
const postTask = (task) => {
    // POST CALL
    $.ajax({
        type: "POST",
        url: "https://brian-scheduler.herokuapp.com/v1/task",
        crossDomain: true,
        data: JSON.stringify(task),
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ${Cookies.get("aToken")}`
        },
        success: (res) => {
            // re-render tasks and get rid of new task forms
            $("#newTasksContainer").css("display", "none")
            $("#saveBtn").css("display", "none")
            $("div.newTask").remove();
            getTasks();
            return;
        },
        error: async (xhr, status, err) => {
            switch (xhr.status) {
                // server error
                case 500:
                // invalid input
                case 400: {
                    console.log(xhr)
                    alert("Something went wrong on our end, please log-in and try again");
                    onClickLogout();
                    return;
                }
                // Not logged in
                case 401: {
                    alert("You are not signed in, please log in.");
                    onClickLogout();
                    return;
                }
                // Need new token
                case 403: {
                    await getNewToken();
                    postTask(task);
                }
            }
        }
    })
}