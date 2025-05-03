package main

import (
	"context"
	"fmt"
	"log"
	"os"

	db "github.com/calaw726/GoReactDemo/db"
	"github.com/gofiber/fiber/v2"
	UUID "github.com/google/uuid"
	"github.com/joho/godotenv"

	"github.com/jackc/pgx/v5/pgxpool"
)

var ctx context.Context
var pool *pgxpool.Pool
var queries *db.Queries

func NewPostgres() error {
	// Load environment variables from .env file
	dbUrl := os.Getenv("POSTGRES_URL")
	if dbUrl == "" {
		return fmt.Errorf("DATABASE_URL not set")
	}
	pool, err := pgxpool.New(ctx, dbUrl)
	if err != nil {
		return err
	}
	queries = db.New(pool)
	if queries == nil {
		return fmt.Errorf("failed to create queries object")
	}
	return nil
}

func getTodos(c *fiber.Ctx) error {
	todos, err := queries.GetTodos(ctx)
	if err != nil {
		return c.Status(500).SendString("Error fetching todos")
	}
	return c.JSON(todos)
}

func createTodo(c *fiber.Ctx) error {
	todo := new(db.Todo)

	if err := c.BodyParser(todo); err != nil {
		return err
	}

	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Todo body is required",
		})
	}

	insertResult, err := queries.CreateTodo(ctx, todo.Body)
	if err != nil {
		return err
	}

	todo.ID = insertResult.ID
	todo.Completed = insertResult.Completed

	return c.Status(201).JSON(todo)

}
func updateTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Todo ID is required",
		})
	}

	idUUID, err := UUID.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid Todo ID",
		})
	}

	_, err = queries.MarkTodoAsCompleted(ctx, idUUID)
	if err != nil {
		return err
	}
	return c.Status(200).JSON(fiber.Map{
		"message": "Todo marked as completed",
	})

}
func deleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Todo ID is required",
		})
	}

	idUUID, err := UUID.Parse(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid Todo ID",
		})
	}

	_, err = queries.DeleteTodo(ctx, idUUID)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "Todo not found",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"success": "true",
	})
}

func main() {
	fmt.Println("Hello, World!")

	err := godotenv.Load(".env")
	if err != nil {
		fmt.Fprintf(os.Stderr, "error loading .env file: %v", err)
		os.Exit(1)
	}

	ctx = context.Background()

	err = NewPostgres()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	defer pool.Close()

	fmt.Println("Query object created successfully")

	app := fiber.New()

	app.Get("/api/todos", getTodos)
	app.Post("/api/todos", createTodo)
	app.Patch("/api/todos/:id", updateTodo)
	app.Delete("/api/todos/:id", deleteTodo)

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	log.Fatal(app.Listen(":" + port))

}
