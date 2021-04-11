// When document is ready
$(document).ready(function () {

    // If admin cookie is not set, redirect to landing, else get the admin data
    if (!Cookies.get("admin")) {
        location.href = "/"
    } else {
        if (Cookies.get("admin") === "1") {
            getAdminData();
        }
    }
});

// Function used to obtain the admin data.
const getAdminData = () => {
    // GET request
    $.ajax({
        type: 'GET',
        url: 'https://brian-scheduler.herokuapp.com/v1/admin/stats',
        headers: {
            'Authorization': `Bearer ${Cookies.get("aToken")}`
        },
        success: (res) => {
            // On success, loop through response
            res.forEach(element => {
                // Getting required fields from each element
                let method = element.httpMethod;
                let endpoint = element.endpoint;
                let requests = element.requests;
    
                // Creating the <tr>
                let content = `<tr><th scope="row">${method}</th><td>${endpoint}</td><td>${requests}</td></tr>`

                // appending
                $('tbody').append(content);

                // Display when finished
                $('#content').css('display', 'block')
                $('#error').css('display', 'none')
            });
        },
        error: (xhr, status, err) => {
            // Not authenticated, try to refresh token
            if (xhr.status === 401) {
                let req = { token: Cookies.get("rToken") }
                $.ajax({
                    type: "POST",
                    url: `https://brian-scheduler.herokuapp.com/token`,
                    crossDomain: true,
                    contentType: 'application/json',
                    data: JSON.stringify(req),
                    success: function (res) {
                        // Successfully obtained a new access token, run function again
                        Cookies.set("aToken", res.accessToken);
                        getAdminData();
                        return;
                    },
                    error: function (xhr, status, err) {
                        // 403: The refresh token is invalid
                        if (xhr.status === 403) {
                            alert("You are unauthorized for this session. Please login again.");
                            onClickLogout();
                            return;
                        }

                        // Something went wrong on our end.
                        if (xhr.status === 500) {
                            alert("Something went wrong on our end, please log-in and try again.");
                            onClickLogout();
                            return;
                        }
                    }
                })
            }
            // Unauthorized to view this page.
            if (xhr.status === 403) {
                $('#content').css('display', 'none');
                $('#error').css('display', 'block')
                return;
            }

        }
    })
}