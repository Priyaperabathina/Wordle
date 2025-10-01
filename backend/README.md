# Wordle - Backend

Spring Boot backend for the Wordle clone game.

## Features

- User and Game entities with JPA mappings
- JWT authentication and role-based access
- Player and Admin API endpoints
- MySQL database integration
- Daily game tracking and reporting

## Tech Stack

- Spring Boot 3.x, Java 17+, Maven
- Spring Security + JWT
- Spring Data JPA (Hibernate)
- MySQL

## Project Structure
src/main/java/com/example/wordle/

├── model/        # Entities (User, Game, Word)

├── repository/   # JPA repositories

├── service/      # Business logic

├── controller/   # API endpoints

└── config/       # Security, CORS


## Setup

```bash
cd backend
# Configure MySQL in src/main/resources/application.properties
mvn spring-boot:run
```

The backend runs on http://localhost:9090
