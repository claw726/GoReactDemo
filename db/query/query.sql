-- name: CreateTodo :one
INSERT INTO todos (body)
VALUES ($1)
RETURNING id, body, completed;

-- name: GetTodos :many
SELECT * FROM todos
ORDER BY id;

-- name: GetTodo :one
SELECT * FROM todos
WHERE id = $1;

-- name: MarkTodoAsCompleted :one
UPDATE todos
SET completed = TRUE
WHERE id = $1
RETURNING id, body, completed;

-- name: DeleteTodo :one
DELETE FROM todos
WHERE id = $1
RETURNING id, body, completed;