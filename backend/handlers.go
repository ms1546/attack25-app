package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

func getQuestions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(questions); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func createQuestion(w http.ResponseWriter, r *http.Request) {
	var question Question
	_ = json.NewDecoder(r.Body).Decode(&question)
	question.ID = len(questions) + 1
	questions = append(questions, question)
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(question); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func getQuestion(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])
	for _, item := range questions {
		if item.ID == id {
			w.Header().Set("Content-Type", "application/json")
			if err := json.NewEncoder(w).Encode(item); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}
	}
	w.WriteHeader(http.StatusNotFound)
	if err := json.NewEncoder(w).Encode(map[string]string{"message": "Question not found"}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func updateQuestion(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])
	for index, item := range questions {
		if item.ID == id {
			questions = append(questions[:index], questions[index+1:]...)
			var question Question
			_ = json.NewDecoder(r.Body).Decode(&question)
			question.ID = item.ID
			questions = append(questions, question)
			w.Header().Set("Content-Type", "application/json")
			if err := json.NewEncoder(w).Encode(question); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}
	}
	w.WriteHeader(http.StatusNotFound)
	if err := json.NewEncoder(w).Encode(map[string]string{"message": "Question not found"}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func deleteQuestion(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])
	for index, item := range questions {
		if item.ID == id {
			questions = append(questions[:index], questions[index+1:]...)
			w.Header().Set("Content-Type", "application/json")
			if err := json.NewEncoder(w).Encode(map[string]string{"message": "Question deleted"}); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}
	}
	w.WriteHeader(http.StatusNotFound)
	if err := json.NewEncoder(w).Encode(map[string]string{"message": "Question not found"}); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func register(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	user := User{
		ID:       len(users) + 1,
		Username: creds.Username,
		Password: string(hashedPassword),
	}

	users = append(users, user)
	w.WriteHeader(http.StatusCreated)
}

func login(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var storedUser User
	for _, user := range users {
		if user.Username == creds.Username {
			storedUser = user
		}
	}

	if storedUser.Username == "" || bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(creds.Password)) != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(10 * time.Second) // 短い有効期限に設定
	claims := &Claims{
		Username: creds.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	})
}

func refresh(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	tokenStr := cookie.Value
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// トークンの期限を確認し、期限が30秒未満の場合にリフレッシュを許可
	if time.Until(time.Unix(claims.ExpiresAt, 0)) > 30*time.Second {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	expirationTime := time.Now().Add(5 * time.Minute)
	claims.ExpiresAt = expirationTime.Unix()
	token = jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   tokenString,
		Expires: expirationTime,
	})
}
