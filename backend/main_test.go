package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
)

func TestRegister(t *testing.T) {
	resetData()
	router := setupRouter()
	payload := `{"username":"testuser","password":"testpassword"}`
	req, _ := http.NewRequest("POST", "/api/register", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusCreated, rr.Code)
}

func TestLogin(t *testing.T) {
	resetData()
	router := setupRouter()

	payload := `{"username":"testuser","password":"testpassword"}`
	req, _ := http.NewRequest("POST", "/api/register", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	assert.Equal(t, http.StatusCreated, rr.Code)

	loginPayload := `{"username":"testuser","password":"testpassword"}`
	req, _ = http.NewRequest("POST", "/api/login", strings.NewReader(loginPayload))
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	assert.NotEmpty(t, rr.Header().Get("Set-Cookie"))
}

func TestGetQuestions(t *testing.T) {
	resetData()
	router := setupRouter()

	payload := `{"username":"testuser","password":"testpassword"}`
	req, _ := http.NewRequest("POST", "/api/register", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	req, _ = http.NewRequest("POST", "/api/login", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	cookie := rr.Header().Get("Set-Cookie")

	req, _ = http.NewRequest("GET", "/api/questions", nil)
	req.Header.Set("Cookie", cookie)
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	assert.Contains(t, rr.Body.String(), "Sample Question 1")
}

func TestCreateQuestion(t *testing.T) {
	resetData()
	router := setupRouter()

	payload := `{"username":"testuser","password":"testpassword"}`
	req, _ := http.NewRequest("POST", "/api/register", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	req, _ = http.NewRequest("POST", "/api/login", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	cookie := rr.Header().Get("Set-Cookie")

	newQuestion := `{"Question":"New Question","Answer":"New Answer"}`
	req, _ = http.NewRequest("POST", "/api/questions", strings.NewReader(newQuestion))
	req.Header.Set("Cookie", cookie)
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	assert.Contains(t, rr.Body.String(), "New Question")
}

func TestGetQuestion(t *testing.T) {
	resetData()
	router := setupRouter()

	payload := `{"username":"testuser","password":"testpassword"}`
	req, _ := http.NewRequest("POST", "/api/register", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	req, _ = http.NewRequest("POST", "/api/login", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	cookie := rr.Header().Get("Set-Cookie")

	req, _ = http.NewRequest("GET", "/api/questions/1", nil)
	req.Header.Set("Cookie", cookie)
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	assert.Contains(t, rr.Body.String(), "Sample Question 1")

	req, _ = http.NewRequest("GET", "/api/questions/999", nil)
	req.Header.Set("Cookie", cookie)
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusNotFound, rr.Code)
	assert.Contains(t, rr.Body.String(), "Question not found")
}

func TestUpdateQuestion(t *testing.T) {
	resetData()
	router := setupRouter()

	payload := `{"username":"testuser","password":"testpassword"}`
	req, _ := http.NewRequest("POST", "/api/register", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	req, _ = http.NewRequest("POST", "/api/login", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	cookie := rr.Header().Get("Set-Cookie")

	updatedQuestion := `{"Question":"Updated Question","Answer":"Updated Answer"}`
	req, _ = http.NewRequest("PUT", "/api/questions/1", strings.NewReader(updatedQuestion))
	req.Header.Set("Cookie", cookie)
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	assert.Contains(t, rr.Body.String(), "Updated Question")

	req, _ = http.NewRequest("PUT", "/api/questions/999", strings.NewReader(updatedQuestion))
	req.Header.Set("Cookie", cookie)
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusNotFound, rr.Code)
	assert.Contains(t, rr.Body.String(), "Question not found")
}

func TestDeleteQuestion(t *testing.T) {
	resetData()
	router := setupRouter()

	payload := `{"username":"testuser","password":"testpassword"}`
	req, _ := http.NewRequest("POST", "/api/register", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	req, _ = http.NewRequest("POST", "/api/login", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	cookie := rr.Header().Get("Set-Cookie")

	req, _ = http.NewRequest("DELETE", "/api/questions/1", nil)
	req.Header.Set("Cookie", cookie)
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	assert.Contains(t, rr.Body.String(), "Question deleted")

	req, _ = http.NewRequest("DELETE", "/api/questions/999", nil)
	req.Header.Set("Cookie", cookie)
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusNotFound, rr.Code)
	assert.Contains(t, rr.Body.String(), "Question not found")
}

func TestRefresh(t *testing.T) {
	resetData()
	router := setupRouter()

	payload := `{"username":"testuser","password":"testpassword"}`
	req, _ := http.NewRequest("POST", "/api/register", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	req, _ = http.NewRequest("POST", "/api/login", strings.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)
	cookie := rr.Header().Get("Set-Cookie")

	time.Sleep(10 * time.Second)

	req, _ = http.NewRequest("POST", "/api/refresh", nil)
	req.Header.Set("Cookie", cookie)
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	assert.Equal(t, http.StatusOK, rr.Code)
	assert.NotEmpty(t, rr.Header().Get("Set-Cookie"))
}

func setupRouter() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/api/register", register).Methods("POST")
	router.HandleFunc("/api/login", login).Methods("POST")
	router.HandleFunc("/api/refresh", refresh).Methods("POST")

	authRouter := router.PathPrefix("/api").Subrouter()
	authRouter.Use(authMiddleware)
	authRouter.HandleFunc("/questions", getQuestions).Methods("GET")
	authRouter.HandleFunc("/questions", createQuestion).Methods("POST")
	authRouter.HandleFunc("/questions/{id}", getQuestion).Methods("GET")
	authRouter.HandleFunc("/questions/{id}", updateQuestion).Methods("PUT")
	authRouter.HandleFunc("/questions/{id}", deleteQuestion).Methods("DELETE")

	return router
}

func resetData() {
	users = []User{}
	questions = []Question{
		{ID: 1, Question: "Sample Question 1", Answer: "Sample Answer 1"},
		{ID: 2, Question: "Sample Question 2", Answer: "Sample Answer 2"},
	}
}
