var feeds = {};
var storeName = 'offlinereader';
var db;

if (google && google.load) {
  google.load('feeds', '1');
}

function load() {
  setupStore();
  setupDb();
  var rs = db.execute('select * from Feeds');
  while (rs.isValidRow()) {
    addFeedLinkToSidebar(rs.fieldByName('link'));
    rs.next();
  }
  rs.close();
}

function setupStore() {
  var pageFiles = [ location.pathname, 'capture.gif', '../../scripts/gears_init.js', 'offlinereader.js', 'style.css'];
  var localServer;
      
  try {
    localServer = google.gears.factory.create('beta.localserver', '1.0');
  } catch (e) {
    alert('Could not create local server: ' + e.message);
    return;
  }
  
  // Load in the offline resources (js/css/etc)
  var store = localServer.openStore(storeName) || localServer.createStore(storeName);
  store.capture(pageFiles, function() {});
}

function clearStore() {
  google.gears.factory.create('beta.localserver', '1.0').removeStore(storeName);
}

function clearDb() {
  if (db) {
    db.execute('delete from Feeds');
    db.execute('delete from Entries');
    db.execute('drop table Feeds');
    db.execute('drop table Entries');
  }
}

function setupDb() {
  db = google.gears.factory.create('beta.database', '1.0');
  db.open('offlinereader');

  if (db) {
    db.execute('create table if not exists Feeds (title varchar(255), link varchar(255), numUnRead int)');
    db.execute('create table if not exists Entries (feedLink varchar(255), title varchar(255), link varchar(255), content text, isRead int, entryNum int)');
  }
}

function loadFeed() {
  var feedUrl = document.getElementById('submitValue').value;
  var feed = new google.feeds.Feed(feedUrl);
  //feed.setResultFormat(google.feeds.Feed.XML_FORMAT);
  feed.setNumEntries(8);
  feed.load(function(result) {
    addFeed(result.feed);
  });
}

function addFeed(feed) {
  // check if already exists
  var rs = db.execute('select * from Feeds where link = "' + feed.link + '"');
  if (rs.isValidRow()) return;

  db.execute('insert into Feeds (title, link, numUnRead) values (?, ?, ?)', [ feed.title, feed.link, feed.entries.length ]);
  for (var i = 0; i < feed.entries.length; i++) {
    var entry = feed.entries[i];
    db.execute('insert into Entries (feedLink, title, link, content, isRead, entryNum) values (?, ?, ?, ?, ?, ?)', [ feed.link, entry.title, entry.link, entry.content, 0, i]);
  }
  addFeedLinkToSidebar(feed.link);
  rs.close();
}

function addFeedLinkToSidebar(feedLink) {
  var rs = db.execute('select * from Feeds where link = "' + feedLink + '"');
  if (!rs.isValidRow()) return;
  var searchLink = document.createElement('a');
  searchLink.id = 'feedLink' + rs.fieldByName('link');
  searchLink.setAttribute("href", "javascript:displayFeed('" + rs.fieldByName('link') + "')");
  searchLink.appendChild(document.createTextNode(rs.fieldByName('title') + ' (' + rs.fieldByName('numUnRead') + ')'));
  var status = document.getElementById('status');
  status.appendChild(searchLink);
  status.appendChild(document.createElement('br'));
  status.appendChild(document.createElement('br'));
  rs.close();
}

function displayFeed(feedLink) {
  var rs = db.execute('select * from Feeds where link = "' + feedLink + '"');
  if (!rs.isValidRow()) return;
  var html = ['<h2>', rs.fieldByName('title'),'</h2>'];
  rs.close();

  var rs = db.execute('select * from Entries where feedLink = "' + feedLink + '"');
  if (!rs.isValidRow()) { 
    html.push('<h2>Nothing</h2>');
    document.getElementById("itemresults").innerHTML = html.join("");
    return;
  }
  while (rs.isValidRow()) {
    var title = rs.fieldByName('title');
    var link = rs.fieldByName('link');
    var content = rs.fieldByName('content');
    var isRead = rs.fieldByName('isRead');
    var entryNum = rs.fieldByName('entryNum');
    var className = (isRead == 1) ? 'item-read' : 'item-unread';
    html.push('<div class="' + className + '" id="feedItem' + entryNum + '">');
    html.push('<h3><a href="', link, '" target="_blank">', title, '</a></h3>', content, '<br>');
    if (isRead == 0) {
      html.push('<input id="markAsRead' + entryNum + '" type="button" value="Mark this entry as read" onclick="markAsRead(\'' + feedLink + '\',\'' + entryNum + '\')"/>');
    }
    html.push('</div>');
    rs.next();
  }
  rs.close();
  document.getElementById("itemresults").innerHTML = html.join("");
}

function markAsRead(feedLink, entryNum) {
  var rs = db.execute('update Entries set isRead = 1 where feedLink = "' + feedLink + '" and entryNum = ' + entryNum);
  rs.close(); 
  var rs = db.execute('select * from Feeds where link = "' + feedLink + '"');
  var title = rs.fieldByName('title');
  var numUnRead = rs.fieldByName('numUnRead') - 1;
  rs.close();
  var rs = db.execute('update Feeds set numUnRead = ' + numUnRead + ' where link = "' + feedLink + '"');
  rs.close();
  document.getElementById('feedLink' + feedLink).innerHTML = title + ' ( ' + numUnRead + ')';
  document.getElementById('feedItem' + entryNum).className = 'item-read';
  document.getElementById('markAsRead' + entryNum).style.display = 'none';
}
