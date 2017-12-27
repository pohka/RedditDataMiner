//convert a downloaded json file to an sql database
$(document).on("click", "#parse", function(){
  let dataFile = "/data/" + $("#input").val() + ".json";
  loadData(dataFile);
});

$(document).ajaxStop(function() {
  $("#status").text("Finished");
});

//load the json file
function loadData(file){
  $("#status").text("Parsing...");
  $.ajax({
    dataType: "json",
    url: file,
    success: function(data){
      sendToDatabase(data);
    },
    error: function(data){
      console.log(data);
    }
  });
}

//send json to database
function sendToDatabase(json){
  let comments = json["comments"];
  for(let key in comments){
    for(let i in comments[key]){
      sendCommentToDatabase(comments[key][i], key, null);
    }
  }
}

//send a comment to the database
function sendCommentToDatabase(data, postID, parent){
  var sending =  {
    type : "comment",
    comment_id : data["id"],
    post_id : postID,
    author : data["author"],
    author_flair : data["author_flair"],
    text : data["text"],
    time : data["time"],
    depth : data["depth"],
    gold : data["gold"],
    score : data["score"],
    num_replies : 0,
  };

  //ignore deleted/removed comments
  if(sending["author"]=== undefined || sending["author"] === ""){
    return;
  }

  //old json file comments didn't have ids
  if(data["id"] === undefined){
    sending["comment_id"] = genUID();
  }

  if(parent !== null){
    sending["parent_comment"] = parent;
  }

  if(data["replies"] instanceof Array){
    sending["num_replies"] = data["replies"].length;
  }

  $.ajax({
    url: "/php/populateDatabase.php",
    type: "POST",
    data : sending,
    success: function(result){
      $()
      for(let i in data["replies"]){
        $("#num_comments").text(Number($("#num_comments").text())+1);
        sendCommentToDatabase(data["replies"][i], postID, sending["commend_id"]);
      }
    }
  });
}

//generate a unique id
function genUID() {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}
