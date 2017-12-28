<?php
  $con = mysqli_connect("ai","root","","ai");
  $sql = getQuery($_POST["type"]);
  $result = mysqli_query($con, $sql);
  $rows = array();
  while($r = mysqli_fetch_assoc($result)) {
      $rows[] = $r;
  }
  echo json_encode($rows);
  mysqli_close($con);


  function getQuery($type){
    $min = -50;
    $max = 200;

    switch($type){
      case "c_AvgKarma" : return
        $sql = "SELECT AVG(score) as score from comments";
      break;
      case "c_BestFlair" : return
        $sql = "SELECT AVG(comments.score) as avg_score, author_flairs.name FROM comments JOIN author_flairs on author_flairs.flairs_class = comments.author_flair group by author_flair ORDER BY AVG(comments.score) DESC";
      break;
      case "c_ReplyEngagements_FromScore" : return
        $sql = "SELECT AVG(score) as avg_score, avg(num_replies) as avg_replies from comments where score BETWEEN {$min} and {$max} GROUP BY score/10 ORDER BY avg_score";
      break;
      case "c_ReplyEngagements_FromScore_WithOutliers" : return
        $sql = "SELECT AVG(score) as avg_score, avg(num_replies) as avg_replies from comments GROUP BY score/10 ORDER BY avg_score";
      break;
      case "c_ReplyEngagements_FromDepth" : return
        $sql = "SELECT AVG(score) as avg_score, avg(num_replies) as avg_replies, depth from comments where score BETWEEN {$min} and {$max} GROUP BY depth ORDER BY `avg_score` DESC";
      break;
      case "c_ReplyEngagements_FromDepth_WithOutliers" : return
        $sql = "SELECT AVG(score) as avg_score, avg(num_replies) as avg_replies, depth from comments GROUP BY depth ORDER BY `avg_score` DESC";
      break;
      case "c_KarmaPerComment" : return
        $sql = "SELECT score, text FROM `comments`";
      break;

    }
  }
?>
