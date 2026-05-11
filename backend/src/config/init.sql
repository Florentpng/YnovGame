-- CREATE TABLE IF NOT EXISTS GAMESAVE (
-- 	id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT,
--     FOREIGN KEY (user_id) REFERENCES USERS(id),
--     trainerType INT  NOT NULL,
--     x_pos FLOAT,
--     y_pos FLOAT,
--     savedAt DATE,
--     pokemon TEXT
-- );

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) UNIQUE NOT NULL,
    isDev BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);