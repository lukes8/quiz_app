(function (angular) {

    // Default environment variables
    var __env = {};

    // Import variables if present
    if (window) {
        Object.assign(__env, window.__env);
    }

    var ngModule = angular.module("myApp", []);

    // ENV config as constant
    ngModule.constant('__env', __env);

    ngModule.directive("ngFileSelect", function ($q) {

        // var onLoad = function (reader, deferred, scope) {
        //     return function () {
        //         scope.$apply(function () {
        //             deferred.resolve(reader.result);
        //             console.log('resolve');
        //         });
        //     };
        // };

        // var readData = function (file, scope) {
        //     var deferred = $q.defer();
        //     var reader = new FileReader();
        //     reader.onload = onLoad(reader, deferred, scope);
        //     reader.readAsText(scope.file);
        //     return deferred.promise;
        // };

        return {
            link: function (scope, el) {
                el.bind("change", function (e) {
                    console.log(e.srcElement);
                    console.log(e.target);
                    scope.file = e.srcElement.files[0];
                    console.log(scope.file);

                    scope.readData(scope.file, scope)
                        .then(function (result) {
                            console.log(result);
                            scope.questionList = JSON.parse(result);
                            console.log(scope.questionList);
                        });
                })
            }
        }
    });

    ngModule.directive("myEmployee", function () {
        return {
            templateUrl: "<h1>My employee has this role: {{role}}</h1>",
            scope: {},
            // restrict: 'E',
            link: function (scope, element, attrs) {
                scope.role = attrs.role;
                if (scope.role === undefined)
                    scope.role = "not set yet";
            }
        };
    });

    // ngModule.controller("ModalAddQuestionCtrl", function ($scope, dialog) {
    //     $scope.save = function () {
    //         dialog.close("OK");
    //     };

    //     $scope.close = function () {
    //         dialog.close("CLOSE");
    //     };
    // });


    ngModule.controller("QuizController", QuizController);
    QuizController.$inject = ['$scope', '$q', '$http', '__env'];

    function QuizController($scope, $q, $http, __env) {

        // VARIABLES
        var _this = $scope;
        $scope.URL_BASE = __env.apiUrl;
        $scope.enableDebug = __env.enableDebug;
        $scope.URL_REST_API_CATEGORY = $scope.URL_BASE + "/rest/quiz-category";
        $scope.URL_REST_API_QUESTION = $scope.URL_BASE + "/rest/quiz-question";

        $scope.text = "...";
        $scope.logEnabled = true;
        $scope.checkboxModel = {
            value1: false,
            value2: false,
            value3: false
        };
        $scope.chbAnswer = "";
        $scope.categoryList = [
            {
                id: 0,
                name: "All",
                url: "all"
            },
            {
                id: 1,
                name: "History",
                url: "history"
            },
            {
                id: 2,
                name: "Geography",
                url: "geography"
            },
            {
                id: 3,
                name: "Nature",
                url: "nature"
            },
            {
                id: 4,
                name: "Languages",
                url: "languages"
            }
        ];
        $scope.questionList = [
            {
                number: 1,
                question: "Kdy prisli Cyril a Metodej na Moravu?",
                answers: ["863", "815", "653"],
                answerByUser: "",
                answerCorrect: "863",
                categoryId: 1,
                isTypeImg: false
            },
            {
                number: 2,
                question: "Legendarni Kazi mela celkem 3 jmena, jaka to byla?",
                answers: ["Kazi, Kase, Kasa", "Kazi, Kase, Potata", "Kazi, Sara, Kasa"],
                answerByUser: "",
                answerCorrect: "Kazi, Kase, Kasa",
                categoryId: 1,
                isTypeImg: false
            },
            {
                number: 3,
                question: "Co je na obrazku za strom?",
                answers: ["Lipa", "Dub", "Buk"],
                answerByUser: "",
                answerCorrect: "Dub",
                categoryId: 3,
                isTypeImg: true,
                imgUrl: "dub.jpg"
            },
            {
                number: 4,
                question: "Co je na obrazku za strom?",
                answers: ["Lipa", "Dub", "Buk"],
                answerByUser: "",
                answerCorrect: "Buk",
                categoryId: 3,
                isTypeImg: true,
                imgUrl: "buk.jpg"
            },
            {
                number: 5,
                question: "Co je na obrazku za strom?",
                answers: ["Lipa", "Javor", "Smrk", "Borovice"],
                answerByUser: "",
                answerCorrect: "Borovice",
                categoryId: 3,
                isTypeImg: true,
                imgUrl: "borovice.jpg"
            },
            {
                number: 6,
                question: "Co je na obrazku za strom?",
                answers: ["Lipa", "Dub", "Buk"],
                answerByUser: "",
                answerCorrect: "Lipa",
                categoryId: 3,
                isTypeImg: true,
                imgUrl: "lipa.jpg"
            }
        ];
        $scope.answerListByUser = [];
        $scope.resultPercent = 0;
        $scope.resultsVisibled = false;
        $scope.resultsVisibledText = "Show results";
        $scope.userQuestion = "";
        $scope.userAnswers = "";
        $scope.userCorrectAnswer = "";
        $scope.errorText = "...";
        $scope.selectedCategoryId = 0;
        $scope.categoryIdModel = 0;
        $scope.selectCategoryDisplayed = "All";
        $scope.modalSettings = {};
        //$scope.categoryList[0].id;   //default

        // METHODS
        $scope.categoryFilter = function (q) {
            var vm = $scope;
            console.log(q.categoryId + " - " + vm.selectedCategoryId);
            return q.categoryId === vm.selectedCategoryId || vm.selectedCategoryId === 0;
        };

        $scope.selectCategory = function (category) {
            var vm = $scope;
            console.log(vm.questionList);
            vm.selectedCategoryId = category.id;
            vm.selectCategoryDisplayed = category.name;
        };

        $scope.onLoadFile = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                    console.log('resolve');
                });
            };
        };

        $scope.readData = function (file, scope) {
            var deferred = $q.defer();
            console.log('FILE: ', file);
            var reader = new FileReader();
            reader.onload = scope.onLoadFile(reader, deferred, scope);
            reader.readAsText(scope.file);
            return deferred.promise;
        };

        $scope.onLoad = function () {
            // $scope.readData(, scope);
            console.log("NO LOAD --------------");
        }

        $scope.saveQuestionsToJson = function () {
            var vm = $scope;
            var savedJSON = angular.toJson(vm.questionList, true);
            var blob = new Blob([savedJSON], {
                type: "application/json;charset=utf-8;"
            });
            var downloadLink = document.createElement('a');
            downloadLink.setAttribute('download', 'userQuestions.txt');
            downloadLink.setAttribute('href', window.URL.createObjectURL(blob));
            downloadLink.click();
        }

        $scope.ok = function () {
            var vm = $scope;
            vm.text = "clicked ok";
            var correctNum = 0;
            vm.answerListByUser = [];
            var questionCategoryNum = 0;
            angular.forEach(vm.questionList, function (value, key) {
                if (vm.selectedCategoryId === 0 || vm.selectedCategoryId === value.categoryId) {
                    questionCategoryNum = questionCategoryNum + 1;
                    if (value.answerByUser === value.answerCorrect)
                        correctNum = correctNum + 1;
                    else
                        vm.answerListByUser.push(angular.copy(value));
                }
            })
            vm.resultPercent = (correctNum / questionCategoryNum) * 100;
            _this.hideResults(true);
            _this.log(vm.answerListByUser);
        }

        $scope.clear = function () {
            $scope.text = "clicked clear";
            var vm = $scope;
            angular.forEach(vm.questionList, function (value, key) {
                value.answerByUser = "";
            })
            vm.resultsVisibled = false;
            vm.answerListByUser = [];
        }

        $scope.hideResultsTop = function () {
            _this.resultsVisibled = !_this.resultsVisibled;
            _this.hideResults(_this.resultsVisibled);
        }

        $scope.hideResults = function (forceVisibled) {
            _this.resultsVisibled = forceVisibled;

            if (_this.resultsVisibled === false) {
                _this.resultsVisibledText = "Show results";
            } else {
                _this.resultsVisibledText = "Hide results";
            }

        }

        $scope.generateQuestionNumber = function () {
            return 1 + Math.max.apply(Math, $scope.questionList.map(function (item) { return item.number; }));
        }

        $scope.totalCategoryQuestions = function (category) {
            //         console.log(category);

            var vm = $scope;
            let count = 0;
            angular.forEach(vm.questionList, function (value) {
                if (value.categoryId === category.id) count += 1;
            });
            return count;
        }

        $scope.setImage = function (imgUrl) {
            var vm = $scope;
            vm.modalSettings = { imageUrl: imgUrl };
        };

        $scope.loadCategories = function () {

            $http.get($scope.URL_REST_API_CATEGORY).then(
                function successCallback(response) {
                    $scope.categoryList = [];
                    angular.forEach(response.data, function (value, key) {
                        $scope.addNewCategory(value);
                    });

                },
                function errorCallback(response) {
                    console.log("Unable to perform get request");
                }
            );
        };

        $scope.loadQuestions = function () {

            $http.get($scope.URL_REST_API_QUESTION).then(
                function successCallback(response) {

                    $scope.questionList = [];
                    angular.forEach(response.data, function (value, key) {
                        $scope.addNewQuestion(value);
                    });

                },
                function errorCallback(response) {
                    _this.log("Unable to perform get request");
                }
            );
        };

        $scope.addNewCategory = function (obj) {
            var vm = $scope;

            var newObj = {
                id: obj.id,
                name: obj.name
            };
            vm.categoryList.push(newObj);
        };

        $scope.addNewQuestion = function (question) {
            var vm = $scope;
            var answers_ = question.possibleAnswers.split(";");

            var newQ = {
                number: question.id,
                question: question.question,
                answers: answers_,
                answerByUser: "",
                answerCorrect: question.correctAnswer,
                categoryId: parseInt(question.categoryId)
            };
            vm.questionList.push(newQ);
            _this.log("q added");
        };

        _this.log = function (msg) {
            if ($scope.logEnabled === true) {
                console.log("LOG BEG");
                console.log(msg);
                console.log("LOG END");
            }
        };

        $scope.createQuestion = function () {
            var vm = $scope;
            var newQ = {
                id: null,
                question: vm.userQuestion,
                possibleAnswers: vm.userAnswers,
                correctAnswer: vm.userCorrectAnswer,
                categoryId: parseInt(vm.categoryIdModel)
            };

            var headers = { 'Content-Type': 'application/json' };
            var parameter = JSON.stringify(newQ);
            $http.post($scope.URL_REST_API_QUESTION, parameter).then(
                function successCallback(response) {
                    _this.log("Added ");
                    _this.log(response);
                    _this.errorText = "Question Added";
                    _this.loadQuestions();
                },
                function errorCallback(response) {
                    _this.log("not added");
                    _this.errorText = "Question not added";
                }
            );
        }

        $scope.modalDlgAddQuestion = function () {
            var errors = false;

            //validation begin
            if (_this.userQuestion === "" || _this.userAnswers === "" || _this.userCorrectAnswer === "") {
                _this.errorText = "You must enter all fields!";
                errors = true;
            } else {
                var answers_ = _this.userAnswers.split(";");
                //             console.log(answers_);
                if (answers_.length === 0 || _this.userCorrectAnswer.length === 0) {
                    _this.errorText = "Your must enter valid answers separated with semicolon";
                    errors = true;
                } else {
                    errors = true;
                    angular.forEach(answers_, function (value) {
                        if (value === _this.userCorrectAnswer)
                            errors = false;
                    });

                    if (errors === true)
                        _this.errorText = "You must enter correct answer from the list of available answers";

                    if (_this.categoryIdModel === "") {
                        _this.errorText = "You must enter specified category for the question";
                        errors = true;
                    }

                    //validation end
                    //new question obj
                    if (errors === false) {
                        _this.createQuestion();
                    }
                }
            }

        }

        // MAIN 
        console.log("MAIN BEGIN");

        $scope.loadCategories();
        $scope.loadQuestions();

        console.log("MAIN END");
    };

})(angular)