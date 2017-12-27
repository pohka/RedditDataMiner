/*
  Parses multiple pages of a subreddit with and also the contents of each poss
  into a simpler version of the reddit.json. It then downloads the json file.
*/
var subreddit = "DotA2"; //set subreddit
var filter = "hot"; //filter (hot/new/rising/top/controversial/guilded)
const maxPages = 4;
var postsInfo = {};
var commentsInfo = {};
var update;
var page = "https://www.reddit.com/r/" + subreddit + "/" + filter + "/.json";
var pageCount = 1;
$(document).ready(onload);

//called when page has loaded
function onload(){
  loadJson(page);
  $("#url").text("r/"+subreddit+"/" + filter);
  var tickTime = 100;
  update = setInterval(function(){
    let time = Number($("#time").text())+(tickTime*0.001);
    $("#time").text(time.toFixed(1));
  }, tickTime);
}

//requests the next page
function requestPage(lastPost){
    if(pageCount < maxPages){
      var url = page + "?count=" + (pageCount*25) + "&after=t3_" + lastPost;
      pageCount+=1;
      loadJson(url);
    }
}

//parses each page on reddit
function loadJson(url){
  //console.log("Requesting Page: "+ url);
  $.ajax({
    dataType: "json",
    url: url,
    success: function(data){
      var posts = data["data"]["children"];
      for(let i=0; i<posts.length; i++){
        let post = posts[i]["data"];
        let info = {
          id : post["id"],
          title : post["title"],
          score : post["score"],
          num_comments : post["num_comments"],
          time : post["created_utc"],
          gold : post["gilded"],
          flair : post["link_flair_css_class"],
          is_video : post["is_video"],
          nsfw : post["over_18"],
          permalink : "https://www.reddit.com" + post["permalink"],
          author : post["author"],
          spoiler : post["spoiler"],
          url : post["url"],
          brief_text : post["selftext"],
          author_flair : posts["author_flair_css_class"],
          domain : post["domain"],
        }
        postsInfo[post["id"]] = info;

        //next page
        if(i == posts.length -1){
          requestPage(post["id"]);
        }
      }

      for(let i in postsInfo){
        readPost(postsInfo[i]["permalink"]);
      }
    },
    error: function(data){
      console.log("failed" + data);
    }
  });
}

//parses a post
function readPost(url){
  console.log("Requesting Post: "+ url);
  $.ajax({
    dataType: "json",
    url: url+".json",
    success: function(data){
      let pInfo = data[0]["data"]["children"][0]["data"];
      let id = pInfo["id"];
     postsInfo[id]["upvote_ratio"] = pInfo["upvote_ratio"];
     postsInfo[id]["text"] = pInfo["selftext"];

      let comments = data[1]["data"]["children"];
      commentsInfo[id] = [];
      for(let i=0; i<comments.length; i++){
        let comment = comments[i]["data"];
        let cInfo = parseComment(comment);
        commentsInfo[id].push(cInfo);
      }
    }
  });
}

//parses a comment and all of the comment's replies
function parseComment(comment){
  var info = {
    id : comment["id"],
    author : comment["author"],
    author_flair : comment["author_flair_css_class"],
    text : comment["body"],
    time : comment["created_utc"],
    depth : comment["depth"],
    gold : comment["gilded"],
    score : comment["score"],
  }

  if(comment["replies"] !== "" && comment["replies"] != undefined){
    let replies = comment["replies"]["data"]["children"];
    info["replies"] = [];
    for(let i=0; i<replies.length; i++){
      let replyInfo = parseComment(replies[i]["data"]);
      info["replies"].push(replyInfo);
    }
  }
  return info;
}

//all ajax calls finished
$(document).ajaxStop(function() {
  clearInterval(update);
  var obj =  {
    posts : postsInfo,
    comments : commentsInfo,
  }
  console.log("finished");
  saveJSON(obj, subreddit.toLowerCase()+"-"+filter+"-"+Date.now()+".json");
});

//downloads a json object as a file
function saveJSON(data, filename){

    if(!data) {
        console.error('No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}
