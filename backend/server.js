const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 1234;
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("./face_recognition.db", (err) => {
    if (err) {
        console.error("Error opening database:", err);
    } else {
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                descriptor TEXT,
                visits INTEGER DEFAULT 1
            )`
        );
        console.log("Database connected.");
    }
});

app.post("/verify-face", (req, res) => {
    const { descriptor } = req.body;
    if (!descriptor) {
        return res.status(400).json({ message: "No face data received." });
    }

    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ message: "Database error." });
        }

        if (!rows || rows.length === 0) {
            console.log("No users found. Registering new user.");
            return registerNewUser(descriptor, res);
        }

        let foundUser = null;
        rows.forEach((row) => {
            const savedDescriptor = JSON.parse(row.descriptor);
            const distance = calculateEuclideanDistance(descriptor, savedDescriptor);

            if (distance < 0.6) {
                foundUser = row;
            }
        });

        if (foundUser) {
            db.run(
                "UPDATE users SET visits = visits + 1 WHERE id = ?",
                [foundUser.id],
                function (updateErr) {
                    if (updateErr) {
                        console.error("Database update error:", updateErr);
                        return res.status(500).json({ message: "Database update error." });
                    }
                    res.json({ message: `Welcome back, ${foundUser.name}. Visit count: ${foundUser.visits + 1}` });
                }
            );
        } else {
            registerNewUser(descriptor, res);
        }
    });
});

function registerNewUser(descriptor, res) {
    db.run(
        "INSERT INTO users (name, descriptor, visits) VALUES (?, ?, ?)",
        [`User-${Date.now()}`, JSON.stringify(descriptor), 1],
        function (insertErr) {
            if (insertErr) {
                console.error("Error saving new user:", insertErr);
                return res.status(500).json({ message: "Error saving new user." });
            }
            res.json({ message: "New user registered." });
        }
    );
}

function calculateEuclideanDistance(arr1, arr2) {
    let sum = 0;
    for (let i = 0; i < arr1.length; i++) {
        sum += Math.pow(arr1[i] - arr2[i], 2);
    }
    return Math.sqrt(sum);
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
