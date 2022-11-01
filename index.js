const { Console } = require('console');
const fs = require('fs');
var HTMLParser = require('node-html-parser');


try {
  fs.unlinkSync('sat.db');
  console.log("Delete File successfully.");
} catch (error) {
  console.log(error);
}


var alltv= [];
//var allpays= [];
//var allgenre= [];

var listangle = ['7W','13E','192E','26E'];

const forEachLoop = async _ => {
  console.log('Start')

  for (let index = 0; index < listangle.length; index++) {
    var data = await loaddata(listangle[index],index)
    console.log("=== Nombre Channel "+listangle[index]+" : "+data.length);

  }

  //console.log(alltv.length);
  //console.log(alltv[0]);

  //alltv = alltv.slice(868, 870);
  //console.log(alltv);
  saveSQLITE(alltv);

  console.log('End')
}

forEachLoop();


async function loaddata(angle,inda) {
  html = await fs.promises.readFile('pos/'+angle+'.html', 'utf8');

  var satfreq= [];
  var tv= [];

  var root = HTMLParser.parse(html.replaceAll('&nbsp;','').replaceAll('<A ','<a ').replaceAll('</A>','</a>').replaceAll('&deg;','').replaceAll('\n ',''));
  var frq = root.querySelectorAll('table.frq tr[bgcolor=#D2D2D2]');
  
  console.log("=== Nombre Frequence "+angle+" : "+frq.length);

  frq.forEach(ele => {
    satfreq.push(freqDetail(ele.childNodes.toString()));
  });

  satfreq.forEach(function callback(val, i) {
    var ch = root.querySelectorAll('#'+val.IDF+' table.fl tr[bgcolor]'); 
    ch.forEach(ele => {
      //satfreq[i].LISTSAT.push(channelDetail(ele.toString()));
      alltv.push(channelDetail(ele.toString(),angle,inda,i));
      tv.push(channelDetail(ele.toString(),angle,inda,i));
    });
  });
  return tv;
}
 

/*
listangle.forEach(async function callback(angle, inda) {
  html = await fs.promises.readFile('pos/'+angle+'.html', 'utf8');

  var satfreq= [];
  var tv= [];

  var root = HTMLParser.parse(html.replaceAll('&nbsp;','').replaceAll('<A ','<a ').replaceAll('</A>','</a>').replaceAll('&deg;','').replaceAll('\n ',''));
  var frq = root.querySelectorAll('table.frq tr[bgcolor=#D2D2D2]');
  
  console.log("=== Nombre Frequence "+angle+" : "+frq.length);

  frq.forEach(ele => {
    satfreq.push(freqDetail(ele.childNodes.toString()));
  });

  satfreq.forEach(function callback(val, i) {
    var ch = root.querySelectorAll('#'+val.IDF+' table.fl tr[bgcolor]'); 
    ch.forEach(ele => {
      //satfreq[i].LISTSAT.push(channelDetail(ele.toString()));
      alltv.push(channelDetail(ele.toString(),angle,inda,i));
      tv.push(channelDetail(ele.toString(),angle,inda,i));
    });
  });

  //console.log(satfreq[0]);
  console.log("=== Nombre Channel "+angle+" : "+tv.length);
  saveSQLITE(tv);
  //console.log("=== Liste Pays ("+allpays.length+") : ");
  //console.log(allpays);
  //console.log("=== Liste Genre ("+allgenre.length+") : ");
  //console.log(allgenre);
  //fs.writeFileSync('satfreq.json', JSON.stringify(satfreq));
  //var ttv = root.querySelectorAll('*[id^=m] table tr');
  //console.log(ttv.length);
  //let data = JSON.stringify(alltv);
  //fs.writeFileSync('alltv.json', JSON.stringify(alltv));
  //fs.writeFileSync('satfreq.json', JSON.stringify(satfreq));
});
*/

  //console.log("=== All Channel : "+alltv.length);
  //saveSQLITE(alltv);
//db.close();

