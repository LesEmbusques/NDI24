<?php
// Inclure la configuration de la base de données
include '../includes/db.php';

header('Content-Type: application/json');

try {
    // Requête pour récupérer tous les posts


    $sql = "SELECT * FROM posts where id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $_GET['id']);
    $stmt->execute();


    // Récupérer les données sous forme de tableau associatif
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Parcourir les posts pour encoder les images en base64
    foreach ($posts as &$post) {
        if (!empty($post['image_data'])) {
            $post['image_data'] = base64_encode($post['image_data']);
        }
        // recuperation de l'autheur du post
        $sql = "SELECT username FROM users WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $post['user_id']);
        $stmt->execute();
        $post['author'] = $stmt->fetch(PDO::FETCH_ASSOC)['username'];


        $sql = "SELECT C.content, U.username FROM comments C INNER JOIN users U ON C.user_id = U.id WHERE C.post_id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $post['id']);
        $stmt->execute();
        $post['comments'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // On modifie le format de la date
        $post['created_at'] = date('d/m/Y H:i', strtotime($post['created_at']));






    }


    session_start();

    // Envoyer la réponse JSON
    echo json_encode([
        "success" => true,
        "post" => $posts,
        "currentUserId" => $_SESSION['user_id']
    ]);

} catch (PDOException $e) {
    // En cas d'erreur, renvoyer un message JSON
    echo json_encode([
        "success" => false,
        "message" => "Erreur lors de la récupération des posts : " . $e->getMessage()
    ]);
}

