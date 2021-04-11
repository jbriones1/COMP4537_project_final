BASE URL OF API:
https://brian-scheduler.herokuapp.com/v1

- * indicates the route

TOKEN TO USE:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjI3NCwidXNlcm5hbWUiOiJhZG1pbiIsIm5hbWUiOiJKb24iLCJpc0FkbWluIjoxLCJpYXQiOjE2MTgwMjgxMzV9.Ly6N54L0VPKxJd_BlL0PHS1oyrJgNHjgrSRZqt6eSDY

- Make sure to set this as an 'Authorization' header with the value 'Bearer [TOKEN HERE]' on each API call


POST /task: https://brian-scheduler.herokuapp.com/v1/task
---------------------------------------------------------------------------------------------------
BODY: raw - JSON

{
	"taskName": "test name",
	"taskDescription": "test description",
	"isComplete": false,
	"taskListID":  284
}


POST /moveTasks: https://brian-scheduler.herokuapp.com/v1/task/moveTasks?date=2021-04-09
---------------------------------------------------------------------------------------------------
QUERY
date: Format of date can be YYYY/MM/DD or YYYY/M/D or YYYY-MM-DD or YYYY-M-D


PUT /task/{taskID}: https://brian-scheduler.herokuapp.com/v1/154
---------------------------------------------------------------------------------------------------
BODY: raw - JSON
{
  "taskName": "change name",
  "taskDescription": "change description",
  "isComplete": false
}


PUT /task/{taskID}/complete: https://brian-scheduler.herokuapp.com/v1/154/complete
---------------------------------------------------------------------------------------------------
PATH:
taskID: must be a valid integer of something in the database


DELETE /task/{taskID}: https://brian-scheduler.herokuapp.com/v1/task/154
---------------------------------------------------------------------------------------------------
QUERY
date: Format of date can be YYYY/MM/DD or YYYY/M/D or YYYY-MM-DD or YYYY-M-D

POST /taskList: https://brian-scheduler.herokuapp.com/v1/taskList/?date=2021-12-31
---------------------------------------------------------------------------------------------------
QUERY
date: Format of date can be YYYY/MM/DD or YYYY/M/D or YYYY-MM-DD or YYYY-M-D

GET /taskList: https://brian-scheduler.herokuapp.com/v1/taskList/?date=2021-12-31
---------------------------------------------------------------------------------------------------
PATH:
taskID: must be a valid integer of something in the database

DELETE /taskList/{taskID}: https://brian-scheduler.herokuapp.com/v1/taskList/294
---------------------------------------------------------------------------------------------------
PATH:
taskID: must be a valid integer of something in the database

GET /user: https://brian-scheduler.herokuapp.com/v1/user
---------------------------------------------------------------------------------------------------


GET /admin/stats: https://brian-scheduler.herokuapp.com/v1/admin/stats
---------------------------------------------------------------------------------------------------