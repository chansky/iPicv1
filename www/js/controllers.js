    var optionCounter=0; var uniquePhotoCount=0; var photos = []; var WickedIndex;  var options = [];
    var tImgID;
    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value

function onDeviceReady() {
    console.log("device is ready");
    StatusBar.hide();
    //pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;  //might need to try switiching this to customCamera
    //document.addEventListener("pause", onPause, false);
    //document.addEventListener("resume", onResume, false);
    feedVisited=0; //a variable to control reloading the feed data.
     windowWidth = window.innerWidth;
     windowHeight = window.innerHeight;
     console.log("screen width is: "+windowWidth+", height is: "+windowHeight);
     deviceID=-1;
     theToken=-1;
     PUSHAPPS_APP_TOKEN="5ebcbd9a-8583-446e-81ee-f19e339fa88e";
     YOUR_GOOGLE_PROJECT_ID="75213574961";
   // console.log("destination type is: "+destinationType);
}

function option(){
  optionText="";
  containsImg=0;
  counterNum=-1;
}

function pictureHelper(){
    imgFilePath="";
    imgCaption="";
    imgCaption2="";  //for the first pic in queue only
}
function pollInfoHelper(){
    username="";
    pid="";
    endtime="";
    timeRemaining="";
}
function usernameObject(){
    name="";
    checked="false";
}
function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}

function alreadyContains(arr, testVal){
    for(var i=0; i<arr.length; i++){
        if(arr[i].name==testVal)
            return true;
    }
    return false;
}

function parsenum(pnum){
    pnum = pnum.toString();
    var num = "";
    var count = 0;
    var i = pnum.length-1;

    while(count != 10){
        if(pnum.charAt(i) !== '-'){
            num = pnum.charAt(i)+ num;
            count++;
        }
        i--;
    }
    return num;
}  


