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
    .service('myService', function ($http){

        this.getData = function (){ // Initial server call collecting projects.

            return $http({
                maethod: 'GET',
                url: "request.php" //Calling local PHP script
            })
                .success(function(data){
                    console.log("Successfully Fetch ALL data!"); // Confirmation in console
                });
        }
    })
    .controller('myControler', ['$interval', '$scope', 'myService', function ($interval, $scope, myService) {

        var projectIndex = 0; // Index of current slideing element. Initalizing to 0 sou first image deisplays first

        $scope.projects = {  // The Simulation Object. We are applying this just to have a multiple projects for slide show.
            0 : {
                name : "Testing Project",
                link: "https://innosabi.com/",
                img: "img/1.jpeg",
                description: "Sed ut perspiciatis unde omnis iste natus error sit voluptate. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.Aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
                endDate: counter("2016-01-30 23:00:00"),
            },
            1 : {
                name : "Project Testing",
                link: "https://innosabi.com/",
                img: "img/2.jpeg",
                description: "Sed ut perspiciatis unde omnis iste natus error sit voluptate. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.Aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
                endDate: counter("2016-01-28 10:00:00"),
            },
            2 : {
                name : "Testing Project",
                link: "https://innosabi.com/",
                img: "img/3.jpeg",
                description: "Sed ut perspiciatis unde omnis iste natus error sit voluptate. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.Aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
                endDate: counter("2016-01-31 22:00:00"),
            },
            3 : {
                name : "Project Testing",
                link: "https://innosabi.com/",
                img: "img/4.jpeg",
                description: "Sed ut perspiciatis unde omnis iste natus error sit voluptate. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.Aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
                endDate: counter("2016-01-28 23:00:00"),
            }
        }

        myService.getData() // Calling the service
            .success(function(data){
                //$scope.projects = data.projects; //This would be like if we are pooling everything from API
                console.log(data.projects); //Just to visualize
                var apiProject = { //Adding Project from API to static object
                    name : data.projects[0].name,
                    link: data.projects[0].link,
                    img: data.projects[0].images.projectImage.link.href,
                    description: data.projects[0].description,
                    endDate: counter(data.projects[0].phases[0].step[131].endDate.date)
                }
                $scope.projects[Object.keys($scope.projects).length]=apiProject;
            })


        $scope.isCurrentSlideIndex = function(index){ // Checking if which image needs to be displayed
            if (projectIndex == index) {
                return true; // Returning true to "ng-if" if match
            }
        }

        function changeProject(){ // Changing project to display
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
            $interval(function(){ // Every 4.5 secconds we are changing the project.
                changeProject();
            }, 5000);
        }

        $scope.startSliding();//Starting slider

        function counter(date) { // Calculating how much time we have left till start
            var end = new Date(date);

            //Initializing time Variables sou we can calculate with each of them
            var sec = 1000;
            var min = sec * 60;
            var h = min * 60;
            var d = h * 24;
            var timer;

            var now = new Date();
            var distance = end - now; // Calculating the diference
            if (distance < 0) {

                clearInterval(timer);
                document.getElementById('countdown').innerHTML = 'EXPIRED!';

                return;
            }

            // Converting difference to readable date format
            var days = Math.floor(distance / d);
            var hours = Math.floor((distance % d) / h);
            var minutes = Math.floor((distance % h) / min);
            var seconds = Math.floor((distance % min) / sec);

            return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
        }


    }])
