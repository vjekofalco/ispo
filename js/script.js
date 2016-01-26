angular.module('ISPO', [])
    .config(function($httpProvider) {
        $httpProvider.interceptors.push(function(){

            return {  // Returning response from HTTP request
                response: function(req) {
                    console.log("HTTP_Response fetch!" + req);
                    return req;
                }
            }
        })
    })
    .service('getProjects', function ($http){

        this.getData = function (){ // Initial server call collecting projects.

            return $http({
                method: 'GET',
                url: "request.php" //Calling local PHP script
            })
                .success(function(data){
                    console.log("Successfully Fetch ALL data!"); // Confirmation in console
                });
        }
    })
    .controller('projectsSliderCtrl', ['$interval', '$scope', 'getProjects', function ($interval, $scope, getProjects) {

        var projectIndex = 0; // Index of current slideing element. Initalizing to 0 sou first image deisplays first

        $scope.projects = {  // The Simulation Object. We are applying this just to have a multiple projects for slide show.
            0 : {
                name : "Testing Project",
                link: "https://innosabi.com/",
                img: "img/1.jpeg",
                description: "Sed ut perspiciatis unde omnis iste natus error sit voluptate. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.Aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
                endDate: "2016-01-30 23:00:00",
                timeLeft: '',
            },
            1 : {
                name : "Project Testing",
                link: "https://innosabi.com/",
                img: "img/2.jpeg",
                description: "Sed ut perspiciatis unde omnis iste natus error sit voluptate. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.Aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
                endDate: "2016-01-28 10:00:00",
                timeLeft: '',
            },
            2 : {
                name : "Testing Project",
                link: "https://innosabi.com/",
                img: "img/3.jpeg",
                description: "Sed ut perspiciatis unde omnis iste natus error sit voluptate. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.Aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
                endDate: "2016-01-31 22:00:00",
                timeLeft: '',
            },
            3 : {
                name : "Project Testing",
                link: "https://innosabi.com/",
                img: "img/4.jpeg",
                description: "Sed ut perspiciatis unde omnis iste natus error sit voluptate. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.Aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
                endDate: "2016-01-28 23:00:00",
                timeLeft: '',
            }
        }

        $scope.loadProjects = function() {
            getProjects.getData() // Calling the service
                .success(function (data) {
                    //$scope.projects = data.projects; //This would be like if we are pooling everything from API
                    console.log(data.projects); //Just to visualize
                    angular.forEach(data.projects, function (value, key) {
                        var phase = Object.keys(data.projects[key].phases)[0];
                        var steps = Object.keys(data.projects[key].phases[phase].step)[0];
                        var apiProject = { //Adding Project from API to static object
                            name: data.projects[key].name,
                            link: data.projects[key].link,
                            img: data.projects[key].images.projectImage.link.href,
                            description: data.projects[key].description,
                            endDate: data.projects[key].phases[phase].step[steps].endDate.date,
                            timeLeft: '',
                        }
                        $scope.projects[Object.keys($scope.projects).length] = apiProject;
                    })
                })
        }
        $scope.loadProjects();

        $scope.refreshProjects = function(){ // Setting up interval function to check for a new projects every 5 minutes
            $interval(function(){
                $scope.loadProjects();
            }, 50000);
        }
        $scope.refreshProjects();

        $scope.isCurrentSlideIndex = function(index){ // Checking if which image needs to be displayed
            if (projectIndex == index) {
                return true; // Returning true to "ng-if" if match
            }
        }

        // This function also is in use to manually slide project forward
        $scope.changeProject = function(){ // Changing project to display
            if(Object.keys($scope.projects).length > 0) { // If we have yust one project then we don't need to apply slide effect
                if (projectIndex < Object.keys($scope.projects).length - 1) { // Checking if we have reach last project
                    projectIndex = projectIndex + 1;
                }
                else { // If we are on last project then back to firs
                    projectIndex = 0;
                }
            }
        }

        $scope.startSliding = function(){
            slide =  $interval(function(){ // Every 4.5 secconds we are changing the project.
                $scope.changeProject();
            }, 5000);
        }
        $scope.startSliding();// Starting slider

        $scope.stopSlide = function(){ // Stopping slider on Hover
            $interval.cancel(slide);
        }

        $scope.prevSlide = function(){
            if(Object.keys($scope.projects).length > 0) { // If We have more than one project we can do the slide
                if (projectIndex > 0) { // Checking if we have reach the first project
                    projectIndex = projectIndex - 1;
                }
                else { // If we are on the first project then go to last
                    projectIndex = Object.keys($scope.projects).length - 1;
                }
            }
        }

        $scope.count = function () { // Calculating how much time we have left till start
            $interval(function () {
                angular.forEach($scope.projects, function(value, key) {
                    var end = new Date($scope.projects[key].endDate);

                    //Initializing time Variables sou we can calculate with each of them
                    var sec = 1000;
                    var min = sec * 60;
                    var h = min * 60;
                    var d = h * 24;

                    var now = new Date();
                    var distance = end - now; // Calculating the diference

                    if (distance < 0) {
                        $scope.projects[key].timeLeft = 'EXPIRED';
                    }

                    // Converting difference to readable date format
                    var days = Math.floor(distance / d);
                    var hours = Math.floor((distance % d) / h);
                    var minutes = Math.floor((distance % h) / min);
                    var seconds = Math.floor((distance % min) / sec);

                    $scope.projects[key].timeLeft = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
                })
            }, 1000)
        }
        $scope.count(); // Starting counter

    }])
    .filter('htmlToText', function(){ // Filter is stripping the HTML tags from text
        return function(html){
            var text =  html ? String(html).replace(/<[^>]+>/gm, '') : ''; // Deleting HTML tags
            if(text.length > 200){ // Checking if text is too long
                text = text.substring(0,200);
                text = text + " ...";
            }
            return text; // Returning result
        }
    })