angular.module('iPic.controllers', [])

    
    .controller('homeCtrl', function ($scope, $location, $state) {
        
        ionic.Platform.ready(function() {
            // hide the status bar using the StatusBar plugin
            onDeviceReady();
            console.log("platform is ready");
            StatusBar.hide();
          });    
        $scope.changeView = function(view){
            //onDeviceReady();  //this shouldnt need to be here- REVIEW
            //$location.path(view);
            $state.go(view);
        }

          $scope.reportEvent = function(event)  {
            console.log('Reporting : ' + event.type);
            
            $timeout(function() {
              $scope.data[event.type]++;
            })
          }
    }) 

    .controller('registerPageCtrl', function($scope, $location, iPic){

        $scope.submitRegisterForm=function(){
            //onDeviceReady();
            console.log("register clicked");
            var g = $scope.Reggender;
            var ph = $scope.Regphonenumber;
            var em = $scope.Regemail;
            var u = $scope.Regusername;
            console.log("obtained username: "+u);
            var p = $scope.Regpassword;
            var a = $scope.Regage;
            var theToken=1;
            var deviceID=1;
            var deviceType=1;

            if(theToken!=-1&&deviceID!=-1){
                var deviceType=-1;
                    if(devicePlatform=="Android"){
                        deviceType=1;
                    }
                    else{
                        deviceType=2;
                    }
                var devicePlatform="chansky";
                if(em!='' && u!='' && p!=''&& deviceID!=''){
                    iPic.registerPost("https://web.engr.illinois.edu/~chansky2/register.php",{gender:g,phonenumber:ph,email:em,username:u,password:p,age:a,token:theToken,deviceID:deviceID,deviceType:deviceType}).success(function(res){
                        console.log("res at 0: "+res[0]+" ,res at 1: "+res[1]+ ", res at 2: "+res[2]);
                        if(res[2]=='t'){
                            console.log("inside the res==t");
                            $location.path("contactsPage");
                        }
                        console.log("return vals from register call: "+res);
                    }); 
                }  
                else{
                    window.alert("empty field(s)");
                }
            }
        }


    })

    .controller('sendToPageCtrl', function($scope, $location, $state, iPic){
        console.log("in sendTo page");
        
         $scope.contacts = [];
        var fullNames= [];
        $scope.groupNames=[];

        iPic.get("https://web.engr.illinois.edu/~chansky2/buildGroup.php").success(function(resp){
            console.log("response is: "+resp);
            var obj = resp;            
            console.log("obj[i][gn]: "+obj[0]["gn"]);
            console.log("length of obj is: "+obj.length);
            //console.log("obj[i].gn: "+obj[i].gn);
            for(var i = 0; i < obj.length; i++) {
             // if(inArray(obj[i].gn, groupNames)==-1)  //to prevent duplicates
               // console.log("obj at: "+i+" is: "+obj[i]["gn"]+"\n");
                $scope.groupNames.push(obj[i]["gn"]);     
            }
        });
        iPic.get("https://web.engr.illinois.edu/~chansky2/getFriends.php").success(function(data){
            var obj = data;
            console.log("get Friends obj: "+obj);
            console.log("obj[0]['username']: "+obj[0]["username"]);
            for(var i = 0; i < obj.length; i++) {
             // if(jQuery.inArray(obj[i].username, contacts)==-1)  //to prevent duplicates
                if(!alreadyContains($scope.contacts, obj[i]["username"])){
                   // console.log("obj at: "+i+" is: "+obj[i]["username"]+"\n");
                    temp= new usernameObject();
                    temp.name=obj[i]["username"];
                    $scope.contacts.push(temp);     
                }
            }
        });  


         $scope.sendInfo =function(){
        var selected = [];
        var groupsSelected=[];
       /* $('#sendToCheckboxes input:checked').each(function() {
            selected.push($(this).attr('name'));
        });
    */
       // console.log("i can see contacts array is of length: "+$scope.contacts.length);
            for(var i=0; i<$scope.contacts.length; i++){
               // console.log("val at "+i+" is: "+$scope.contacts[i].name);
               // console.log("val at "+i+" is: "+$scope.contacts[i].checked);
                if($scope.contacts[i].checked==true)
                    selected.push($scope.contacts[i].name);
            }
    /*
        $('#groupNameCheckBoxes input:checked').each(function(){
            groupsSelected.push($(this).attr('name'));
        });
    */
           // console.log("1st group selected: "+groupsSelected[0]);
    //get info from local storage
        var info=(localStorage.getItem("allPollInfo"));
        var parsedInfo=JSON.parse(info);
        var et = parsedInfo["endTime"];  //weird ios only issue with this?
        var dt= parsedInfo["disappearTime"];
        var isInsta=parsedInfo["isInsta"];
        var options=parsedInfo["optionsArr"];
        console.log("endtime: "+et);
        console.log("disappearTime: "+dt);
        console.log("options looks like this: "+options);
        console.log("parsed options looks like: "+JSON.stringify(options));
        var betterOptions=JSON.stringify(options);
        var betterReceivers = JSON.stringify(selected);
        var betterGroups = JSON.stringify(groupsSelected);
       // window.alert("your poll is being created!");
        iPic.post("https://web.engr.illinois.edu/~chansky2/addPollv4.php",{num_options:options.length,
            options:betterOptions, insta:isInsta, endtime:et, disappearTime:dt, receivers:betterReceivers, receivingGroups:betterGroups}).success(function(res){
            //window.alert("res: "+res);
        //iPic.post("https://web.engr.illinois.edu/~chansky2/addPollI.php",parsedInfo).success(function(res){
            console.log("the output of the call to addPollv4: "+res);
            var retVal=parseInt(res);
            //console.log("res at 0 is: "+res[0]);
            //console.log("res at 1 is: "+res[1]);
            //console.log("ret val is: "+retVal);
            $scope.uploadStuff(retVal, options);

            localStorage.removeItem("allPollInfo");
            //$localStorage.$reset();
            //$location.path("createPoll");
            $state.go("createPoll");
            //window.location.hash="createPoll";
        }); 
      }


function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}
    $scope.uploadStuff =function(num, photos){
        console.log("in upload stuff (the function that uploads the photos)");
        console.log("photo length is: "+photos.length);
        var fileName="";
        var image=0;
        if(photos.length>0)
            image=1;
        if(image==1){
            for(var i=0; i<photos.length; i++){  
                fileName=photos[i].imgFilePath;
                var uploadOptions = new FileUploadOptions();
                uploadOptions.fileKey="file";
                uploadOptions.fileName=num+".jpg";  //look at num
                console.log("pic file name: "+uploadOptions.fileName);
                uploadOptions.mimeType="image/jpg";
                uploadOptions.chunkedMode=false;
                //uploadOptions.correctOrientation= true;  //this didn't do anything
             //   uploadOptions.chunkedMode = true;  //new
                uploadOptions.headers = {Connection: "close"}; //new, this really helped android upload!
                var params = new Object();
                uploadOptions.params = params;
                var ft = new FileTransfer();
                ft.upload(fileName, encodeURI("https://web.engr.illinois.edu/~chansky2/uploadFile.php"), win, fail, uploadOptions, true);
                num++;
            }
        }
                    options=[]; photos=[];  //testing emptying   
            console.log("curr local storage length: "+localStorage.length);
            localStorage.clear();
            console.log("curr local storage length: "+localStorage.length);
    }  

          
    })

    .controller('loginPageCtrl', ['$scope', 'iPic', '$location', '$state', function($scope, iPic, $location, $state){
        $scope.submitLogin = function(){
            var u = $scope.username;
            var p = $scope.password;
            console.log(u);
            console.log(p);
            if(u!='' && p!=''){
                iPic.create(u, p).success(function(res){ 
                    console.log("the db access returned: " +res);
                    if(res[1]==='t'){
                        $state.go("createPoll");
                       // $location.path("createPoll");  //this line is a f'n miracle     
                    }
                    else{
                      //  window.alert("incorrect username or password");
                        //$location.reload();
                    }
                }).error(function(d){
                    console.log("in error part");
                    console.log(d);
                });
            }
            else{
               // window.alert("username or password is missing");
                //location.reload();
            }
            return false;
        }
    }])


    .controller('settingsPageCtrl', function($scope, $location, $state){
        $scope.onSwipeRight = function(){
            $state.go("createPoll");
        }
        $scope.goToSearchPage = function(){
            $state.go("searchPage");
        }
        $scope.goToInstaPage = function(){
            $state.go("instaPage");
        }
        $scope.goToMakeGroupsPage = function(){
            $state.go("makeGroupsPage");
        }
        $scope.goToListFriendsPage = function(){
            $state.go("listFriendsPage");
        }

    })
    .controller('makeGroupsPageCtrl', function($scope, $location, $state){
        $scope.onSwipeRight = function(){
            $state.go("settingsPage");
        }
    })
    .controller('searchPageCtrl', function($scope, $location, $state){
        $scope.onSwipeRight = function(){
            $state.go("settingsPage");
        }
    })
    .controller('instaPageCtrl', function($scope, $location, $state){
        $scope.onSwipeRight = function(){
            $state.go("settingsPage");
        }
    })  
    .controller('listFriendsPageCtrl', function($scope, $location, $state){
        $scope.onSwipeRight = function(){
            $state.go("settingsPage");
        }
    })  

    .controller('feedPageCtrl', function($scope, $location, iPic, $state, $stateParams){
         //console.log('#personalFeed');
         console.log("to params: "+$state.cameraExit);


         console.log("stateParams: "+$stateParams);
         console.log("stateParams: "+$stateParams[0]);
         console.log("stateParams: "+$stateParams.cameraExit);
        $scope.feedData=[];
        if(feedVisited==0){  //just added for control of reload
            console.log("feedVisited was 0 so we got data");
            getFeedData();
            feedVisited=1;
        } //just added for control of reload
        else{  //we already have feed data (and its in localStorage)
           // $scope.feedData=jQuery.parseJSON(localStorage.getItem("feedDataArr"));
            $scope.feedData=JSON.parse(localStorage.getItem("feedDataArr"));
           // console.log("first endtime: "+endtime[0]);
            dataLength=$scope.feedData.length;
           // displayFeed();
        }

       /* $('#feedList').delegate('li', 'vclick', function() {
            var index = $(this).index();
            var selectedIndex="selectedIndex";
            window.localStorage.setItem(selectedIndex, $(this).index());  //i added this semi colon july 9th
           console.log("Stopping timeCirlces and dataLength is: "+dataLength);
          for(var i=0; i<dataLength; i++){
            if(timeRemaining[i]>=0){
                var input="."+i;
                $(input).TimeCircles().stop();
            }
          }
            window.location.hash="chart";
        });  */
         $scope.refresh=function(){
            console.log("refreshing feed");
            console.log("Stopping timeCircles and dataLength is: "+$scope.dataLength);
            for(var i=0; i<$scope.dataLength; i++){
              if($scope.feedData[i].timeRemaining>=0){
                    var input="."+i;
                    //$(input).TimeCircles().stop();
                }
            }
            //$('#feedList').empty();
            resetFeedArrays();
            getFeedData();            
        };

        function getFeedData(){
            iPic.get("https://web.engr.illinois.edu/~chansky2/personalFeediPic.php").success(function(data){
                console.log("data: "+data);
                            console.log("response is: "+data);
                            //console.log("parsed data: "+JSON.parse(data));
                            var obj = data;            
                           // console.log("obj[i][gn]: "+obj[0]["gn"]);
                            console.log("length of obj is: "+obj.length);
                            //console.log("obj[i].gn: "+obj[i].gn);
                            for(var i = 0; i < obj.length; i++) {
                             // if(inArray(obj[i].gn, groupNames)==-1)  //to prevent duplicates
                                console.log("obj at: "+i+" is: "+obj[i]["username"]+"\n");
                                //$scope.groupNames.push(obj[i]["gn"]);     
                            }
                if(data!= null && data!==undefined){    //VERY CRAPPY NULL CHECKER....
                    //var obj = JSON.parse( data );
                    for(var i = 0; i < obj.length; i++) {
                        temp = new pollInfoHelper();
                        temp.username=obj[i].username;
                        temp.pid=obj[i].PID;
                        temp.endtime=obj[i].endtime;
                        temp.timeRemaining=obj[i].timeRemaining;
                        $scope.feedData.push(temp);
                    }
                    dataLength=$scope.feedData.length;
                   // displayFeed();
                    var feedDataArr="feedDataArr";
                    if(typeof(window.localStorage) != 'undefined'){ 
                        window.localStorage.setItem(feedDataArr, JSON.stringify($scope.feedData));
                    } 
                    else{ 
                        console.log("store FAILED");
                        throw "window.localStorage, not defined"; 
                    }
                }
                else{
                    var word="NO FOLLOWERS";
                    console.log("no followers");
                   // $('#feedList').append('<li><a href="">' + word + '</a></li>').listview('refresh');
                }
            });  //this is clsing the get!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!    
        }

       /* function displayFeed(){
            console.log("displayFeed called");
            for (var j = 0; j < dataLength; j++) {   //not sure why this needs to be in the get
                var clock="display:inline-block; width:100%; height:20%;";
                var helperText="'s poll ends in: ";
                var timeDiff=timeRemaining[j];
                if(timeDiff<=0){
                    helperText="'s poll has ended (but can still be viewed)";
                }

                var phrase='<li><a><h2>'+usernames[j]+helperText+'</h2><div class="'+j+'", data-timer="'+timeDiff+'", style="'+clock+'"></div></a></li>';
                $('#feedList').append(phrase).listview('refresh');
                //add the time circle for each row:
                //console.log("endtime for item "+j+", is: "+endtime[j]);
                if(timeDiff>0){
                    var input="."+j;
                    $(input).TimeCircles({ "animation": "smooth",
                    "bg_width": 1.2,
                    "fg_width": 0.1,
                    "circle_bg_color": "#60686F", "count_past_zero": false, "time": {
                    "Days": {
                        "text": "Days",
                        "color": "#FFCC66",
                        "show": true
                    },
                    "Hours": {
                        "text": "Hours",
                        "color": "#99CCFF",
                        "show": true
                    },
                    "Minutes": {
                        "text": "Minutes",
                        "color": "#BBFFBB",
                        "show": true
                    },
                    "Seconds": {
                        "text": "Seconds",
                        "color": "#FF9999",
                        "show": true
                    }
                    }});
                }
                //$(input).TimeCircles({total_duration: "Minutes"}).rebuild();

            }
                            $('#feedList').trigger('create');

                $('#feedList').listview('refresh');
        } */

        function resetFeedArrays(){
            $scope.feedData=[];
        }
        
        $scope.enterDisplayView = function (PID){  //receives pid that was clicked on
            console.log("clicked on poll with id: "+PID);
            var thePollToDisplay="thePollToDisplay";
            window.localStorage.setItem(thePollToDisplay, PID);
            $location.path("showThePoll");
        }

        $scope.onSwipeLeft = function(){
            console.log("You swiped left");
            //$state.transitionTo("createPoll", {testParams: "WTF"}, {reload: true});
            //$state.go("createPoll", {testParams: "openCapture"}, { reload: true });
            $state.go("createPoll");
            console.log("should be in createPoll state now");
            //href="#/createPoll";   
            //$location.path("createPoll");  //this seems to cause an issue so trying the above line
        }
    })

    .controller('showThePollCtrl', function($scope, $location, $ionicSlideBoxDelegate, $state, iPic){
        $scope.pollImages=[];
        $scope.response="";
        //var myPieChart = new Chart(ctx[0]).Pie(data,options);
      /*  var ctx = $scope.myChart;
        console.log("ctx is: "+ctx);
        var myNewChart = new Chart(ctx).Pie(data,options);
        var data = [
            {
                value: 300,
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Red"
            },
            {
                value: 50,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Green"
            },
            {
                value: 100,
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "Yellow"
            }
        ]  */
        var PID=localStorage.getItem("thePollToDisplay");
        console.log("retrieved the poll from local storage: "+PID);
        
        iPic.pollInfoPost("https://web.engr.illinois.edu/~chansky2/getPollInfoiPic.php", PID).success(function(data){
            console.log(data);
            console.log(data[0]);
            console.log(data[1].choiceID);

            for(var i=1; i<data.length; i++){
                console.log("choice id num: "+data[i]["choiceID"]);
                console.log("caption text: "+data[i]["textt"]);
                temp = new pictureHelper();
                temp.imgCaption=data[i]["textt"];
                temp.imgFilePath="https://web.engr.illinois.edu/~chansky2/uploads/"+data[i]["choiceID"]+".jpg";
                $scope.pollImages.push(temp);
                $ionicSlideBoxDelegate.update();
            }
        });  
        $scope.onSwipeRight = function(val){
            console.log("You swiped right: "+val);
            //$state.transitionTo("feedPage", {testParams: "WTF"}, {reload: true});
            if(val==0)
                $state.go("feedPage");
            //console.log("should be in createPoll state now");
            //href="#/createPoll";   
            //$location.path("createPoll");  //this seems to cause an issue so trying the above line
        }
    })

    .controller('createPollCtrl', function($scope, $location, $ionicModal, $ionicSlideBoxDelegate, $state, $stateParams, Camera, Camera2){
        console.log("inside create poll ctrl");
        console.log($stateParams);
        $scope.addOptionHelper = new pictureHelper();
       /* $scope.screen = {
            name: 'Slidebox'
        };  */
        $scope.imagesForSlideBox =[];
        var isInsta=0;
        var helper;
        var filename= "f"+0;
        var slideCount=0;
        var selectedValue="null"
        console.log("current slide count is: "+slideCount);

        console.log("current slide index: "+ $ionicSlideBoxDelegate.currentIndex());
      $scope.timeOptions = [
          {time:'1 Minute'},
          {time:'5 Minutes'},
          {time:'10 Minutes'},
          {time:'30 Minutes'},
          {time:'1 Hour'},
          {time:'1 Day'},
          {time:'1 Week'}
      ]; 
        
      /*  $scope.getPhoto = function() {
            Camera.getPicture().then(function(imageURI) {
                console.log("about to get image uri");
              console.log(imageURI);
              $scope.lastPhoto = imageURI;
              $scope.imagesForSlideBox.push($scope.lastPhoto);
              console.log( "got image");
            }, function(err) {
              console.err(err);
            }, {
              quality: 75,
              targetWidth: 320,
              targetHeight: 320,
              saveToPhotoAlbum: false
            });
          }; */
        var width= window.innerWidth;
        var height = window.innerHeight;
        console.log("width is: "+width+", and height is: "+height);

          $scope.getPhoto = function() {
            console.log('Getting camera');
            Camera2.getPicture().then(function(imageURI) {
              console.log(imageURI);
             // $scope.lastPhoto = imageURI;
               temp = new pictureHelper();
                        temp.imgFilePath=imageURI;
                        temp.imgCaption="";
                        $scope.imagesForSlideBox.push(temp);
                        $ionicSlideBoxDelegate.update();
                        slideCount+=1;
            }, function(err) {
                console.log("error: "+err);
                //console.err(err);
                if(err=="Camera cancelled."){
                    console.log("string match");
                    $state.go("feedPage", {cameraExit: 1}, {location: false, inherit: false});
                    //$state.go("feedPage");

                }
            }, {
              quality: 75,
              targetWidth: 320,
              targetHeight: 320,
              saveToPhotoAlbum: false
            });
            /*
            navigator.camera.getPicture(function(imageURI) {
              console.log(imageURI);
            }, function(err) {
            }, { 
              quality: 50,
              destinationType: Camera.DestinationType.DATA_URL
            });
            */
          }
/*
          $scope.getPhoto = function(){
            console.log("in getPhoto function");
               /* Camera.getPicture(filename, function success(fileUri) {  //append navigator.custom
                    console.log("File location: " + fileUri);
                    if(fileUri=="GO TO FEED SCREEN"){
                                            $ionicSlideBoxDelegate.update();

                        $state.go("feedPage");
                        return "GO TO FEED SCREEN";
                    }  
                    temp = new pictureHelper();
                    temp.imgFilePath=fileUri;
                    temp.imgCaption="";
                    $scope.imagesForSlideBox.push(temp);
                    $ionicSlideBoxDelegate.update();
                    slideCount+=1;
                   // $ionicSlideBoxDelegate.slide(slideCount);
                    //$ionicSlideBoxDelegate.slide(slideCount-1);
                    //$ionicSlideBoxDelegate.slide(slideCount);
                    return fileUri;  */
/* placed for camera 2 test
                navigator.customCamera.getPicture(filename, function success(fileUri) {
                    //alert("File location: " + fileUri);
                     if(fileUri=="GO TO FEED SCREEN"){
                                            $ionicSlideBoxDelegate.update();

                       // $state.go("feedPage");
                       successful(fileUri);
                       console.log("YOOOOO");
                       //$scope.getPhoto();
                       return "WTF";
                        //return "GO TO FEED SCREEN";
                    }
                    else{  
                        temp = new pictureHelper();
                        temp.imgFilePath=fileUri;
                        temp.imgCaption="";
                        $scope.imagesForSlideBox.push(temp);
                        $ionicSlideBoxDelegate.update();
                        slideCount+=1;
                        return fileUri;
                    }
                }, function failure(error) {
                    alert(error);
                }, {
                    quality: 100,
                    destinationType: destinationType.FILE_URI,
                    targetWidth: width,
                    targetHeight: height
      camera2test          });  */ 


               /* }, function failure(error) {
                    if (error=="GO TO FEED SCREEN"){
                        console.log(error);
                        return "GO TO FEED SCREEN";
                      //  if(slideCount==0){
                        //    $ionicSlideBoxDelegate.update();
                          //  emptyCreatePollVals();
                            //console.log("slide count was 0");
                        //}
                    }
                    else{
                        console.log("something went wrong: "+error);
                        alert(error);
                    }
                }, {
                    quality: 100,
                   // targetWidth: -1,
                   // targetHeight: -1
                    targetWidth: width,
                    targetHeight: height
                }); */
     // camera2 test     } 

            function nextSlide() {
                $ionicSlideBoxDelegate.next();
              }


        if($ionicSlideBoxDelegate.currentIndex()===undefined || $ionicSlideBoxDelegate.currentIndex()==slideCount){
                    if($ionicSlideBoxDelegate.currentIndex()===undefined){
                        console.log("initial call to getPhoto");
                    }
                    helper=$scope.getPhoto();

                    console.log("helper is: "+helper);
                    if(helper=="GO TO FEED SCREEN"){
                        //we want to go to feed screen, but need to do so properly
                        console.log("we want to go to feed screen, but need to do so properly");
                        $state.go("feedPage");
                    }
        }

        successful = function(val){
            console.log("entered successful: "+val);
                    if(val=="GO TO FEED SCREEN"){
            //we want to go to feed screen, but need to do so properly
            console.log("we want to go to feed screen, but need to do so properly");
            //$state.go("feedPage");
            $state.transitionTo("feedPage", {testParams: "WTF"});
            }
        }


         $scope.checkForNewCaputre = function(value){
            //$ionicSlideBoxDelegate.update();
            console.log("called checkForNewCapture: "+value);
            //console.log("slidebox  count is: "+$ionicSlideBoxDelegate.slidesCount()-1);
            console.log("slidecount is: "+slideCount);
            if(value==slideCount||value==-100){  //at the end of the slide box so take another pic
                    console.log("at the end of the slide box so take another pic: "+value);
                    value=slideCount;
                    filename="f"+value;  //need the f to ensure filename remains a string.
                    $scope.addOptionHelper.imgCaption="";
                    helper=$scope.getPhoto();
                    if(helper=="GO TO FEED SCREEN"){
                        //we want to go to feed screen, but need to do so properly
                        console.log("we want to go to feed screen, but need to do so properly");
                        $state.go("feedPage");
                    }
             }
            else{
                $scope.addOptionHelper.imgCaption=$scope.imagesForSlideBox[value].imgCaption;
                //console.log("set option text to: "+$scope.addOptionHelper.imgCaption);
            }
        }

        $scope.goToFeedScreen= function(){
         //$location.path("feedPage");
            //$scope.back = false; 
            $state.go("feedPage");
        }

        $scope.goToSettingsPage = function(){
            $state.go("settingsPage");
        }

        $scope.goToSendToPage = function(){
            console.log("clicked go to send to page");

            var d = new Date();
            var seconds = d.getUTCSeconds();
            var minutes = d.getUTCMinutes();
            var hour = d.getUTCHours();
            var year = d.getUTCFullYear();
            var month = d.getUTCMonth()+1; // beware: January = 0; February = 1, etc.  //need +1 b/c of php
            var day = d.getUTCDate();
            //second set of these values for dissapear time
            console.log("date object: "+d);
            console.log("year thing: "+year);
            var s, m, h, y, mo, d;
            y=year;
            mo=month;
            s=seconds;
            h=hour;
            m=minutes;
            d=day;
            var noTimePicked=0;
            console.log("time val picked: "+selectedValue);
            if(selectedValue=="1 Minute"){
                minutes=minutes+1;
                m=minutes+1;
            }
            else if(selectedValue=="5 Minutes"){
                minutes=minutes+5;
                m=minutes+5;
            }
            else if(selectedValue=="10 Minutes"){
                minutes=minutes+10;
                m=minutes+10;
            }
            else if (selectedValue=="30 Minutes"){
                minutes=minutes+30;
                m=minutes+30;
            }
            else if (selectedValue=="1 Hour"){
                hour=hour+1;
                h=hour+1;
            }
            else if (selectedValue=="1 Day"){
                day=day+1;
                d=day+1;
            }
            else if (selectedValue=="1 Week"){
                day=day+7;
                d=day+7
            }
            else{
                noTimePicked=1;
            }
            //seems like the below should only happen if no time picked is still equal to 0...
            if(minutes>=60){
              minutes=minutes%60;
              hour=hour+1;
            }
            if(m>=60){
              m=m%60;
              h=h+1;
            }
            if(hour>=24){
              hour=hour%24;
              day=day+1;
            }
            if(h>=24){
              h=h%24;
              d=d+1;
            }
            if(day>daysInMonth(month,year)){
              day=day-daysInMonth(month,year);
              month=month+1;
            }
            if(d>daysInMonth(mo, y)){
              d=d-daysInMonth(mo, y);
              mo=mo+1;
            }
            if(month>11){
              month=0;
              year=year+1;
            }
            if(mo>11){
              mo=0;
              y=y+1;
            }
            if(month<10){  //need this to make php and sql happy
                month="0"+month;
            }
            if(m<10){
              m="0"+m;
            }
           var et="";
           var dt="";
           if(noTimePicked!=1){
                var et=year+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
                var dt=y+"-"+mo+"-"+d+" "+h+":"+m+":"+s;
            }
            console.log("endtime: "+et);
            console.log("is insta: "+isInsta);
            var allPollInfo={'endTime': et, 'optionsArr':$scope.imagesForSlideBox, 'isInsta': isInsta, 'disappearTime':dt};
            if(typeof(window.localStorage) != 'undefined'){ 
                console.log('storing local data');
                window.localStorage['allPollInfo']= JSON.stringify(allPollInfo);
            } 
            else{ 
                window.alert("storage failed...");
                console.log("store FAILED");
                throw "window.localStorage, not defined"; 
            }
            emptyCreatePollVals();  //I think I want to do this here...but critical to review this
            $state.go("sendToPage");
        }

        $ionicModal.fromTemplateUrl('templates/timeAndInstaModal.html', function($ionicModal) {
            $scope.modal = $ionicModal;
          }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
          });
        $ionicModal.fromTemplateUrl('templates/modalForText.html', function($ionicModal) {
            $scope.modal2 = $ionicModal;
          }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope, 
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up'
          });
          $scope.openModal = function() {
            //console.log('Opening Modal');
            $scope.modal.show();
          }
        $scope.closeModal = function(instaVal, timeVal) {
            //console.log('Closing Modal');
            isInsta= instaVal;
            //console.log("insta checked: "+isInsta);
            if(!isInsta){
              isInsta="0";
            }
            if(timeVal!=null)
                selectedValue = timeVal;
            console.log("selected time: "+selectedValue);
            $scope.modal.hide();
        }

          $scope.modalTextEntry = function() {
           // console.log('Opening Modal for text entry');
            var currSlideSelected = $ionicSlideBoxDelegate.currentIndex();
           // console.log("currently on slide: "+currSlideSelected);
            $scope.addOptionHelper.imgCaption=$scope.imagesForSlideBox[currSlideSelected].imgCaption;
            //console.log("curr caption: "+$scope.imagesForSlideBox[currSlideSelected].imgCaption);
            $scope.modal2.show();
          }
        $scope.closeTextModal = function(value) {
            //console.log("value entered is: "+value);
            var currSlideSelected = $ionicSlideBoxDelegate.currentIndex();
            $scope.imagesForSlideBox[currSlideSelected].imgCaption=value;
            $scope.modal2.hide();
          }

        function emptyCreatePollVals(){
           // $scope.screen = "";
            selectedValue="null"
            isInsta=0;
            //maybe do for loop here to empty slidebox...
            for (var x=0; x<$scope.imagesForSlideBox.length; x++){
                if(x !== -1) {
                    //$scope.imagesForSlideBox.splice(x,1);
                    //console.log("spliced");
                }
            }
            $scope.imagesForSlideBox =[];
            $ionicSlideBoxDelegate.update();
            $scope.addOptionHelper="";
            slideCount=0;
        }
        $scope.remove = function(array, index){
              /* $cordovaFile.removeDir(cordova.file.dataDirectory, "/data/data/ipic313198/cache")
              .then(function (success) {
                console.log("successful removal of dir");
              }, function (error) {
                 console.log("failed removal of dir");

              }); */
            //$cordovaFile.removeFile(array[index].imgFilePath, "f0");
            console.log("clicked remove on index: "+index);
            console.log("FilePath: "+array[index].imgFilePath);

console.log("remove file");
var relativeFilePath = array[index].imgFilePath;
var justDir= "file:///data/data/com.ionicframework.ipic313198/cache/";
       //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, removefile, fail);

//       window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
//window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

/* function gotFS(fileSystem) {
  alert("entered gotFS: " + fileSystem.root.toURL());
  onFileSystemSuccess(fileSystem);
}  */
      // window.resolveLocalFileSystemURI(relativeFilePath, removefile, fail);
       window.resolveLocalFileSystemURL(relativeFilePath, success, fail); //kinda works but not


//removefile();

/*
       window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
        window.resolveLocalFileSystemURI(array[index].imgFilePath, onResolveSuccess, fail);
    

    function onFileSystemSuccess(fileSystem) {
        console.log(fileSystem.name);
    }

    function onResolveSuccess(fileEntry) {
        console.log(fileEntry.name);
        fileEntry.remove();
    }

    function fail(evt) {
        console.log(evt.target.error.code);
    }
  */
         function onFileSystemSuccess(fileSystem) {
            fileSystem.root.getDirectory(
                 justDir,
                {create : true, exclusive : false},
                function(entry) {
                entry.removeRecursively(function() {
                    console.log("Remove Recursively Succeeded");
                }, fail);
            }, fail);
        }  

    function removefile(fileSystem){
        console.log("filesystem: "+fileSystem.name);
      //  console.log(isFile(fileSystem.name));
        //console.log(isFile(relativeFilePath));
        console.log(relativeFilePath);
        console.log("root: "+fileSystem.root);
        fileSystem.root.getFile("f0", {create: false, exclusive: false}, gotRemoveFileEntry, fail);
    }

    function gotRemoveFileEntry(fileEntry){
        console.log(fileEntry);
        fileEntry.remove(success, fail);
    }

    function success(entry) {
        console.log("entry is: "+entry);
        console.log("is file: "+entry.isFile);
        console.log("name of fileEntry: "+entry.name);
        console.log("full path of fileentry: "+entry.fullPath);
        entry.remove(worked, failed);
        console.log("Removal succeeded (file existed)");
    }

    function fail(error) {
        console.log("Error removing file: " + error.code);
    }

    function worked(val){
        console.log("deleted: "+val);
    }
    function failed(val){
        console.log("did not delete");
        console.log(val);
    }
/*
var relativeFilePath = array[index].imgFilePath;
window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
    fileSystem.root.getFile(relativeFilePath, {create:false}, function(fileEntry){
        fileEntry.remove(function(file){
            console.log("File removed!");
        },function(){
            console.log("error deleting the file " + error.code);
            });
        },function(){
            console.log("file does not exist");
        });
    },function(evt){
        console.log(evt.target.error.code);
});   */




            array.splice(index, 1);
            $ionicSlideBoxDelegate.update();
            if(index!=0){
                $ionicSlideBoxDelegate.slide(index-1);

            }
            slideCount=slideCount-1;
            if(slideCount==0)
                $scope.getPhoto();

        }
    })



    .controller('contactsPageCtrl', function($scope, $location, iPic){
        console.log('contacts Page');
        var contactOptions = new ContactFindOptions();   //this used to be var options =... but i changed it
        contactOptions.filter = "";
        contactOptions.multiple = true;
        var fields = ["displayName","phoneNumbers"];
        console.log("about to call find contacts");
        navigator.contacts.find(fields, onSuccess, onError, contactOptions);      
        var loaded = false;
        var pnums = [];  

        function onSuccess(contacts) {
            console.log("Success, found contacts");
            for(var i=0; i<contacts.length; i++){
                if(contacts[i].displayName){
                    if(contacts[i].phoneNumbers != null){
                        for(var j=0; j<contacts[i].phoneNumbers.length; j++){
                            pnums.push(parsenum(contacts[i].phoneNumbers[j].value));
                        }
                    }
                }
            }

            $scope.usernames = [];
            console.log("about to make the post request part of find contacts");
            pnums=JSON.stringify(pnums);
             iPic.phoneNumbersPost("https://web.engr.illinois.edu/~chansky2/findContacts.php",{phonenumbers:pnums}).success(function(res){
               console.log("find contacts php returned: "+res[0].username);
               if(res!="No"){  //never have tested this case (i'd need a phone who doesn't have my #)
                  //  var obj = JSON.parse(res);   //or i'd have to remove my # from the DB
                    var obj=res;
                    for(var i=0; i<obj.length; i++){
                        if(!alreadyContains($scope.usernames, obj[i].username)){
                            console.log(obj[i].username);
                            temp= new usernameObject();
                            temp.name=obj[i].username;
                            $scope.usernames.push(temp);
                        }
                    }  
                }
                else{
                    $location.path("createPoll");   //change back!!!!!!!!
                }
             });
        }
        function onError(contacts){
            console.log("WTF");
            console.log(contacts);
        }  

        $scope.follow=function(){
            var selected = [];
            for(var i=0; i<$scope.usernames.length; i++){
               // console.log("val at "+i+" is: "+$scope.usernames[i].name);
               // console.log("val at "+i+" is: "+$scope.usernames[i].checked);
                if($scope.usernames[i].checked==true)
                    selected.push($scope.usernames[i].name);
            }
            //window.alert(selected);
            selected=JSON.stringify(selected);
            iPic.followPost("https://web.engr.illinois.edu/~chansky2/followContacts.php",{type:"follow", usernames:selected}).success(function(res){
                //window.alert(res);
                //window.location = "createPoll.html";
                $location.path("createPoll");
            });
            //and also sign up to receive thier notifications (by default)
         /*   $.post("https://web.engr.illinois.edu/~chansky2/addInsta.php",{type:"add", usernames:selected},function(res){
                //window.alert(res);
               $location.path("createPoll");
            });  */
        }
        $scope.skip=function(){
            $location.path("createPoll");
        }         
    })

    .directive('detectGestures', function($ionicGesture) {
  return {
    restrict :  'A',

    link : function(scope, elem, attrs) {
      var gestureType = attrs.gestureType;

      switch(gestureType) {
        case 'swipe':
          $ionicGesture.on('swipe', scope.reportEvent, elem);
          break;
        case 'swiperight':
          $ionicGesture.on('swiperight', scope.reportEvent, elem);
          console.log("swiped right");
          break;
        case 'swipeleft':
          $ionicGesture.on('swipeleft', scope.reportEvent, elem);
          console.log("swiped left");
          break;
        case 'doubletap':
          $ionicGesture.on('doubletap', scope.reportEvent, elem);
          break;
        case 'tap':
          $ionicGesture.on('tap', scope.reportEvent, elem);
          break;
      }

    }
  }
});


    //modal stuff below

