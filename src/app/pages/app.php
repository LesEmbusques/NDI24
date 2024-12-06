<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

include '../includes/db.php';

// Récupérer les posts
$sql = "SELECT posts.content, posts.created_at, users.username FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST['content'])) {
    $content = htmlspecialchars($_POST['content']);
    $sql = "INSERT INTO posts (user_id, content) VALUES (:user_id, :content)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':user_id' => $_SESSION['user_id'], ':content' => $content]);
    header("Location: index.php");
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Earth - Réseau Social</title>
    <link rel="stylesheet" href="../styles/app.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r136/three.min.js"></script>

    <!-- Balises Meta SEO -->
    <meta name="description" content="Un réseau social 3D interactif où les utilisateurs peuvent partager leurs posts et découvrir des faits intéressants sur la Terre et l'océan.">
    <meta name="keywords" content="réseau social, Terre, océan, posts, 3D, interactive, partage, commentaire, Three, ThreeJS, JavaScript, Three.js, OrbitControls, OrbitControls.js, Nuit de l'info, Nuit de l'info 2024">
    <meta name="author" content="Les embusqués">
    <meta property="og:title" content="Interactive Earth - Réseau Social">
    <meta property="og:description" content="Un réseau social interactif pour explorer et partager des posts intéressants liés à la Terre et à l'océan.">
    <meta property="og:image" content="src/app/logo.png">
    <meta property="og:url" content="https://lesembusques.github.io/NDI24.github.io/">
</head>

<body>
<!-- Header avec logo et bouton profil -->
<header>
    <div class="container">
        <h1 class="logo">Interactive Earth | <p id="username"><?php echo $_SESSION['username']; ?></p>    </h1>
    </div>
</header>

<!-- Section pour le globe -->
<main>
    <div id="earth-container"></div>
    <!-- post dans ../includes/requete-addpost.php -->
    <form class="post-form" id="postForm"  enctype="multipart/form-data"  action="../requetes/requete-addpost.php" method="post" style="display: none">
        <h2>Nouveau post</h2>
        <div class="img">
            <img src="../img.png" alt="post-img" id="img-post">
        </div>
        <input type="text" name="posX" style="display: none;">
        <input type="text" name="posY" style="display: none;">
        <input type="text" name="posZ" style="display: none;">
        <input type="file" id="fileImg" name="image" style="display: none">
        <textarea name="content" placeholder="Exprimez-vous..." required></textarea>
        <button type="submit" id="submit">Publier</button>
        <p id="closeForm">X</p>
    </form>

    <!-- LES VALEURS SONT POUR LES TESTS -->
    <div class="fenetreDroit" style="display: none">
        <h2>Post</h2>

        <div class="img">
            <img src="../img.png" alt="post-img" id="img-post">
        </div>
        <div class="post-info">
            <p><strong>Publié par:</strong> Mathis</p>
            <p><strong>Publié le:</strong>10/12/2024 à 19:29</p>
        </div>

        <div class="post-content">
            <p>Un post lamda</p>
        </div>

        <div class="comment-section">
            <h3>Commentaires</h3>
            <div class="comments">
                <div class="comment">
                    <p><strong>Mathis:</strong> Super post !</p>
                </div>
                <div class="comment">
                    <p><strong>Mathis:</strong> Super post !</p>
                </div>
            </div>


            <textarea class="comment-input" id="commentInput" placeholder="Écrire un commentaire..."></textarea>
            <button id="addComment" style="margin-top: 10px;">Ajouter un commentaire</button>
        </div>

        <button class="delete-post" id="delete-post">Supprimer le post</button>
    </div></main>

<div id="counter">EHHHH</div>

<footer>
    <div class="container">
        <p>&copy; 2024 Interactive Earth | Réseau Social 3D</p>
    </div>
</footer>

<!-- Three.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<script src="../../../src/helperjs/orbitControls.js"></script>

<script type="module" src="app.js"></script>
</body>

<script>
    setInterval(function() {
        var date = new Date();
        var dateEurope = new Date(date.getTime() + 30);
        document.getElementById("counter").innerHTML = "Prochain rechargement : " + dateEurope.getHours() + ":" + dateEurope.getMinutes() + ":" + dateEurope.getSeconds();
        }, 30000);
    var date = new Date();
    var dateEurope = new Date(date.getTime() + 30 );
    document.getElementById("counter").innerHTML = "Prochain rechargement : " + dateEurope.getHours() + ":" + dateEurope.getMinutes() + ":" + dateEurope.getSeconds();


</script>

</html>
