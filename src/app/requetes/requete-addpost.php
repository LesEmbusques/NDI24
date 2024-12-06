<?php
// Inclure la configuration de la base de données (PDO)
session_start();

include '../includes/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Sécurisation des données envoyées dans le formulaire
    $content = htmlspecialchars($_POST['content']);
    $posX = isset($_POST['posX']) ? htmlspecialchars($_POST['posX']) : null;
    $posY = isset($_POST['posY']) ? htmlspecialchars($_POST['posY']) : null;
    $posZ = isset($_POST['posZ']) ? htmlspecialchars($_POST['posZ']) : null;

    // Gestion de l'image
    $fileContent = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        // Récupérer les informations du fichier
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileName = $_FILES['image']['name'];
        $fileSize = $_FILES['image']['size'];
        $fileType = $_FILES['image']['type'];

        // Lire le contenu du fichier si nécessaire
        $fileContent = file_get_contents($fileTmpPath);
        echo "Contenu binaire (encodé en base64) : " . base64_encode($fileContent);
    } else {
        echo "Aucun fichier reçu ou une erreur est survenue.";
    }
    $user_id = $_SESSION['user_id'];
    try {
        $sql = "INSERT INTO posts (user_id,content, posX, posY, posZ, image_data, created_at) 
                VALUES (:user_id, :content, :posX, :posY, :posZ, :image_data, NOW())";

        // Préparer la requête avec PDO
        $stmt = $pdo->prepare($sql);

        // Exécuter la requête
        $stmt->execute([
            ':user_id' => $user_id,
            ':content' => $content,
            ':posX' => $posX,
            ':posY' => $posY,
            ':posZ' => $posZ,
            ':image_data' => $fileContent
        ]);

        // Confirmation du succès de l'insertion
        echo json_encode(["success" => true, "message" => "Post ajouté avec succès."]);


    } catch (PDOException $e) {
        // Gestion des erreurs
        echo json_encode(["success" => false, "message" => "Erreur lors de l'ajout du post: " . $e->getMessage()]);
    }
}
?>
