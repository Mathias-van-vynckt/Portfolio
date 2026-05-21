CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voornaam VARCHAR(100) NOT NULL,
    achternaam VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    wachtwoord VARCHAR(255) NOT NULL
);

INSERT INTO accounts (voornaam, achternaam, email, wachtwoord) VALUES
('Jan', 'Peeters', 'jan.peeters@example.com', '$2y$10$voorbeeldhash1'),
('Sara', 'Janssens', 'sara.janssens@example.com', '$2y$10$voorbeeldhash2'),
('Tom', 'Maes', 'tom.maes@example.com', '$2y$10$voorbeeldhash3');
