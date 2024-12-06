<?php
// Démarrer la session
session_start();

// Inclure la configuration de la base de données
include '../includes/db.php';

// Vérifier si la requête est POST
// Vérifier que l'utilisateur est authentifié (exemple d'utilisation de session)
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Vous devez être connecté pour supprimer un post."]);
    exit;
}

// Récupérer l'ID du post depuis la requête
$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "ID du post manquant."]);
    exit;
}

try {
    // Préparer la requête SQL pour supprimer le post
    $sql = "DELETE FROM posts WHERE id = :id";
    $stmt = $pdo->prepare($sql);

    // Exécuter la requête avec l'ID
    $stmt->execute([':id' => $id]);

    // Vérifier si un post a été supprimé
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Post supprimé avec succès."]);
    } else {
        echo json_encode(["success" => false, "message" => "Aucun post trouvé avec cet ID."]);
    }
} catch (PDOException $e) {
    // Gestion des erreurs PDO
    echo json_encode(["success" => false, "message" => "Erreur lors de la suppression du post : " . $e->getMessage()]);
}
?>
