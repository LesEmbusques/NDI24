<?php
// Inclure la configuration de la base de données
include '../includes/db.php';

header('Content-Type: application/json');

try {
    // Requête pour récupérer tous les posts
    $sql = "SELECT id, posX, posY, posZ FROM posts";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Récupérer les données sous forme de tableau associatif
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Parcourir les posts pour encoder les images en base64
    foreach ($posts as &$post) {
        if (!empty($post['image_data'])) {
            $post['image_data'] = base64_encode($post['image_data']);
        }
    }

    // Envoyer la réponse JSON
    echo json_encode([
        "success" => true,
        "posts" => $posts
    ]);

} catch (PDOException $e) {
    // En cas d'erreur, renvoyer un message JSON
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération des posts : " . $e->getMessage()
    ]);
}
