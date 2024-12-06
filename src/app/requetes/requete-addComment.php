<?php
// Inclure la connexion à la base de données
session_start();

include('../includes/db.php');


// Vérifier si les données nécessaires sont envoyées via POST
if (isset($_POST['postId']) && isset($_POST['content'])) {
    // Récupérer les données envoyées
    $post_id = $_POST['postId'];
    $user_id = $_SESSION['user_id'];  // Assurez-vous que l'utilisateur est connecté
    $content = $_POST['content'];

    // Vérifier si l'ID de l'utilisateur est défini
    if (!isset($user_id)) {
        echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté.']);
        exit;
    }

    try {
        // Préparer la requête pour insérer le commentaire dans la base de données
        $sql = "INSERT INTO comments (post_id, user_id, content, created_at) 
                VALUES (:post_id, :user_id, :content, NOW())";
        $stmt = $pdo->prepare($sql);

        // Lier les paramètres
        $stmt->bindParam(':post_id', $post_id, PDO::PARAM_INT);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindParam(':content', $content, PDO::PARAM_STR);

        // Exécuter la requête
        $stmt->execute();

        // Retourner une réponse JSON de succès
        echo json_encode(['success' => true, 'message' => 'Commentaire ajouté avec succès!', 'username' => $_SESSION['username']]);
    } catch (PDOException $e) {
        // En cas d'erreur, retourner un message d'erreur détaillé
        error_log($e->getMessage());  // Enregistre l'erreur dans les logs du serveur
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'ajout du commentaire: ' . $e->getMessage()]);
    }
} else {
    // Si les paramètres sont manquants
    echo json_encode(['success' => false, 'message' => 'Les données nécessaires sont manquantes.']);
}
?>
