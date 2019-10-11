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
    QuizController.$inject = ['$scope', '$q', '$http', '$timeout', '__env'];

    function QuizController($scope, $q, $http, $timeout, __env) {

        // VARIABLES
        var _this = $scope;
        $scope.URL_BASE = __env.apiUrl;
        $scope.enableDebug = __env.enableDebug;
        $scope.URL_REST_API_CATEGORY = $scope.URL_BASE + "/rest/quiz-category";
        $scope.URL_REST_API_QUESTION = $scope.URL_BASE + "/rest/quiz-question";

        $scope.msgBoxHeader = "None";
        $scope.msgBoxContent = "No details";

        $scope.MSG_SUCCESS_GENERAL = "Success";
        $scope.MSG_ERROR_GENERAL = "Failed";
        $scope.msgBoxState = 0; // state greather or equal than 0 -> positive, state lower than 0 -> negative

        $scope.isLoading = false;
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
        $scope.categoryIdModel = -1;
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

        $scope.evaluate = function () {

            _this.isLoading = true;

            $timeout(function () {
                var correctNum = 0;
                _this.answerListByUser = [];
                var questionCategoryNum = 0;
                angular.forEach(_this.questionList, function (value, key) {
                    if (_this.selectedCategoryId === 0 || _this.selectedCategoryId === value.categoryId) {
                        questionCategoryNum = questionCategoryNum + 1;
                        if (value.answerByUser === value.answerCorrect)
                            correctNum = correctNum + 1;
                        else
                            _this.answerListByUser.push(angular.copy(value));
                    }
                })
                _this.resultPercent = (correctNum / questionCategoryNum) * 100;
                _this.hideResults(true);
                _this.log(_this.answerListByUser);
                _this.isLoading = false;

            }, 1000);

        }

        //todo
        var wait = function (calledFunc, time) {

            _this.isLoading = true;

            $timeout(function () {
                _this.createQuestion();
                _this.isLoading = false;
            }, 2000);

        };

        $scope.clear = function () {
            $scope.text = "clicked clear";
            angular.forEach(_this.questionList, function (value, key) {
                value.answerByUser = "";
            })
            _this.resultsVisibled = false;
            _this.answerListByUser = [];
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

            let count = 0;
            angular.forEach(_this.questionList, function (value) {
                if (value.categoryId === category.id) count += 1;
            });
            return count;
        }

        $scope.setImage = function (imgUrl) {
            _this.modalSettings = { imageUrl: imgUrl };
        };

        $scope.loadCategories = function () {

            $http.get($scope.URL_REST_API_CATEGORY).then(
                function successCallback(response) {
                    $scope.categoryList = [];
                    _this.log('Categories loaded');
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
                    _this.msgBoxHeader = _this.MSG_SUCCESS_GENERAL;
                    _this.msgBoxContent = "Question added";
                    _this.msgBoxState = 0;
                    $('.bd-example-modal-sm').modal('show');
                },
                function errorCallback(response) {
                    _this.log("not added");
                    _this.errorText = "Question not added";
                    _this.msgBoxHeader = _this.MSG_ERROR_GENERAL;
                    _this.msgBoxContent = "No details";
                    _this.msgBoxState = -1;
                    $('.bd-example-modal-sm').modal('show');
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

                        _this.isLoading = true;
                        $timeout(function () {
                            _this.createQuestion();
                            _this.isLoading = false;
                        }, 1000);
                    }
                }
            }

        }

        // MAIN 
        console.log("MAIN BEGIN");

        _this.isLoading = true;
        $timeout(function () {
            _this.loadCategories();
            _this.loadQuestions();
            _this.isLoading = false;
        }, 1000);

        console.log("MAIN END");
    };

})(angular)