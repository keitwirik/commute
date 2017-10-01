// this points to a proxy defined in virtualhost
var apiurl = '/v/';
var routes = {
  getRoutes:      'getroutes/',
  getDirections:  'getdirections/',
  getStops:       'getstops/',
  getPredictions: 'getpredictions/',
  getTrainpredictions: 't/ttarrivals/'
};

var wtf = {}, context, timer, pathArray, params = {}, recentList = [];

(function($){


$('a[data-action]').on('click', function(e){
  var action = $(this).data('action');
  e.preventDefault();
  history.pushState(null, null, '/' + action );
  callRouter(); // getRoutes
});


function callRouter() {
  $('.spinner').hide();
  clearTimeout(timer);
  pathArray = window.location.pathname.split('/');
  if(pathArray[1] === 'bus') {
    if(!pathArray[2]) {
      getRoutes();
    }
    else if(pathArray[2].charAt(0) === 'r' && !pathArray[3]) {
      params.rt = pathArray[2].substr(1);
      getDirections(params.rt);
    }
    else if(pathArray[2].charAt(0) === 'r' && pathArray[3]) {
      params.rt = pathArray[2].substr(1);
      params.dir = pathArray[3];
      getStops(params.rt, params.dir);
    }
    else if(pathArray[2].charAt(0) === 's') {
      params.stpid = pathArray[2].substr(1);
      getPrediction(params.stpid); //GetPredictions
    }
  }
  else if(pathArray[1] === 'trains') {
    if(!pathArray[2]) {
      getTrainlines();
    }
    else if(pathArray[2].charAt(0) === 'r' && !pathArray[3]) {
      params.line = pathArray[2].substr(1);
      getTrainStops(params);
    }
    else if(pathArray[2].charAt(0) === 'r' && pathArray[3].charAt(0) === 's') {
      params = {
        mapid: pathArray[3].substr(1),
        max: 10
      };
      getTrainPrediction(params);
    }
  }
}

function getTrainPrediction(params) {
  var requestRoute = routes.getTrainpredictions;
  var request = createRequest(requestRoute, params);
  $.get(request, function(data){
    spinner('stop');
    wtf = $.xml2json(data);
    context = wtf;
    for(var i = 0; i < context.eta.length; i++) {
          context.eta[i].arrD = convertDate(context.eta[i].arrT);
    }
    render('trainpredictions', context, '.info');

    // refresh results every minute
    // timer seems to need to be in global
    // scope to be clearable
    timer = setTimeout(function(){
      getTrainPrediction(params);
      ga('send', 'event', 'autorefresh', 'timer', 'autorefresh train ' + window.location.pathname);
    }, 60000);
    // set timer spinner
    // clear timer with any a click
    $('a').on('click', function(){clearTimeout(timer);});
  });
  $('.spinner.train').show();
  $('.spinner.train .spin').off().on('click', function() {
    clearTimeout(timer);
    getTrainPrediction(params);
    ga('send', 'event', 'refresh', 'click', 'refresh train ' + window.location.pathname);
  });
  spinner('start');
}

function getTrainStops(params) {
  var line = params.line;
  context = {
    stoplist: []
  };
  var thisStop, thatStop;
  trainsArr.forEach(function(e) {
    if(thisStop = e[line] === 1) {
      var thisStop = e[7];
      if(thisStop !== thatStop) {
        var tmp = {
          parent_stop_id: e[7],
          stop_name: e[6]
        };
        context.stoplist.push(tmp);
      }
      thatStop = thisStop;
    }
  });

  render('trainstops', context, '.info');
  //event listeners
  var stop;
  $('a.stop').on('click', function(e) {
    var params = {};
    e.preventDefault();
    stop = $(this).data('stop');
    params.stopDesc = $(this).data('desc');
    params.stop = '/' + pathArray[1] + '/' + pathArray[2] + '/s' + stop;
    params.type = 'train';
    history.pushState(null, null, '/' + pathArray[1] + '/' + pathArray[2] + '/s' + stop );
    addStoredTrip(params);
    callRouter(); // getTrainpredictions
  });
}


function getTrainlines(){
  context = {
    line:  [
      {
        line_id: 9,
        line_name: 'Red'
      },
      {
        line_id: 10,
        line_name: 'Blue'
      },
      {
        line_id: 11,
        line_name: 'Brown'
      },
      {
        line_id: 12,
        line_name: 'Green'
      },
      {
        line_id: 13,
        line_name: 'Purple'
      },
      {
        line_id: 14,
        line_name: 'Purple Express'
      },
      {
        line_id: 15,
        line_name: 'Yellow'
      },
      {
        line_id: 16,
        line_name: 'Pink'
      },
      {
        line_id: 17,
        line_name: 'Orange'
      }
    ]
  };
  render('trainlines', context, '.info');
  //event listeners
  var thisStop, line;
  $('a.line').on('click', function(e) {
    e.preventDefault();
    line = $(this).data('line');
    history.pushState(null, null, '/' + pathArray[1] + '/r' + line);
    callRouter(); // getTrainStops
  });
}

function getRoutes() {
  var requestRoute = routes.getRoutes;
  var params = {};
  var request = createRequest(requestRoute, params);

  $.get(request, function(data){
     wtf = $.xml2json(data);

    context = wtf;
    render('routes', context, '.info');

    //event listeners
    $('a.route').on('click', function(e){
      e.preventDefault();
      var rt = $(this).attr('data-rt');
      history.pushState(null, null, '/' + pathArray[1] + '/r' + rt);
      callRouter(); // getDirections
    });
  });
}

function getDirections(rt) {
  //FIXME: possible for route to hav only one direction
  // and return an obj instead of an array
  // This should just get passed over with the single route possible
  var requestRoute = routes.getDirections;
  var params = {
    "rt" : rt
  };

  var request = createRequest(requestRoute, params);
  $.get(request, function(data){
    wtf = $.xml2json(data);

    context = wtf;
    context.rt = rt;
    if(context.dir instanceof Array) {
      context.dirIsArr = true;
    }
    render('directions', context, '.info');

    //event listeners
    $('a.direction').on('click', function(e){
      e.preventDefault();
      var rt = $(this).attr('data-rt');
      var direction = $(this).attr('data-dir');
      history.pushState(null, null, '/' + pathArray[1] + '/r' + rt + '/' + direction);
      callRouter(); // getStops(rt, direction);
    });
  });
}

function getStops(rt, dir){
  var requestRoute = routes.getStops;
  var params = {
    "rt" : rt,
    "dir" : dir
  };
  var request = createRequest(requestRoute, params);
  $.get(request, function(data){
    wtf = $.xml2json(data);
    context = wtf;
    context.rt = rt;
    context.dir = dir;
    render('stops', context, '.info');

    //event listeners
    $('a.stop').on('click', function(e){
      e.preventDefault();

      var rt = $(this).attr('data-rt');
      var dir = $(this).data('dir');
      var stpid = $(this).attr('data-stpid');
      var stpnm = $(this).attr('data-stpnm');
      var params = {
        stop: '/' + pathArray[1] + '/s' + stpid,
        stopDesc: rt + ' ' + dir + ' ' + stpnm,
        type: 'bus'
      };
      addStoredTrip(params);
      history.pushState(null, null, '/' + pathArray[1] + '/s' + stpid);
      getPrediction(stpid);
    });
  });
}

function getPrediction(stpid) {
  var requestRoute = routes.getPredictions;
  var params = {
    "stpid" : stpid
  };


  var request = createRequest(requestRoute, params);
	$.get(request, function(data){
    spinner('stop');
    wtf = $.xml2json(data);

    context = wtf;
    context.stpid = stpid;
    //sometimes a single object gets passed back
    if(context.error){
      console.log('there was an error ', context);
    } else {
      if(context.prd instanceof Array) {
        context.prdIsArr = true; // template looks for this
        for(var i = 0; i < context.prd.length; i++) {
          context.prd[i].prdtm = convertDate(context.prd[i].prdtm);
        }
//        context.prd.forEach(function(en){
//          console.log('array, more than one bus ', en.prdtm);
//        });
      } else {
//        console.log('not array, only one bus ', context.prd);
        context.prd.prdtm = convertDate(context.prd.prdtm);
      }
    }

    render('prediction', context, '.info');

    timer = setTimeout(function(){
      getPrediction(stpid);
      ga('send', 'event', 'autorefresh', 'timer', 'autorefresh bus ' + window.location.pathname);
    }, 60000);
    // set timer spinner
    // clear timer with any a click
    $('a').on('click', function(){clearTimeout(timer);});
    $('.spinner.bus .spin').off().on('click', function() {
      clearTimeout(timer);
      getPrediction(stpid);
      ga('send', 'event', 'refresh', 'click', 'refresh bus ' + window.location.pathname);
    });
	});
  $('.spinner.bus').show();
  spinner('start');
}

function createRequest(requestRoute, params) {
  var request = apiurl + requestRoute + '?' + $.param(params);
  return request;
}

function render(templateID, context, target) {
  //var source = $("#" + templateID).html();
  //var temp = Handlebars.compile(source);
  var temp = Handlebars.templates[templateID];
  var html = temp(context);
  $(target).html(html);
}

function convertDate(arrivalTime) {
  var time = new Date([arrivalTime.slice(0,4), '/', arrivalTime.slice(4,6), '/', arrivalTime.slice(6,8), arrivalTime.slice(8)].join(''));
  var now = new Date();
  if(time > now) {
    return Math.ceil(((time - now) / 1000) / 60); //returns minutes rounded up to arrival time
  }
}

function addStoredTrip(params) {
  if(typeof(Storage) !== "undefined") {
    if(localStorage.getItem('recent') === null){
      localStorage.setItem('recent', JSON.stringify(recentList));
    }
    recentList = JSON.parse(localStorage.getItem('recent'));
    recentList.forEach(function(i){
    	if(i.stop === params.stop) {
		    recentList.splice(recentList.indexOf(i), 1);
		    return false;
      }
    });
    // if not already the most recent then push to recentList
    recentList.push(params);
    recentList.length <= 10 || recentList.shift();
    localStorage.setItem('recent', JSON.stringify(recentList));
  }
}

function getStoredTrips() {
  if(typeof(Storage) !== 'undefined') {
    if(localStorage.getItem('recent') !== null) {
      recentList = JSON.parse(localStorage.getItem('recent'));
      render('recent', recentList.reverse(), '.info');
      //event listeners
      $('#recent a').on('click', function(e) {
        e.preventDefault();
        history.pushState(null, null, $(this).data('url'));
        callRouter(); // getwhatever stop
	ga('send', 'event', 'recentlist', 'click', 'recent ' + $(this).data('url'));
      });
    }
  }
}

function spinner(s) {
  s === 'start' && $('.spin').addClass('animate');
  s === 'stop' && $('.spin').removeClass('animate');
}

//[STOP_ID,"D"I"RECTION_ID,STOP_NAME",LON,LAT,"STATION_NAME","STATION_DESCRIPTIVE_NAME",PARENT_STOP_ID,ADA,Red,Blue,Brn,G,P,Pexp,Y,Pink,Org],
var trainsArr = [
  [30162,"W","18th (54th/Cermak-bound)",-87.669147,41.857908,"18th","18th (Pink Line)",40830,1,0,0,0,0,0,0,0,1,0],
  [30161,"E","18th (Loop-bound)",-87.669147,41.857908,"18th","18th (Pink Line)",40830,1,0,0,0,0,0,0,0,1,0],
  [30214,"S","35-Bronzeville-IIT (63rd-bound)",-87.625826,41.831677,"35th-Bronzeville-IIT","35th-Bronzeville-IIT (Green Line)",41120,1,0,0,0,1,0,0,0,0,0],
  [30213,"N","35-Bronzeville-IIT (Harlem-bound)",-87.625826,41.831677,"35th-Bronzeville-IIT","35th-Bronzeville-IIT (Green Line)",41120,1,0,0,0,1,0,0,0,0,0],
  [30022,"N","35th/Archer (Loop-bound)",-87.680622,41.829353,"35th/Archer","35th/Archer (Orange Line)",40120,1,0,0,0,0,0,0,0,0,1],
  [30023,"S","35th/Archer (Midway-bound)",-87.680622,41.829353,"35th/Archer","35th/Archer (Orange Line)",40120,1,0,0,0,0,0,0,0,0,1],
  [30246,"S","43rd (63rd-bound)",-87.619021,41.816462,"43rd","43rd (Green Line)",41270,1,0,0,0,1,0,0,0,0,0],
  [30245,"N","43rd (Harlem-bound)",-87.619021,41.816462,"43rd","43rd (Green Line)",41270,1,0,0,0,1,0,0,0,0,0],
  [30210,"S","47th (63rd-bound) Elevated (63rd-bound)",-87.618826,41.809209,"47th","47th (Green Line)",41080,1,0,0,0,1,0,0,0,0,0],
  [30209,"N","47th (SB) Elevated (Harlem-bound)",-87.618826,41.809209,"47th","47th (Green Line)",41080,1,0,0,0,1,0,0,0,0,0],
  [30238,"S","47th-Dan Ryan (95th-bound)",-87.63094,41.810318,"47th","47th (Red Line)",41230,1,1,0,0,0,0,0,0,0,0],
  [30237,"N","47th-Dan Ryan (Howard-bound)",-87.63094,41.810318,"47th","47th (Red Line)",41230,1,1,0,0,0,0,0,0,0,0],
  [30025,"S","51st (63rd-bound)",-87.618487,41.80209,"51st","51st (Green Line)",40130,1,0,0,0,1,0,0,0,0,0],
  [30024,"N","51st (Harlem-bound)",-87.618487,41.80209,"51st","51st (Green Line)",40130,1,0,0,0,1,0,0,0,0,0],
  [30113,"E","54th/Cermak (Loop-bound)",-87.75669201,41.85177331,"54th/Cermak","54th/Cermak (Pink Line)",40580,1,0,0,0,0,0,0,0,1,0],
  [30114,"W","54th/Cermak (Terminal arrival)",-87.75669201,41.85177331,"54th/Cermak","54th/Cermak (Pink Line)",40580,1,0,0,0,0,0,0,0,1,0],
  [30178,"S","63rd-Dan Ryan (95th-bound)",-87.630952,41.780536,"63rd","63rd (Red Line)",40910,1,1,0,0,0,0,0,0,0,0],
  [30177,"N","63rd-Dan Ryan (Howard-bound)",-87.630952,41.780536,"63rd","63rd (Red Line)",40910,1,1,0,0,0,0,0,0,0,0],
  [30192,"S","69th (95th-bound)",-87.625724,41.768367,"69th","69th (Red Line)",40990,1,1,0,0,0,0,0,0,0,0],
  [30191,"N","69th (Howard-bound)",-87.625724,41.768367,"69th","69th (Red Line)",40990,1,1,0,0,0,0,0,0,0,0],
  [30047,"S","79th (95th-bound)",-87.625112,41.750419,"79th","79th (Red Line)",40240,1,1,0,0,0,0,0,0,0,0],
  [30046,"N","79th (Howard-bound)",-87.625112,41.750419,"79th","79th (Red Line)",40240,1,1,0,0,0,0,0,0,0,0],
  [30276,"S","87th (95th-bound)",-87.624717,41.735372,"87th","87th (Red Line)",41430,1,1,0,0,0,0,0,0,0,0],
  [30275,"N","87th (Howard-bound)",-87.624717,41.735372,"87th","87th (Red Line)",41430,1,1,0,0,0,0,0,0,0,0],
  [30089,"S","95th/Dan Ryan (95th-bound)",-87.624342,41.722377,"95th/Dan Ryan","95th/Dan Ryan (Red Line)",40450,1,1,0,0,0,0,0,0,0,0],
  [30088,"N","95th/Dan Ryan (Howard-bound)",-87.624342,41.722377,"95th/Ran Ryan","95th/Ran Ryan (Red Line)",40450,1,1,0,0,0,0,0,0,0,0],
  [30132,"S","Adams/Wabash (Inner Loop)",-87.626037,41.879507,"Adams/Wabash","Adams/Wabash (Brown, Green, Orange, Pink & Purple Lines)",40680,0,0,0,0,1,0,1,0,1,1],
  [30131,"N","Adams/Wabash (Outer Loop)",-87.626037,41.879507,"Adams/Wabash","Adams/Wabash (Brown, Green, Orange, Pink & Purple Lines)",40680,0,0,0,1,1,0,0,0,0,0],
  [30274,"S","Addison (95th-bound)",-87.653626,41.947428,"Addison","Addison (Red Line)",41420,1,1,0,0,0,0,0,0,0,0],
  [30273,"N","Addison (Howard-bound)",-87.653626,41.947428,"Addison","Addison (Red Line)",41420,1,1,0,0,0,0,0,0,0,0],
  [30277,"N","Addison (Kimball-bound)",-87.674642,41.947028,"Addison","Addison (Brown Line)",41440,1,0,0,1,0,0,0,0,0,0],
  [30278,"S","Addison (Loop-bound)",-87.674642,41.947028,"Addison","Addison (Brown Line)",41440,1,0,0,1,0,0,0,0,0,0],
  [30240,"S","Addison (O'Hare Branch) (Forest Pk-bound)",-87.71906,41.94738,"Addison","Addison (Blue Line)",41240,0,0,1,0,0,0,0,0,0,0],
  [30239,"N","Addison (O'Hare Branch) (O'Hare-bound)",-87.71906,41.94738,"Addison","Addison (Blue Line)",41240,0,0,1,0,0,0,0,0,0,0],
  [30230,"S","Argyle (95th-bound)",-87.65853,41.973453,"Argyle","Argyle (Red Line)",41200,0,1,0,0,0,0,0,0,0,0],
  [30229,"N","Argyle (Howard-bound)",-87.65853,41.973453,"Argyle","Argyle (Red Line)",41200,0,1,0,0,0,0,0,0,0,0],
  [30127,"N","Armitage (Kimball-Linden-bound)",-87.652644,41.918217,"Armitage","Armitage (Brown & Purple Lines)",40660,1,0,0,1,0,0,1,0,0,0],
  [30128,"S","Armitage (Loop-bound)",-87.652644,41.918217,"Armitage","Armitage (Brown & Purple Lines)",40660,1,0,0,1,0,0,1,0,0,0],
  [30032,"E","Ashland (Harlem-54th/Cermak-bound)",-87.666969,41.885269,"Ashland","Ashland (Green & Pink Lines)",40170,1,0,0,0,1,0,0,0,1,0],
  [30033,"W","Ashland (Loop-63rd-bound)",-87.666969,41.885269,"Ashland","Ashland (Green & Pink Lines)",40170,1,0,0,0,1,0,0,0,1,0],
  [30205,"N","Ashland (Loop-bound)",-87.665317,41.839234,"Ashland","Ashland (Orange Line)",41060,1,0,0,0,0,0,0,0,0,1],
  [30206,"S","Ashland (Midway-bound)",-87.665317,41.839234,"Ashland","Ashland (Orange Line)",41060,1,0,0,0,0,0,0,0,0,1],
  [30056,"E","Ashland/63rd (Harlem-bound)",-87.663766,41.77886,"Ashland/63rd","Ashland/63rd (Green Line)",40290,1,0,0,0,1,0,0,0,0,0],
  [30057,"W","Ashland/63rd (Terminal arrival)",-87.663766,41.77886,"Ashland/63rd","Ashland/63rd (Green Line)",40290,1,0,0,0,1,0,0,0,0,0],
  [30243,"E","Austin (63rd-bound)",-87.774135,41.887293,"Austin","Austin (Green Line)",41260,0,0,0,0,1,0,0,0,0,0],
  [30002,"W","Austin (Forest Pk-bound)",-87.776812,41.870851,"Austin","Austin (Blue Line)",40010,0,0,1,0,0,0,0,0,0,0],
  [30244,"W","Austin (Harlem-bound)",-87.774135,41.887293,"Austin","Austin (Green Line)",41260,0,0,0,0,1,0,0,0,0,0],
  [30001,"E","Austin (O'Hare-bound)",-87.776812,41.870851,"Austin","Austin (Blue Line)",40010,0,0,1,0,0,0,0,0,0,0],
  [30256,"S","Belmont (95th-bound)",-87.65338,41.939751,"Belmont","Belmont (Red, Brown & Purple Lines)",41320,1,1,0,0,0,0,0,0,0,0],
  [30255,"N","Belmont (Howard-bound)",-87.65338,41.939751,"Belmont","Belmont (Red, Brown & Purple Lines)",41320,1,1,0,0,0,0,0,0,0,0],
  [30257,"N","Belmont (Kimball-Linden-bound)",-87.65338,41.939751,"Belmont","Belmont (Red, Brown & Purple Lines)",41320,1,0,0,1,0,0,1,0,0,0],
  [30258,"S","Belmont (Loop-bound)",-87.65338,41.939751,"Belmont","Belmont (Red, Brown & Purple Lines)",41320,1,0,0,1,0,0,1,0,0,0],
  [30013,"S","Belmont (O'Hare Branch) (Forest Pk-bound)",-87.712359,41.938132,"Belmont","Belmont (Blue Line)",40060,0,0,1,0,0,0,0,0,0,0],
  [30012,"N","Belmont (O'Hare Branch) (O'Hare-bound)",-87.712359,41.938132,"Belmont","Belmont (Blue Line)",40060,0,0,1,0,0,0,0,0,0,0],
  [30067,"S","Berwyn (95th-bound)",-87.658668,41.977984,"Berwyn","Berwyn (Red Line)",40340,0,1,0,0,0,0,0,0,0,0],
  [30066,"N","Berwyn (Howard-bound)",-87.658668,41.977984,"Berwyn","Berwyn (Red Line)",40340,0,1,0,0,0,0,0,0,0,0],
  [30268,"S","Bryn Mawr (95th-bound)",-87.65884,41.983504,"Bryn Mawr","Bryn Mawr (Red Line)",41380,0,1,0,0,0,0,0,0,0,0],
  [30267,"N","Bryn Mawr (Howard-bound)",-87.65884,41.983504,"Bryn Mawr","Bryn Mawr (Red Line)",41380,0,1,0,0,0,0,0,0,0,0],
  [30087,"W","California (54th/Cermak-bound)",-87.694774,41.854109,"California","California (Pink Line)",40440,1,0,0,0,0,0,0,0,1,0],
  [30265,"E","California (63rd-bound)",-87.696234,41.88422,"California","California (Green Line)",41360,1,0,0,0,1,0,0,0,0,0],
  [30266,"W","California (Harlem-bound)",-87.696234,41.88422,"California","California (Green Line)",41360,1,0,0,0,1,0,0,0,0,0],
  [30086,"E","California (Loop-bound)",-87.694774,41.854109,"California","California (Pink Line)",40440,1,0,0,0,0,0,0,0,1,0],
  [30112,"S","California/Milwaukee (Forest Pk-bound)",-87.69689,41.921939,"California","California  (Blue Line)",40570,0,0,1,0,0,0,0,0,0,0],
  [30111,"N","California/Milwaukee (O'Hare-bound)",-87.69689,41.921939,"California","California (Blue Line)",40570,0,0,1,0,0,0,0,0,0,0],
  [30054,"E","Central (63rd-bound)",-87.76565,41.887389,"Central","Central (Green Line)",40280,1,0,0,0,1,0,0,0,0,0],
  [30055,"W","Central (Harlem-bound)",-87.76565,41.887389,"Central","Central (Green Line)",40280,1,0,0,0,1,0,0,0,0,0],
  [30152,"W","Central Park (54th/Cermak-bound)",-87.714842,41.853839,"Central Park","Central Park (Pink Line)",40780,1,0,0,0,0,0,0,0,1,0],
  [30151,"E","Central Park (Loop-bound)",-87.714842,41.853839,"Central Park","Central Park (Pink Line)",40780,1,0,0,0,0,0,0,0,1,0],
  [30242,"S","Central-Evanston (Howard-Loop-bound)",-87.685617,42.063987,"Central","Central (Purple Line)",41250,0,0,0,0,0,1,1,0,0,0],
  [30241,"N","Central-Evanston (Linden-bound)",-87.685617,42.063987,"Central","Central (Purple Line)",41250,0,0,0,0,0,1,1,0,0,0],
  [30194,"S","Cermak-Chinatown (95th-bound)",-87.630968,41.853206,"Cermak-Chinatown","Cermak-Chinatown (Red Line)",41000,1,1,0,0,0,0,0,0,0,0],
  [30193,"N","Cermak-Chinatown (Howard-bound)",-87.630968,41.853206,"Cermak-Chinatown","Cermak-Chinatown (Red Line)",41000,1,1,0,0,0,0,0,0,0,0],
  [30382,"S","Cermak-McCormick Place (63rd-bound)",-87.626402,41.853115,"Cermak-McCormick Place","Cermak-McCormick Place (Green Line)",41690,1,0,0,1,0,0,0,0,0,0],
  [30381,"N","Cermak-McCormick Place (Harlem-bound)",-87.626402,41.853115,"Cermak-McCormick Place","Cermak-McCormick Place (Green Line)",41690,1,0,0,1,0,0,0,0,0,0],
  [30137,"N","Chicago/Franklin (Kimball-Linden-bound)",-87.635924,41.89681,"Chicago","Chicago (Brown & Purple Lines)",40710,1,0,0,1,0,0,1,0,0,0],
  [30138,"S","Chicago/Franklin (Loop-bound)",-87.635924,41.89681,"Chicago","Chicago (Brown & Purple Lines)",40710,1,0,0,1,0,0,1,0,0,0],
  [30272,"S","Chicago/Milwaukee (Forest Pk-bound)",-87.655214,41.896075,"Chicago","Chicago (Blue Line)",41410,0,0,1,0,0,0,0,0,0,0],
  [30271,"N","Chicago/Milwaukee (O'Hare-bound)",-87.655214,41.896075,"Chicago","Chicago (Blue Line)",41410,0,0,1,0,0,0,0,0,0,0],
  [30280,"S","Chicago/State (95th-bound)",-87.628176,41.896671,"Chicago","Chicago (Red Line)",41450,1,1,0,0,0,0,0,0,0,0],
  [30279,"N","Chicago/State (Howard-bound)",-87.628176,41.896671,"Chicago","Chicago (Red Line)",41450,1,1,0,0,0,0,0,0,0,0],
  [30083,"W","Cicero (54th/Cermak-bound)",-87.745336,41.85182,"Cicero","Cicero (Pink Line)",40420,1,0,0,0,0,0,0,0,1,0],
  [30094,"E","Cicero (63rd-bound)",-87.744698,41.886519,"Cicero","Cicero (Green Line)",40480,1,0,0,0,1,0,0,0,0,0],
  [30188,"W","Cicero (Forest Pk-bound)",-87.745154,41.871574,"Cicero","Cicero (Blue Line)",40970,0,0,1,0,0,0,0,0,0,0],
  [30009,"W","Cicero (Harlem-bound)",-87.744698,41.886519,"Cicero","Cicero (Green Line)",40480,1,0,0,0,1,0,0,0,0,0],
  [30082,"E","Cicero (Loop-bound)",-87.745336,41.85182,"Cicero","Cicero (Pink Line)",40420,1,0,0,0,0,0,0,0,1,0],
  [30187,"E","Cicero (O'Hare-bound)",-87.745154,41.871574,"Cicero","Cicero (Blue Line)",40970,0,0,1,0,0,0,0,0,0,0],
  [30122,"S","Clark/Division (95th-bound)",-87.631412,41.90392,"Clark/Division","Clark/Division (Red Line)",40630,1,1,0,0,0,0,0,0,0,0],
  [30121,"N","Clark/Division (Howard-bound)",-87.631412,41.90392,"Clark/Division","Clark/Division (Red Line)",40630,1,1,0,0,0,0,0,0,0,0],
  [30374,"S","Clark/Lake (Forest Pk-bound)",-87.630886,41.885737,"Clark/Lake","Clark/Lake (Blue, Brown, Green, Orange, Purple & Pink Lines)",40380,1,0,1,0,0,0,0,0,0,0],
  [30074,"E","Clark/Lake (Inner Loop)",-87.630886,41.885737,"Clark/Lake","Clark/Lake (Blue, Brown, Green, Orange, Purple & Pink Lines)",40380,1,0,0,0,1,0,1,0,1,1],
  [30375,"N","Clark/Lake (O'Hare-bound)",-87.630886,41.885737,"Clark/Lake","Clark/Lake (Blue, Brown, Green, Orange, Purple & Pink Lines)",40380,1,0,1,0,0,0,0,0,0,0],
  [30075,"W","Clark/Lake (Outer Loop)",-87.630886,41.885737,"Clark/Lake","Clark/Lake (Blue, Brown, Green, Orange, Purple & Pink Lines)",40380,1,0,0,1,1,0,0,0,0,0],
  [30085,"W","Clinton (Forest Pk-bound)",-87.640984,41.875539,"Clinton","Clinton (Blue Line)",40430,0,0,1,0,0,0,0,0,0,0],
  [30222,"W","Clinton (Harlem-54th/Cermak-bound)",-87.641782,41.885678,"Clinton","Clinton (Green & Pink Lines)",41160,1,0,0,0,1,0,0,0,1,0],
  [30221,"E","Clinton (Loop-63rd-bound)",-87.641782,41.885678,"Clinton","Clinton (Green & Pink Lines)",41160,1,0,0,0,1,0,0,0,1,0],
  [30084,"E","Clinton (O'Hare-bound)",-87.640984,41.875539,"Clinton","Clinton (Blue Line)",40430,0,0,1,0,0,0,0,0,0,0],
  [30291,"E","Conservatory (63rd-bound)",-87.716523,41.884904,"Conservatory","Conservatory (Green Line)",41670,1,0,0,0,1,0,0,0,0,0],
  [30292,"W","Conservatory (Harlem-bound)",-87.716523,41.884904,"Conservatory","Conservatory (Green Line)",41670,1,0,0,0,1,0,0,0,0,0],
  [30139,"E","Cottage Grove (Terminal arrival)",-87.605857,41.780309,"Cottage Grove","Cottage Grove (Green Line)",40720,1,0,0,0,1,0,0,0,0,0],
  [30045,"S","Cumberland (Forest Pk-bound)",-87.838028,41.984246,"Cumberland","Cumberland (Blue Line)",40230,1,0,1,0,0,0,0,0,0,0],
  [30044,"N","Cumberland (O'Hare-bound)",-87.838028,41.984246,"Cumberland","Cumberland (Blue Line)",40230,1,0,1,0,0,0,0,0,0,0],
  [30041,"W","Damen (54th/Cermak-bound)",-87.675975,41.854517,"Damen","Damen (Pink Line)",40210,1,0,0,0,0,0,0,0,1,0],
  [30018,"N","Damen (Kimball-bound)",-87.678639,41.966286,"Damen","Damen (Brown Line)",40090,1,0,0,1,0,0,0,0,0,0],
  [30040,"E","Damen (Loop-bound)",-87.675975,41.854517,"Damen","Damen (Pink Line)",40210,1,0,0,0,0,0,0,0,1,0],
  [30019,"S","Damen (Loop-bound)",-87.678639,41.966286,"Damen","Damen (Brown Line)",40090,1,0,0,1,0,0,0,0,0,0],
  [30116,"S","Damen/Milwaukee (Forest Pk-bound)",-87.677437,41.909744,"Damen","Damen (Blue Line)",40590,0,0,1,0,0,0,0,0,0,0],
  [30115,"N","Damen/Milwaukee (O'Hare-bound)",-87.677437,41.909744,"Damen","Damen (Blue Line)",40590,0,0,1,0,0,0,0,0,0,0],
  [30011,"S","Davis (Howard-Loop-bound)",-87.683543,42.04771,"Davis","Davis (Purple Line)",40050,1,0,0,0,0,1,1,0,0,0],
  [30010,"N","Davis (Linden-bound)",-87.683543,42.04771,"Davis","Davis (Purple Line)",40050,1,0,0,0,0,1,1,0,0,0],
  [30134,"S","Dempster (Howard-Loop-bound)",-87.681602,42.041655,"Dempster","Dempster (Purple Line)",40690,0,0,0,0,0,1,1,0,0,0],
  [30133,"N","Dempster (Linden-bound)",-87.681602,42.041655,"Dempster","Dempster (Purple Line)",40690,0,0,0,0,0,1,1,0,0,0],
  [30103,"N","Diversey (Kimball-Linden-bound)",-87.653131,41.932732,"Diversey","Diversey (Brown & Purple Lines)",40530,1,0,0,1,0,0,1,0,0,0],
  [30104,"S","Diversey (Loop-bound)",-87.653131,41.932732,"Diversey","Diversey (Brown & Purple Lines)",40530,1,0,0,1,0,0,1,0,0,0],
  [30063,"S","Division/Milwaukee (Forest Pk-bound)",-87.666496,41.903355,"Division","Division (Blue Line)",40320,0,0,1,0,0,0,0,0,0,0],
  [30062,"N","Division/Milwaukee (O'Hare-bound)",-87.666496,41.903355,"Division","Division (Blue Line)",40320,0,0,1,0,0,0,0,0,0,0],
  [30140,"W","East 63rd-Cottage Grove (Harlem-bound)",-87.605857,41.780309,"Cottage Grove","Cottage Grove (Green Line)",40720,1,0,0,0,1,0,0,0,0,0],
  [30076,"E","Forest Park (O'Hare-bound)",-87.817318,41.874257,"Forest Park","Forest Park (Blue Line)",40390,1,0,1,0,0,0,0,0,0,0],
  [30077,"W","Forest Park (Terminal Arrival)",-87.817318,41.874257,"Forest Park","Forest Park (Blue Line)",40390,1,0,1,0,0,0,0,0,0,0],
  [30102,"S","Foster (Howard-Loop-bound)",-87.68356,42.05416,"Foster","Foster (Purple Line)",40520,0,0,0,0,0,1,1,0,0,0],
  [30101,"N","Foster (Linden-bound)",-87.68356,42.05416,"Foster","Foster (Purple Line)",40520,0,0,0,0,0,1,1,0,0,0],
  [30167,"N","Francisco (Kimball-bound)",-87.701644,41.966046,"Francisco","Francisco (Brown Line)",40870,1,0,0,1,0,0,0,0,0,0],
  [30168,"S","Francisco (Loop-bound)",-87.701644,41.966046,"Francisco","Francisco (Brown Line)",40870,1,0,0,1,0,0,0,0,0,0],
  [30234,"S","Fullerton (95th-bound)",-87.652866,41.925051,"Fullerton","Fullerton (Red, Brown & Purple Lines)",41220,1,1,0,0,0,0,0,0,0,0],
  [30233,"N","Fullerton (Howard-bound)",-87.652866,41.925051,"Fullerton","Fullerton (Red, Brown & Purple Lines)",41220,1,1,0,0,0,0,0,0,0,0],
  [30235,"N","Fullerton (Kimball-Linden-bound)",-87.652866,41.925051,"Fullerton","Fullerton (Red, Brown & Purple Lines)",41220,1,0,0,1,0,0,1,0,0,0],
  [30236,"S","Fullerton (Loop-bound)",-87.652866,41.925051,"Fullerton","Fullerton (Red, Brown & Purple Lines)",41220,1,0,0,1,0,0,1,0,0,0],
  [30100,"S","Garfield (63rd-bound)",-87.618327,41.795172,"Garfield","Garfield (Green Line)",40510,1,0,0,0,1,0,0,0,0,0],
  [30099,"N","Garfield (Harlem-bound)",-87.618327,41.795172,"Garfield","Garfield (Green Line)",40510,1,0,0,0,1,0,0,0,0,0],
  [30224,"S","Garfield-Dan Ryan (95th-bound)",-87.631157,41.79542,"Garfield","Garfield (Red Line)",41170,1,1,0,0,0,0,0,0,0,0],
  [30223,"N","Garfield-Dan Ryan (Howard-bound)",-87.631157,41.79542,"Garfield","Garfield (Red Line)",41170,1,1,0,0,0,0,0,0,0,0],
  [30096,"S","Grand/Milwaukee (Forest Pk-bound)",-87.647578,41.891189,"Grand","Grand (Blue Line)",40490,0,0,1,0,0,0,0,0,0,0],
  [30095,"N","Grand/Milwaukee (O'Hare-bound)",-87.647578,41.891189,"Grand","Grand (Blue Line)",40490,0,0,1,0,0,0,0,0,0,0],
  [30065,"S","Grand/State (95th-bound)",-87.628021,41.891665,"Grand","Grand (Red Line)",40330,1,1,0,0,0,0,0,0,0,0],
  [30064,"N","Grand/State (Howard-bound)",-87.628021,41.891665,"Grand","Grand (Red Line)",40330,1,1,0,0,0,0,0,0,0,0],
  [30148,"S","Granville (95th-bound)",-87.659202,41.993664,"Granville","Granville (Red Line)",40760,1,1,0,0,0,0,0,0,0,0],
  [30147,"N","Granville (Howard-bound)",-87.659202,41.993664,"Granville","Granville (Red Line)",40760,1,1,0,0,0,0,0,0,0,0],
  [30215,"N","Halsted (Loop-bound)",-87.648088,41.84678,"Halsted","Halsted (Orange Line)",41130,1,0,0,0,0,0,0,0,0,1],
  [30216,"S","Halsted (Midway-bound)",-87.648088,41.84678,"Halsted","Halsted (Orange Line)",41130,1,0,0,0,0,0,0,0,0,1],
  [30184,"W","Halsted/63rd (Ashland-bound)",-87.644244,41.778943,"Halsted","Halsted (Green Line)",40940,1,0,0,0,1,0,0,0,0,0],
  [30183,"E","Halsted/63rd (Harlem-bound)",-87.644244,41.778943,"Halsted","Halsted (Green Line)",40940,1,0,0,0,1,0,0,0,0,0],
  [30003,"E","Harlem (63rd-bound)",-87.803176,41.886848,"Harlem/Lake","Harlem/Lake (Green Line)",40020,1,0,0,0,1,0,0,0,0,0],
  [30190,"W","Harlem (Forest Pk-bound)",-87.806961,41.87349,"Harlem","Harlem (Blue Line - Forest Park Branch)",40980,0,0,1,0,0,0,0,0,0,0],
  [30146,"S","Harlem (O'Hare Branch) (Forest Pk-bound)",-87.8089,41.98227,"Harlem","Harlem (Blue Line - O'Hare Branch)",40750,1,0,1,0,0,0,0,0,0,0],
  [30145,"N","Harlem (O'Hare Branch) (O'Hare-bound)",-87.8089,41.98227,"Harlem","Harlem (Blue Line - O'Hare Branch)",40750,1,0,1,0,0,0,0,0,0,0],
  [30189,"E","Harlem (O'Hare-bound)",-87.806961,41.87349,"Harlem","Harlem (Blue Line - Forest Park Branch)",40980,0,0,1,0,0,0,0,0,0,0],
  [30004,"W","Harlem (Terminal arrival)",-87.803176,41.886848,"Harlem/Lake","Harlem/Lake (Green Line)",40020,1,0,0,0,1,0,0,0,0,0],
  [30286,"S","Harrison (95th-bound)",-87.627479,41.874039,"Harrison","Harrison (Red Line)",41490,0,1,0,0,0,0,0,0,0,0],
  [30285,"N","Harrison (Howard-bound)",-87.627479,41.874039,"Harrison","Harrison (Red Line)",41490,0,1,0,0,0,0,0,0,0,0],
  [30174,"S","Howard (95th-Bound)",-87.672892,42.019063,"Howard","Howard (Red, Purple & Yellow Lines)",40900,1,1,0,0,0,0,0,0,0,0],
  [30175,"N","Howard (NB) (Linden, Skokie-bound)",-87.672892,"42.019063","Howard","Howard (Red, Purple & Yellow Lines)",40900,1,0,0,0,0,1,1,1,0,0],
  [30176,"S","Howard (Terminal arrival)",-87.672892,42.019063,"Howard","Howard (Red, Purple & Yellow Lines)",40900,1,0,0,0,0,1,1,1,0,0],
  [30173,"N","Howard (Terminal arrival)",-87.672892,42.019063,"Howard","Howard (Red, Purple & Yellow Lines)",40900,1,1,0,0,0,0,0,0,0,0],
  [30158,"W","Illinois Medical District (Forest Pk-bound)",-87.673932,41.875706,"Illinois Medical District","Illinois Medical District (Blue Line)",40810,1,0,1,0,0,0,0,0,0,0],
  [30157,"E","Illinois Medical District (O'Hare-bound)",-87.673932,41.875706,"Illinois Medical District","Illinois Medical District (Blue Line)",40810,1,0,1,0,0,0,0,0,0,0],
  [30059,"S","Indiana (63rd-bound)",-87.621371,41.821732,"Indiana","Indiana (Green Line)",40300,1,0,0,0,1,0,0,0,0,0],
  [30058,"N","Indiana (Harlem-bound)",-87.621371,41.821732,"Indiana","Indiana (Green Line)",40300,1,0,0,0,1,0,0,0,0,0],
  [30281,"N","Irving Park (Kimball-bound)",-87.674868,41.954521,"Irving Park","Irving Park (Brown Line)",41460,1,0,0,1,0,0,0,0,0,0],
  [30282,"S","Irving Park (Loop-bound)",-87.674868,41.954521,"Irving Park","Irving Park (Brown Line)",41460,1,0,0,1,0,0,0,0,0,0],
  [30108,"S","Irving Park (O'Hare Branch) (Forest Pk-bound)",-87.729229,41.952925,"Irving Park","Irving Park (Blue Line)",40550,0,0,1,0,0,0,0,0,0,0],
  [30107,"N","Irving Park (O'Hare Branch) (O'Hare-bound)",-87.729229,41.952925,"Irving Park","Irving Park (Blue Line)",40550,0,0,1,0,0,0,0,0,0,0],
  [30015,"S","Jackson/Dearborn (Forest Pk-bound)",-87.629296,41.878183,"Jackson","Jackson (Blue Line)",40070,1,0,1,0,0,0,0,0,0,0],
  [30014,"N","Jackson/Dearborn (O'Hare-bound)",-87.629296,41.878183,"Jackson","Jackson (Blue Line)",40070,1,0,1,0,0,0,0,0,0,0],
  [30110,"S","Jackson/State (95th-bound)",-87.627596,41.878153,"Jackson","Jackson (Red Line)",40560,1,1,0,0,0,0,0,0,0,0],
  [30109,"N","Jackson/State (Howard-bound)",-87.627596,41.878153,"Jackson","Jackson (Red Line)",40560,1,1,0,0,0,0,0,0,0,0],
  [30228,"S","Jarvis (95th-bound)",-87.669092,42.015876,"Jarvis","Jarvis (Red Line)",41190,0,1,0,0,0,0,0,0,0,0],
  [30227,"N","Jarvis (Howard-bound)",-87.669092,42.015876,"Jarvis","Jarvis (Red Line)",41190,0,1,0,0,0,0,0,0,0,0],
  [30248,"S","Jefferson Park (Forest Pk-bound)",-87.760892,41.970634,"Jefferson Park","Jefferson Park (Blue Line)",41280,1,0,1,0,0,0,0,0,0,0],
  [30247,"N","Jefferson Park (O'Hare-bound)",-87.760892,41.970634,"Jefferson Park","Jefferson Park (Blue Line)",41280,1,0,1,0,0,0,0,0,0,0],
  [30202,"W","Kedzie (54th/Cermak-bound)",-87.705408,41.853964,"Kedzie","Kedzie (Pink Line)",41040,1,0,0,0,0,0,0,0,1,0],
  [30207,"E","Kedzie (63rd-bound)",-87.706155,41.884321,"Kedzie","Kedzie (Green Line)",41070,1,0,0,0,1,0,0,0,0,0],
  [30208,"W","Kedzie (Harlem-bound)",-87.706155,41.884321,"Kedzie","Kedzie (Green Line)",41070,1,0,0,0,1,0,0,0,0,0],
  [30225,"N","Kedzie (Kimball-bound)",-87.708821,41.965996,"Kedzie","Kedzie (Brown Line)",41180,1,0,0,1,0,0,0,0,0,0],
  [30219,"N","Kedzie (Loop-bound)",-87.704406,41.804236,"Kedzie","Kedzie (Orange Line)",41150,1,0,0,0,0,0,0,0,0,1],
  [30201,"E","Kedzie (Loop-bound)",-87.705408,41.853964,"Kedzie","Kedzie (Pink Line)",41040,1,0,0,0,0,0,0,0,1,0],
  [30226,"S","Kedzie (Loop-bound)",-87.708821,41.965996,"Kedzie","Kedzie (Brown Line)",41180,1,0,0,1,0,0,0,0,0,0],
  [30220,"S","Kedzie (Midway-bound)",-87.704406,41.804236,"Kedzie","Kedzie (Orange Line)",41150,1,0,0,0,0,0,0,0,0,1],
  [30049,"W","Kedzie-Homan (Forest Pk-bound)",-87.70604,41.874341,"Kedzie-Homan","Kedzie-Homan (Blue Line)",40250,1,0,1,0,0,0,0,0,0,0],
  [30048,"E","Kedzie-Homan (O'Hare-bound)",-87.70604,41.874341,"Kedzie-Homan","Kedzie-Homan (Blue Line)",40250,1,0,1,0,0,0,0,0,0,0],
  [30250,"S","Kimball (Loop-bound)",-87.713065,41.967901,"Kimball","Kimball (Brown Line)",41290,1,0,0,1,0,0,0,0,0,0],
  [30249,"N","Kimball (Terminal arrival)",-87.713065,41.967901,"Kimball","Kimball (Brown Line)",41290,1,0,0,1,0,0,0,0,0,0],
  [30217,"E","King Drive (Cottage Grove-bound)",-87.615546,41.78013,"King Drive","King Drive (Green Line)",41140,1,0,0,0,1,0,0,0,0,0],
  [30218,"W","King Drive (Harlem-bound)",-87.615546,41.78013,"King Drive","King Drive (Green Line)",41140,1,0,0,0,1,0,0,0,0,0],
  [30118,"W","Kostner (54th/Cermak-bound)",-87.733258,41.853751,"Kostner","Kostner (Pink Line)",40600,1,0,0,0,0,0,0,0,1,0],
  [30117,"E","Kostner (Loop-bound)",-87.733258,41.853751,"Kostner","Kostner (Pink Line)",40600,1,0,0,0,0,0,0,0,1,0],
  [30290,"S","Lake/State (95th-bound)",-87.627813,41.884809,"Lake","Lake (Red Line)",41660,1,1,0,0,0,0,0,0,0,0],
  [30289,"N","Lake/State (Howard-bound)",-87.627813,41.884809,"Lake","Lake (Red Line)",41660,1,1,0,0,0,0,0,0,0,0],
  [30135,"E","Laramie (63rd-bound)",-87.754986,41.887163,"Laramie","Laramie (Green Line)",40700,1,0,0,0,1,0,0,0,0,0],
  [30136,"W","Laramie (Harlem-bound)",-87.754986,41.887163,"Laramie","Laramie (Green Line)",40700,1,0,0,0,1,0,0,0,0,0],
  [30262,"W","LaSalle (Forest Pk-bound)",-87.631722,41.875568,"LaSalle","LaSalle (Blue Line)",41340,0,0,1,0,0,0,0,0,0,0],
  [30261,"E","LaSalle (O'Hare-bound)",-87.631722,41.875568,"LaSalle","LaSalle (Blue Line)",41340,0,0,1,0,0,0,0,0,0,0],
  [30031,"W","LaSalle/Van Buren (Inner Loop)",-87.631739,41.8768,"LaSalle/Van Buren","LaSalle/Van Buren (Brown, Orange, Purple & Pink Lines)",40160,0,0,0,0,0,0,1,0,1,1],
  [30030,"E","LaSalle/Van Buren (Outer Loop)",-87.631739,41.8768,"LaSalle/Van Buren","LaSalle/Van Buren (Brown, Orange, Purple & Pink Lines)",40160,0,0,0,1,0,0,0,0,0,0],
  [30150,"S","Lawrence (95th-bound)",-87.658493,41.969139,"Lawrence","Lawrence (Red Line)",40770,0,1,0,0,0,0,0,0,0,0],
  [30149,"N","Lawrence (Howard-bound)",-87.658493,41.969139,"Lawrence","Lawrence (Red Line)",40770,0,1,0,0,0,0,0,0,0,0],
  [30166,"W","Library (Inner Loop)",-87.628196,41.876862,"Harold Washington Library-State/Van Buren","Harold Washington Library-State/Van Buren (Brown, Orange, Purple & Pink Lines)",40850,1,0,0,0,0,0,1,0,1,1],
  [30165,"E","Library (Outer Loop)",-87.628196,41.876862,"Harold Washington Library-State/Van Buren","Harold Washington Library-State/Van Buren (Brown, Orange, Purple & Pink Lines)",40850,1,0,0,1,0,0,0,0,0,0],
  [30204,"S","Linden (Howard-Loop-bound)",-87.69073,42.073153,"Linden","Linden (Purple Line)",41050,1,0,0,0,0,1,1,0,0,0],
  [30203,"N","Linden (Linden-bound)",-87.69073,42.073153,"Linden","Linden (Purple Line)",41050,1,0,0,0,0,1,1,0,0,0],
  [30198,"S","Logan Square (Forest Pk-bound)",-87.708541,41.929728,"Logan Square","Logan Square (Blue Line)",41020,1,0,1,0,0,0,0,0,0,0],
  [30197,"N","Logan Square (O'Hare-bound)",-87.708541,41.929728,"Logan Square","Logan Square (Blue Line)",41020,1,0,1,0,0,0,0,0,0,0],
  [30252,"S","Loyola (95th-bound)",-87.661061,42.001073,"Loyola","Loyola (Red Line)",41300,1,1,0,0,0,0,0,0,0,0],
  [30251,"N","Loyola (Howard-bound)",-87.661061,42.001073,"Loyola","Loyola (Red Line)",41300,1,1,0,0,0,0,0,0,0,0],
  [30124,"S","Madison/Wabash (Inner Loop)",-87.626098,41.882023,"Madison/Wabash","Madison/Wabash (Brown, Green, Orange, Pink & Purple Lines)",40640,0,0,0,0,1,0,1,0,1,1],
  [30123,"N","Madison/Wabash (Outer Loop)",-87.626098,41.882023,"Madison/Wabash","Madison/Wabash (Brown, Green, Orange, Pink & Purple Lines)",40640,0,0,0,1,1,0,0,0,0,0],
  [30053,"S","Main (Howard-Loop-bound)",-87.679538,42.033456,"Main","Main (Purple Line)",40270,0,0,0,0,0,1,1,0,0,0],
  [30052,"N","Main (Linden-bound)",-87.679538,42.033456,"Main","Main (Purple Line)",40270,0,0,0,0,0,1,1,0,0,0],
  [30090,"N","Merchandise Mart (Kimball-Linden-bound)",-87.633924,41.888969,"Merchandise Mart","Merchandise Mart (Brown & Purple Lines)",40460,1,0,0,1,0,0,1,0,0,0],
  [30091,"S","Merchandise Mart (Loop-bound)",-87.633924,41.888969,"Merchandise Mart","Merchandise Mart (Brown & Purple Lines)",40460,1,0,0,1,0,0,1,0,0,0],
  [30182,"S","Midway (Arrival)",-87.737875,41.78661,"Midway","Midway (Orange Line)",40930,1,0,0,0,0,0,0,0,0,1],
  [30181,"N","Midway (Loop-bound)",-87.737875,41.78661,"Midway","Midway (Orange Line)",40930,1,0,0,0,0,0,0,0,0,1],
  [30154,"S","Monroe/Dearborn (Forest Pk-bound)",-87.629378,41.880703,"Monroe","Monroe (Blue Line)",40790,0,0,1,0,0,0,0,0,0,0],
  [30153,"N","Monroe/Dearborn (O'Hare-bound)",-87.629378,41.880703,"Monroe","Monroe (Blue Line)",40790,0,0,1,0,0,0,0,0,0,0],
  [30212,"S","Monroe/State (95th-bound)",-87.627696,41.880745,"Monroe","Monroe (Red Line)",41090,0,1,0,0,0,0,0,0,0,0],
  [30211,"N","Monroe/State (Howard-bound)",-87.627696,41.880745,"Monroe","Monroe (Red Line)",41090,0,1,0,0,0,0,0,0,0,0],
  [30260,"S","Montrose (Forest Pk-bound)",-87.743574,41.961539,"Montrose","Montrose (Blue Line)",41330,0,0,1,0,0,0,0,0,0,0],
  [30287,"N","Montrose (Kimball-bound)",-87.675047,41.961756,"Montrose","Montrose (Brown Line)",41500,1,0,0,1,0,0,0,0,0,0],
  [30288,"S","Montrose (Loop-bound)",-87.675047,41.961756,"Montrose","Montrose (Brown Line)",41500,1,0,0,1,0,0,0,0,0,0],
  [30259,"N","Montrose (O'Hare-bound)",-87.743574,41.961539,"Montrose","Montrose (Blue Line)",41330,0,0,1,0,0,0,0,0,0,0],
  [30296,"W","Morgan (Harlem-54th/Cermak-bound)",-87.652193,41.885586,"Morgan","Morgan (Green & Pink Lines)",41510,1,0,0,0,1,0,0,0,1,0],
  [30295,"E","Morgan (Loop-63rd-bound)",-87.652193,41.885586,"Morgan","Morgan (Green & Pink Lines)",41510,1,0,0,0,1,0,0,0,1,0],
  [30021,"S","Morse (95th-bound)",-87.665909,42.008362,"Morse","Morse (Red Line)",40100,0,1,0,0,0,0,0,0,0,0],
  [30020,"N","Morse (Howard-bound)",-87.665909,42.008362,"Morse","Morse (Red Line)",40100,0,1,0,0,0,0,0,0,0,0],
  [30126,"S","North/Clybourn (95th-bound)",-87.649177,41.910655,"North/Clybourn","North/Clybourn (Red Line)",40650,0,1,0,0,0,0,0,0,0,0],
  [30125,"N","North/Clybourn (Howard-bound)",-87.649177,41.910655,"North/Clybourn","North/Clybourn (Red Line)",40650,0,1,0,0,0,0,0,0,0,0],
  [30079,"S","Noyes (Howard-Loop-bound)",-87.683337,42.058282,"Noyes","Noyes (Purple Line)",40400,0,0,0,0,0,1,1,0,0,0],
  [30078,"N","Noyes (Linden-bound)",-87.683337,42.058282,"Noyes","Noyes (Purple Line)",40400,0,0,0,0,0,1,1,0,0,0],
  [30263,"E","Oak Park (63rd-bound)",-87.793783,41.886988,"Oak Park","Oak Park (Green Line)",41350,0,0,0,0,1,0,0,0,0,0],
  [30035,"W","Oak Park (Forest Pk-bound)",-87.791602,41.872108,"Oak Park","Oak Park (Blue Line)",40180,0,0,1,0,0,0,0,0,0,0],
  [30264,"W","Oak Park (Harlem-bound)",-87.793783,41.886988,"Oak Park","Oak Park (Green Line)",41350,0,0,0,0,1,0,0,0,0,0],
  [30034,"E","Oak Park (O'Hare-bound)",-87.791602,41.872108,"Oak Park","Oak Park (Blue Line)",40180,0,0,1,0,0,0,0,0,0,0],
  [30297,"N","Oakton (Dempster-Skokie-bound)",-87.74722084,42.02624348,"Oakton-Skokie","Oakton-Skokie (Yellow Line)",41680,1,0,0,0,0,0,0,1,0,0],
  [30298,"S","Oakton (Howard-bound)",-87.74722084,42.02624348,"Oakton-Skokie","Oakton-Skokie (Yellow Line)",41680,1,0,0,0,0,0,0,1,0,0],
  [30172,"S","O'Hare Airport (Forest Pk-bound)",-87.90422307,41.97766526,"O'Hare","O'Hare (Blue Line)",40890,1,0,1,0,0,0,0,0,0,0],
  [30171,"N","O'Hare Airport (Terminal Arrival)",-87.90422307,41.97766526,"O'Hare","O'Hare (Blue Line)",40890,1,0,1,0,0,0,0,0,0,0],
  [30253,"N","Paulina (Kimball-bound)",-87.670907,41.943623,"Paulina","Paulina (Brown Line)",41310,1,0,0,1,0,0,0,0,0,0],
  [30254,"S","Paulina (Loop-bound)",-87.670907,41.943623,"Paulina","Paulina (Brown Line)",41310,1,0,0,1,0,0,0,0,0,0],
  [30200,"W","Polk (54th/Cermak-bound)",-87.66953,41.871551,"Polk","Polk (Pink Line)",41030,1,0,0,0,0,0,0,0,1,0],
  [30199,"E","Polk (Loop-bound)",-87.66953,41.871551,"Polk","Polk (Pink Line)",41030,1,0,0,0,0,0,0,0,1,0],
  [30029,"W","Pulaski (54th/Cermak-bound)",-87.724311,41.853732,"Pulaski","Pulaski (Pink Line)",40150,1,0,0,0,0,0,0,0,1,0],
  [30005,"E","Pulaski (63rd-bound)",-87.725404,41.885412,"Pulaski","Pulaski (Green Line)",40030,1,0,0,0,1,0,0,0,0,0],
  [30180,"W","Pulaski (Forest Pk-bound)",-87.725663,41.873797,"Pulaski","Pulaski (Blue Line)",40920,0,0,1,0,0,0,0,0,0,0],
  [30006,"W","Pulaski (Harlem-bound)",-87.725404,41.885412,"Pulaski","Pulaski (Green Line)",40030,1,0,0,0,1,0,0,0,0,0],
  [30185,"N","Pulaski (Loop-bound)",-87.724493,41.799756,"Pulaski","Pulaski (Orange Line)",40960,1,0,0,0,0,0,0,0,0,1],
  [30028,"E","Pulaski (Loop-bound)",-87.724311,41.853732,"Pulaski","Pulaski (Pink Line)",40150,1,0,0,0,0,0,0,0,1,0],
  [30186,"S","Pulaski (Midway-bound)",-87.724493,41.799756,"Pulaski","Pulaski (Orange Line)",40960,1,0,0,0,0,0,0,0,0,1],
  [30179,"E","Pulaski (O'Hare-bound)",-87.725663,41.873797,"Pulaski","Pulaski (Blue Line)",40920,0,0,1,0,0,0,0,0,0,0],
  [30007,"N","Quincy/Wells (Inner Loop)",-87.63374,41.878723,"Quincy/Wells","Quincy/Wells (Brown, Orange, Purple & Pink Lines)",40040,0,0,0,0,0,0,1,0,1,1],
  [30008,"S","Quincy/Wells (Outer Loop)",-87.63374,41.878723,"Quincy/Wells","Quincy/Wells (Brown, Orange, Purple & Pink Lines)",40040,0,0,0,1,0,0,0,0,0,0],
  [30093,"W","Racine (Forest Pk-bound)",-87.659458,41.87592,"Racine","Racine (Blue Line)",40470,0,0,1,0,0,0,0,0,0,0],
  [30092,"E","Racine (O'Hare-bound)",-87.659458,41.87592,"Racine","Racine (Blue Line)",40470,0,0,1,0,0,0,0,0,0,0],
  [30039,"S","Randolph/Wabash (Inner Loop)",-87.626149,41.884431,"Randolph/Wabash","Randolph/Wabash (Brown, Green, Orange, Pink & Purple Lines)",40200,0,0,0,0,1,0,1,0,1,1],
  [30038,"N","Randolph/Wabash (Outer Loop)",-87.626149,41.884431,"Randolph/Wabash","Randolph/Wabash (Brown, Green, Orange, Pink & Purple Lines)",40200,0,0,0,1,1,0,0,0,0,0],
  [30119,"E","Ridgeland (63rd-bound)",-87.783661,41.887159,"Ridgeland","Ridgeland (Green Line)",40610,0,0,0,0,1,0,0,0,0,0],
  [30120,"W","Ridgeland (Harlem-bound)",-87.783661,41.887159,"Ridgeland","Ridgeland (Green Line)",40610,0,0,0,0,1,0,0,0,0,0],
  [30195,"N","Rockwell (Kimball-bound)",-87.6941,41.966115,"Rockwell","Rockwell (Brown Line)",41010,1,0,0,1,0,0,0,0,0,0],
  [30196,"S","Rockwell (Loop-bound)",-87.6941,41.966115,"Rockwell","Rockwell (Brown Line)",41010,1,0,0,1,0,0,0,0,0,0],
  [30269,"N","Roosevelt/State (Howard-bound)",-87.627402,41.867368,"Roosevelt","Roosevelt (Red, Orange & Green Lines)",41400,1,1,0,0,0,0,0,0,0,0],
  [30270,"S","Roosevelt/State (Howard-bound)",-87.627402,41.867368,"Roosevelt","Roosevelt (Red, Orange & Green Lines)",41400,1,1,0,0,0,0,0,0,0,0],
  [30080,"N","Roosevelt/Wabash (Loop-Harlem-bound)",-87.62659,41.867405,"Roosevelt","Roosevelt (Red, Orange & Green Lines)",41400,1,0,0,0,1,0,0,0,0,1],
  [30081,"S","Roosevelt/Wabash (Midway-63rd-bound)",-87.62659,41.867405,"Roosevelt","Roosevelt (Red, Orange & Green Lines)",41400,1,0,0,0,1,0,0,0,0,1],
  [30160,"S","Rosemont (Forest Pk-bound)",-87.859388,41.983507,"Rosemont","Rosemont (Blue Line)",40820,1,0,1,0,0,0,0,0,0,0],
  [30159,"N","Rosemont (O'Hare-bound)",-87.859388,41.983507,"Rosemont","Rosemont (Blue Line)",40820,1,0,1,0,0,0,0,0,0,0],
  [30155,"N","Sedgwick (Kimball-Linden-bound)",-87.639302,41.910409,"Sedgwick","Sedgwick (Brown & Purple Lines)",40800,1,0,0,1,0,0,1,0,0,0],
  [30156,"S","Sedgwick (Loop-bound)",-87.639302,41.910409,"Sedgwick","Sedgwick (Brown & Purple Lines)",40800,1,0,0,1,0,0,1,0,0,0],
  [30017,"S","Sheridan (95th-bound)",-87.654929,41.953775,"Sheridan","Sheridan (Red Line)",40080,0,1,0,0,0,0,0,0,0,0],
  [30016,"N","Sheridan (Howard-bound)",-87.654929,41.953775,"Sheridan","Sheridan (Red Line)",40080,0,1,0,0,0,0,0,0,0,0],
  [30293,"N","Sheridan (Howard-Linden-bound)",-87.654929,41.953775,"Sheridan","Sheridan (Red Line)",40080,0,0,0,0,0,0,0,0,0,0],
  [30294,"S","Sheridan (Loop-bound)",-87.654929,41.953775,"Sheridan","Sheridan (Red Line)",40080,0,0,0,0,0,0,0,0,0,0],
  [30026,"N","Skokie (Arrival)",-87.751919,42.038951,"Skokie","Dempster-Skokie  (Yellow Line)",40140,1,0,0,0,0,0,0,1,0,0],
  [30027,"S","Skokie (Howard-bound)",-87.751919,42.038951,"Skokie","Dempster-Skokie  (Yellow Line)",40140,1,0,0,0,0,0,0,1,0,0],
  [30164,"S","South Blvd (Howard-Loop-bound)",-87.678329,42.027612,"South Boulevard","South Boulevard (Purple Line)",40840,0,0,0,0,0,1,1,0,0,0],
  [30163,"N","South Blvd (Linden-bound)",-87.678329,42.027612,"South Boulevard","South Boulevard (Purple Line)",40840,0,0,0,0,0,1,1,0,0,0],
  [30070,"N","Southport (Kimball-bound)",-87.663619,41.943744,"Southport","Southport (Brown Line)",40360,1,0,0,1,0,0,0,0,0,0],
  [30071,"S","Southport (Loop-bound)",-87.663619,41.943744,"Southport","Southport (Brown Line)",40360,1,0,0,1,0,0,0,0,0,0],
  [30037,"S","Sox-35th (95th-bound)",-87.630636,41.831191,"Sox-35th","Sox-35th (Red Line)",40190,1,1,0,0,0,0,0,0,0,0],
  [30036,"N","Sox-35th (Howard-bound)",-87.630636,41.831191,"Sox-35th","Sox-35th (Red Line)",40190,1,1,0,0,0,0,0,0,0,0],
  [30050,"E","State/Lake (Inner Loop)",-87.627835,41.88574,"State/Lake","State/Lake (Brown, Green, Orange, Pink & Purple Lines)",40260,0,0,0,0,1,0,1,0,1,1],
  [30051,"W","State/Lake (Outer Loop)",-87.627835,41.88574,"State/Lake","State/Lake (Brown, Green, Orange, Pink & Purple Lines)",40260,0,0,0,1,1,0,0,0,0,0],
  [30170,"S","Thorndale (95th-bound)",-87.659076,41.990259,"Thorndale","Thorndale (Red Line)",40880,0,1,0,0,0,0,0,0,0,0],
  [30169,"N","Thorndale (Howard-bound)",-87.659076,41.990259,"Thorndale","Thorndale (Red Line)",40880,0,1,0,0,0,0,0,0,0,0],
  [30069,"W","UIC-Halsted (Forest Pk-bound)",-87.649707,41.875474,"UIC-Halsted","UIC-Halsted (Blue Line)",40350,1,0,1,0,0,0,0,0,0,0],
  [30068,"E","UIC-Halsted (O'Hare-bound)",-87.649707,41.875474,"UIC-Halsted","UIC-Halsted (Blue Line)",40350,1,0,1,0,0,0,0,0,0,0],
  [30073,"S","Washington/Dearborn (Forest Pk-bound)",-87.62944,41.883164,"Washington","Washington (Blue Line)",40370,0,0,1,0,0,0,0,0,0,0],
  [30072,"N","Washington/Dearborn (O'Hare-bound)",-87.62944,41.883164,"Washington","Washington (Blue Line)",40370,0,0,1,0,0,0,0,0,0,0],
  [30141,"N","Washington/Wells (Inner Loop)",-87.63378,41.882695,"Washington/Wells","Washington/Wells (Brown, Orange, Purple & Pink Lines)",40730,1,0,0,0,0,0,1,0,1,1],
  [30142,"S","Washington/Wells (Outer Loop)",-87.63378,41.882695,"Washington/Wells","Washington/Wells (Brown, Orange, Purple & Pink Lines)",40730,1,0,0,1,0,0,0,0,0,0],
  [30231,"N","Wellington (Kimball-Linden-bound)",-87.653266,41.936033,"Wellington","Wellington (Brown & Purple Lines)",41210,1,0,0,1,0,0,1,0,0,0],
  [30232,"S","Wellington (Loop-bound)",-87.653266,41.936033,"Wellington","Wellington (Brown & Purple Lines)",41210,1,0,0,1,0,0,1,0,0,0],
  [30144,"W","Western (54th/Cermak-bound)",-87.685129,41.854225,"Western","Western (Pink Line)",40740,1,0,0,0,0,0,0,0,1,0],
  [30043,"W","Western (Forest Pk-bound)",-87.688436,41.875478,"Western","Western (Blue Line - Forest Park Branch)",40220,0,0,1,0,0,0,0,0,0,0],
  [30283,"N","Western (Kimball-bound)",-87.688502,41.966163,"Western","Western (Brown Line)",41480,1,0,0,1,0,0,0,0,0,0],
  [30060,"N","Western (Loop-bound)",-87.684019,41.804546,"Western","Western (Orange Line)",40310,1,0,0,0,0,0,0,0,0,1],
  [30143,"E","Western (Loop-bound)",-87.685129,41.854225,"Western","Western (Pink Line)",40740,1,0,0,0,0,0,0,0,1,0],
  [30284,"S","Western (Loop-bound)",-87.688502,41.966163,"Western","Western (Brown Line)",41480,1,0,0,1,0,0,0,0,0,0],
  [30061,"S","Western (Midway-bound)",-87.684019,41.804546,"Western","Western (Orange Line)",40310,1,0,0,0,0,0,0,0,0,1],
  [30042,"E","Western (O'Hare-bound)",-87.688436,41.875478,"Western","Western (Blue Line - Forest Park Branch)",40220,0,0,1,0,0,0,0,0,0,0],
  [30130,"S","Western/Milwaukee (Forest Pk-bound)",-87.687364,41.916157,"Western","Western (Blue Line - O'Hare Branch)",40670,1,0,1,0,0,0,0,0,0,0],
  [30129,"N","Western/Milwaukee (O'Hare-bound)",-87.687364,41.916157,"Western","Western (Blue Line - O'Hare Branch)",40670,1,0,1,0,0,0,0,0,0,0],
  [30106,"S","Wilson (95th-bound)",-87.657588,41.964273,"Wilson","Wilson (Red Line)",40540,0,1,0,0,0,0,0,0,0,0],
  [30105,"N","Wilson (Howard-bound)",-87.657588,41.964273,"Wilson","Wilson (Red Line)",40540,0,1,0,0,0,0,0,0,0,0]
];



$(window).on('popstate pushstate', function() {
  callRouter();
});

callRouter();

getStoredTrips();

})(jQuery);
