<?php
include '../includes/db.php';


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = htmlspecialchars($_POST['username']);
    $email = htmlspecialchars($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // Insertion dans la base de données
    $sql = "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':username' => $username,
        ':email' => $email,
        ':password' => $password
    ]);

    echo "Inscription réussie ! Vous pouvez maintenant vous connecter.";
    // on envoie sur la page de connexion
    header("Location: login.php");
}

?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>
<h2>Inscription</h2>
<form action="" method="POST">
    <label for="username">Nom d'utilisateur</label>
    <input type="text" id="username" name="username" required><br>

    <label for="email">Email</label>
    <input type="email" id="email" name="email" required><br>

    <label for="password">Mot de passe</label>
    <input type="password" id="password" name="password" required><br>

    <button type="submit">S'inscrire</button>
</form>


<style>
    /* Style de base */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    /* Mise en page globale */
    body {
        font-family: Arial, sans-serif;
        background: #f4f4f9;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        padding: 20px;
    }

    /* Conteneur principal pour centrer le formulaire */
    form {
        background-color: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 100%;
        text-align: center;
    }

    /* Titre */
    h2 {
        font-size: 24px;
        color: #333;
        margin: 20px;
    }

    /* Style des labels */
    label {
        font-size: 16px;
        color: #333;
        display: block;
        margin-bottom: 8px;
        text-align: left;
    }

    /* Style des champs de formulaire */
    input{
        width: 100%;
        padding: 12px;
        margin-bottom: 20px;
        border: 2px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
        transition: border-color 0.3s;
    }

    input:focus{
        border-color: #4CAF50;
        outline: none;
    }

    /* Style du bouton */
    button {
        background-color: #4CAF50;
        color: white;
        font-size: 16px;
        padding: 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #45a049;
    }

    button:active {
        background-color: #388e3c;
    }

    /* Responsive */
    @media (max-width: 600px) {
        form {
            padding: 20px;
            max-width: 100%;
        }

        h2 {
            font-size: 20px;
        }

        input[type="text"],
        input[type="password"],
        button {
            padding: 10px;
        }
    }

</style>
</body>
</html>
