<?php
  //inserts entrys into the database

  $con = mysqli_connect("ai","root","","ai");
  if(mysqli_connect_errno()){
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

  $type = $_POST["type"];

  $sql = "";
  if($type == "comment"){
    $sql = insertComment();
  }
  else if($type == "post"){
    $sql = insertPost();
  }

  mysqli_query($con, $sql);
  mysqli_close($con);

  function insertComment(){
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

  function insertPost(){
    $post_id = $_POST["post_id"];
    $author = $_POST["author"];
    $brief_text = $_POST["brief_text"];
    $domain = $_POST["domain"];
    $flair = $_POST["flair"];
    $gold = $_POST["gold"];
    $is_video = $_POST["is_video"];
    $nsfw = $_POST["nsfw"];
    $num_comments = $_POST["num_comments"];
    $permalink = $_POST["permalink"];
    $score = $_POST["score"];
    $spoiler = $_POST["spoiler"];
    $text = $_POST["text"];
    $time = $_POST["time"];
    $title = $_POST["title"];
    $upvote_ratio = $_POST["upvote_ratio"];
    $url = $_POST["url"];

    $sql =
      "REPLACE INTO `posts` ".
        "(`post_id`, `author`, `brief_text`, `domain`, `flair`, ".
        "`gold`, `is_video`, `nsfw`, `num_comments`, ".
        "`permalink`, `score`, `spolier`, `text`, ".
        "`time`, `title`, `upvote_ratio`, `url`) ".
      "VALUES (".
        "'{$post_id}', '{$author}', '{$brief_text}', '{$domain}', '{$flair}', ".
        "'{$gold}', '{$is_video}', '{$nsfw}', '{$num_comments}', ".
        "'{$permalink}', '{$score}', '{$spoiler}', '{$text}', ".
        "'{$time}', '{$title}', '{$upvote_ratio}', '{$url}')";
    return $sql;
  }
 ?>
