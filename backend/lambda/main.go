// main.go
package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

type Question struct {
	ID            int      `json:"id"`
	Question      string   `json:"question"`
	Options       []string `json:"options"`
	CorrectOption int      `json:"correct_option"`
}

func init() {
	var err error
	dsn := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_NAME"),
	)
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
}

func Handler(ctx context.Context) (Question, error) {
	var q Question
	var option1, option2, option3, option4 string

	tx, err := db.Begin()
	if err != nil {
		return q, err
	}

	row := tx.QueryRow("SELECT id, question, option1, option2, option3, option4, correct_option FROM Questions WHERE is_asked = FALSE ORDER BY id ASC LIMIT 1")
	if err := row.Scan(&q.ID, &q.Question, &option1, &option2, &option3, &option4, &q.CorrectOption); err != nil {
		tx.Rollback()
		return q, err
	}

	q.Options = []string{option1, option2, option3, option4}

	_, err = tx.Exec("UPDATE Questions SET is_asked = TRUE WHERE id = ?", q.ID)
	if err != nil {
		tx.Rollback()
		return q, err
	}

	err = tx.Commit()
	if err != nil {
		return q, err
	}

	return q, nil
}

func main() {
	lambda.Start(Handler)
}