function freqDetail(str) {
  var json = {}
  var r = HTMLParser.parse(str);
  var f = r.querySelectorAll('td');
  /*f.forEach(e => {
    console.log('- '+e.toString());
  });*/

  json.POS = f[0].innerText;
  json.SATELLITE = f[1].querySelector('a').innerText;
  json.FREQUENCE = f[2].innerText;
  json.POL = f[3].innerText;
  json.TXP = f[4].innerText;
  json.BEAM = f[5].innerText;
  json.SR = f[8].querySelectorAll('a')[0].innerText;
  json.FEC = f[8].querySelectorAll('a')[1].innerText;
  json.IDF = f[1].querySelector('img').getAttribute('id').replace('i','');
  json.STANDARD = f[6].innerText;
  json.MODULATION = f[7].innerText;
  var network = f[9].innerText.split(',')
  json.NETWORK = ( network.length>1 ? network[0] : '' ).trim();
  json.BITRATE = ( network.length>1 ? network[1] : network[0] ).trim();
  json.NID = f[10].innerText;
  json.TID = f[11].innerText;
  json.LISTSAT = [];

  return json;
}


function channelDetail(str,a,ia,i) {
  var json = {}
  var r = HTMLParser.parse(str);
  var c = r.querySelectorAll('td');
  /*f.forEach(e => {
    console.log('- '+e.toString());
  });*/

  json.ANGLE = a;
  json.CODFREQ = (ia*1+1)+pad(i*1+1,3);
  json.NOM = c[2].innerText.trim();
  json.PAYS = c[3].innerText.trim();
  json.GENRE = c[4].innerText.trim();
  json.BOUQUET = c[5].innerText.trim();
  json.CRYPTAGE = c[6].innerText.trim();
  json.SID = c[7].innerText.trim();
  json.VPID = c[8].innerText.trim();
  json.AUDIO = c[9].innerText.trim();
  json.PMT = c[10].innerText.trim();
  json.PCR = c[11].innerText.trim();
  json.TXT = c[12].innerText.trim();
  json.MAJ = c[13].innerText.replaceAll('+','').trim();

  /*
  if (allpays.hasOwnProperty(json.PAYS)) {
    allpays[json.PAYS+'']+=1;
  } else {
    allpays[json.PAYS+'']=1;
  }

  if (allgenre.hasOwnProperty(json.GENRE)) {
    allgenre[json.GENRE+'']+=1;
  } else {
    allgenre[json.GENRE+'']=1;
  }
  */

  return json;
}

function saveSQLITE(json) {

  let placeholders = json.map((ele) => 
    `(
      '`+ele.ANGLE.replaceAll("'","''")+`' ,
      '`+ele.CODFREQ.replaceAll("'","''")+`' ,
      '`+ele.NOM.replaceAll("'","''")+`' ,
      '`+ele.PAYS.replaceAll("'","''")+`' ,
      '`+ele.GENRE.replaceAll("'","''")+`' ,
      '`+ele.BOUQUET.replaceAll("'","''")+`' ,
      '`+ele.CRYPTAGE.replaceAll("'","''")+`' ,
      '`+ele.SID.replaceAll("'","''")+`' ,
      '`+ele.VPID.replaceAll("'","''")+`' ,
      '`+ele.AUDIO.replaceAll("'","''")+`' ,
      '`+ele.PMT.replaceAll("'","''")+`' ,
      '`+ele.PCR.replaceAll("'","''")+`' ,
      '`+ele.TXT.replaceAll("'","''")+`' ,
      '`+ele.MAJ.replaceAll("'","''")+`'
    )`
  ).join(',');

  var sqlite3 = require('sqlite3');
  var db = new sqlite3.Database('sat.db');
  db.serialize(function() {
    db.run(
      `CREATE TABLE IF NOT EXISTS CHANNELS (
          id INTEGER PRIMARY KEY,
          ANGLE TEXT,
          CODFREQ TEXT,
          NOM TEXT,
          PAYS TEXT,
          GENRE TEXT,
          BOUQUET TEXT,
          CRYPTAGE TEXT,
          SID TEXT,
          VPID TEXT,
          AUDIO TEXT,
          PMT TEXT,
          PCR TEXT,
          TXT TEXT,
          MAJ TEXT          
      )`
    );

    db.run(
      `INSERT INTO CHANNELS (
        ANGLE , CODFREQ , NOM , PAYS , GENRE , BOUQUET , CRYPTAGE , SID , VPID , AUDIO , PMT , PCR , TXT , MAJ  
      ) VALUES ` + placeholders
      , function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });

  });

}

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}