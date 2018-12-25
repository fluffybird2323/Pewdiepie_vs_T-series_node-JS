var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var s1 = 0;
var s2=0;

console.log(`
 
        

___  __/_____________________(_)____________    __ |  / /_______
__  /  __  ___/  _ \\_  ___/_  /_  _ \\_  ___/    __ | / /__  ___/
_  /   _(__  )/  __/  /   _  / /  __/(__  )     __ |/ / _(__  ) 
/_/    /____/ \\___//_/    /_/  \\___//____/      _____/  /____/  
                                                                
________               _____________     _____________      
___  __ \\_______      ____  __ \\__(_)_______  __ \\__(_)____ 
__  /_/ /  _ \\_ | /| / /_  / / /_  /_  _ \\_  /_/ /_  /_  _ \\
_  ____//  __/_ |/ |/ /_  /_/ /_  / /  __/  ____/_  / /  __/
/_/     \\___/____/|__/ /_____/ /_/  \\___//_/     /_/  \\___/ 



                `, )
/**
________                  _____                 ___    __       
___  __/_____________________(_)____________    __ |  / /_______
__  /  __  ___/  _ \_  ___/_  /_  _ \_  ___/    __ | / /__  ___/
_  /   _(__  )/  __/  /   _  / /  __/(__  )     __ |/ / _(__  ) 
/_/    /____/ \___//_/    /_/  \___//____/      _____/  /____/  
                                                                
________               _____________     _____________      
___  __ \_______      ____  __ \__(_)_______  __ \__(_)____ 
__  /_/ /  _ \_ | /| / /_  / / /_  /_  _ \_  /_/ /_  /_  _ \
_  ____//  __/_ |/ |/ /_  /_/ /_  / /  __/  ____/_  / /  __/
/_/     \___/____/|__/ /_____/ /_/  \___//_/     /_/  \___/ 

**/

var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  authorize(JSON.parse(content), getChannel);
   
});

function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
ooooooooooooo                              o8o                        oooooo     oooo          
8'   888   `8                              `"'                         `888.     .8'           
     888       .oooo.o  .ooooo.  oooo d8b oooo   .ooooo.   .oooo.o      `888.   .8'    .oooo.o 
     888      d88(  "8 d88' `88b `888""8P `888  d88' `88b d88(  "8       `888. .8'    d88(  "8 
     888      `"Y88b.  888ooo888  888      888  888ooo888 `"Y88b.         `888.8'     `"Y88b.  
     888      o.  )88b 888    .o  888      888  888    .o o.  )88b         `888'      o.  )88b 
    o888o     8""888P' `Y8bod8P' d888b    o888o `Y8bod8P' 8""888P'          `8'       8""888P' 
                                                                                               
                                                                                               
                                                                                               
ooooooooo.                              oooooooooo.    o8o            ooooooooo.    o8o            
`888   `Y88.                            `888'   `Y8b   `"'            `888   `Y88.  `"'            
 888   .d88'  .ooooo.  oooo oooo    ooo  888      888 oooo   .ooooo.   888   .d88' oooo   .ooooo.  
 888ooo88P'  d88' `88b  `88. `88.  .8'   888      888 `888  d88' `88b  888ooo88P'  `888  d88' `88b 
 888         888ooo888   `88..]88..8'    888      888  888  888ooo888  888          888  888ooo888 
 888         888    .o    `888'`888'     888     d88'  888  888    .o  888          888  888    .o 
o888o        `Y8bod8P'     `8'  `8'     o888bood8P'   o888o `Y8bod8P' o888o        o888o `Y8bod8P' 
                                                                                                   
                                                                                                   
                                                                                                   

 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**             ___ _        ___ _      
/__   \___  ___ _ __(_) ___  ___  /\   /\___    / _ \_____      __/   (_) ___  / _ (_) ___ 
  / /\/ __|/ _ \ '__| |/ _ \/ __| \ \ / / __|  / /_)/ _ \ \ /\ / / /\ / |/ _ \/ /_)/ |/ _ \
 / /  \__ \  __/ |  | |  __/\__ \  \ V /\__ \ / ___/  __/\ V  V / /_//| |  __/ ___/| |  __/
 \/   |___/\___|_|  |_|\___||___/   \_/ |___/ \/    \___| \_/\_/___,' |_|\___\/    |_|\___|
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
  console.log('Token stored to ' + TOKEN_PATH);
}

function getChannel(auth) {
  var service = google.youtube('v3');
  service.channels.list({
    auth: auth,
    part: 'snippet,contentDetails,statistics',
    forUsername: 'PewDiePie'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var channels = response.data.items;
    if (channels.length == 0) {
      console.log('No channel found.');
    } else {
      console.log('The channel\ \'%s\',  ' +
                  ' has %s Suscribers.',
                  
                  channels[0].snippet.title,
                  channels[0].statistics.subscriberCount);
       s1 = channels[0].statistics.subscriberCount;
    }
  });

  
    var service = google.youtube('v3');
  service.channels.list({
    auth: auth,
    part: 'snippet,contentDetails,statistics',
    forUsername: 'tseries'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var channels = response.data.items;
    if (channels.length == 0) {
      console.log('No channel found.');
    } else {
      console.log('The channel\ \'%s\',  ' +
                  '  has %s Suscribers.',
                  
                  channels[0].snippet.title,
                  channels[0].statistics.subscriberCount);
       s2 = channels[0].statistics.subscriberCount;
       console.log("PewDiePie has a lead of %s Suscribers", s1-s2) ;
    }
  });





}

