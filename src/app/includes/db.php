<?php
define('DB_HOST', 'mysql-nuitdelinfoembusque.alwaysdata.net'); // Hôte de la base de données
define('DB_USER', '389359'); // Nom d'utilisateur de la base de données
define('DB_PASS', 'Azertyuiop389359*'); // Mot de passe de la base de données
define('DB_NAME', 'nuitdelinfoembusque_2024'); // Nom de la base de données

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
