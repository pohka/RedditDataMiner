$(document).ready(onload);


var queryCount = 0;
var comments = {};

function onload(){
  query("c_AvgKarma", avgKarmaPerComment);
  query("c_BestFlair", bestFlair);
  query("c_ReplyEngagements_FromScore");
  query("c_ReplyEngagements_FromScore_WithOutliers");
  query("c_ReplyEngagements_FromDepth");
  query("c_ReplyEngagements_FromDepth_WithOutliers");
  query("c_KarmaPerComment", karmaCommentLen);
  checkFinished();
}

//end of queies
function checkFinished(){
  var check = setInterval(function () {
    if(queryCount<=0){
      clearInterval(check);
      finishedClassification();
    }
  }, 200);
}

function finishedClassification() {
  console.log(comments);
}

//executes a query and calls the callback function
function query(type, callback){
  queryCount+=1;
  $.ajax({
    url: "/php/query.php",
    type: "POST",
    data: {
      type : type
    },
    success: function(data) {
      let json = JSON.parse(data);
      if(typeof callback !== "function"){
        defaultQ(type, json);
      }
      else{
        callback(json);
      }
    }
  });
}

//      Data Classification
//--------------------------------

//default query callback if undefined
function defaultQ(type, data){
  comments[type] = data;
  queryCount-=1;
}

function avgKarmaPerComment(data){
  comments["AvgKarmaPerComment"] = data[0]["score"];
  queryCount-=1;
}

function bestFlair(data){
  //console.log(data);
  comments["BestFlair"] = data[0]["name"];
  queryCount-=1;
}

function karmaCommentLen(data){
  let res = {};
  for(let i in data){
      var commentLen = data[i]["text"].length;
      var row = res[commentLen+""];
      if(row === undefined){
        res[commentLen+""] = {
          "score" : data[i]["score"],
          "comment_len" : commentLen,
          "count" : 1,
        };
      }
      else{
        var newCount = row["count"]+1;
        var curTotal = row["score"] * row["count"];
        var total = curTotal + commentLen/newCount
        res[commentLen+""]["count"] = newCount;
      }
  }

  comments["c_ScorePerTextLen"] = res;
  bestCommentLengthRanges(res);

  queryCount-=1;
}

function bestCommentLengthRanges(data){
  let lastOpen = 1;
  let total = 0;
  let count = 0;
  let range = 5;
  let res = {}
  for(let r in data){
    if(data[r]["comment_len"] >= lastOpen+range){
      let str = lastOpen + "-" + (r-1);
      res[str] = total/count;
      total = 0;
      count = 0;
      lastOpen+= range;
    }

    total += Number(data[r]["score"]);
    count += 1;
  }
  comments["c_ScoreFromTextLenRanges"] = res;

  //log as csv
  // var csv = "";
  // for(let i in res){
  //   csv += i+","+res[i]+"\n";
  // }
  // console.log(csv);
}



//--------------------------------
