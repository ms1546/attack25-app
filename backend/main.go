package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	questions = append(questions, Question{ID: 1, Question: "Sample Question 1", Answer: "Sample Answer 1"})
	questions = append(questions, Question{ID: 2, Question: "Sample Question 2", Answer: "Sample Answer 2"})

	router := mux.NewRouter()

	router.HandleFunc("/api/register", register).Methods("POST")
	router.HandleFunc("/api/login", login).Methods("POST")
	router.HandleFunc("/api/refresh", refresh).Methods("POST")

	// 認証が必要なエンドポイント
	authRouter := router.PathPrefix("/api").Subrouter()
	authRouter.Use(authMiddleware)
	authRouter.HandleFunc("/questions", getQuestions).Methods("GET")
	authRouter.HandleFunc("/questions", createQuestion).Methods("POST")
	authRouter.HandleFunc("/questions/{id}", getQuestion).Methods("GET")
	authRouter.HandleFunc("/questions/{id}", updateQuestion).Methods("PUT")
	authRouter.HandleFunc("/questions/{id}", deleteQuestion).Methods("DELETE")

	staticFileDirectory := http.Dir("./static")
	staticFileHandler := http.StripPrefix("/static/", http.FileServer(staticFileDirectory))
	router.PathPrefix("/static/").Handler(staticFileHandler)

	router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./static/index.html")
	})

	loggedRouter := handlers.LoggingHandler(os.Stdout, router)

	log.Println("Server started at :8080")
	log.Fatal(http.ListenAndServeTLS(":8080", "server.crt", "server.key", loggedRouter))
}
