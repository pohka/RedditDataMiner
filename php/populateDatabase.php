<?php
  //inserts entrys into the database

  $con = mysqli_connect("ai","root","","ai");
  if(mysqli_connect_errno()){
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

  $type = $_POST["type"];

  $sql = "";
  if($type == "comment"){
    $sql = insertComment($con);
  }

  mysqli_query($con, $sql);
  mysqli_close($con);

  function insertComment($con){
    $comment_id = $_POST["comment_id"];
    $post_id = $_POST["post_id"];
    $parent_comment = NULL;
    $author = $_POST["author"];
    $author_flair = $_POST["author_flair"];
    $text = $_POST["text"];
    $time = $_POST["time"];
    $depth = $_POST["depth"];
    $gold = $_POST["gold"];
    $score = $_POST["score"];
    $num_replies = $_POST["num_replies"];

    if(isset($_POST["parent_comment"])){
      $parent_comment = $_POST["parent_comment"];
    }

    $sql =
        "REPLACE INTO `comments` ".
        "(`comment_id`, `post_id`, `parent_comment`, ".
        "`author`, `author_flair`, `text`, `time`, `depth`, ".
        "`gold`, `score`, `num_replies`) ".
        "VALUES ".
        "('{$comment_id}', '{$post_id}', '{$parent_comment}', ".
        "'{$author}', '{$author_flair}', '{$text}', '{$time}', '{$depth}', ".
        "'{$gold}', '{$score}', '{$num_replies}') ";
    return $sql;
  }
 ?>
