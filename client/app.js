(function() {
    var app = angular.module("multimaze", []);


    // If this directive is added to an input, said input only becomes valid if the length is equal to zero or at least three characters
    app.directive('roomValidation', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attr, mCtrl) {
                function myValidation(value) {
                    if (value.length == 0 || value.length >= 3) {
                        mCtrl.$setValidity('length', true);
                    } else {
                        mCtrl.$setValidity('length', false);
                    }
                    return value;
                }
                mCtrl.$parsers.push(myValidation);
            }
        };
    });

    app.directive('inputRestricted', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attr, ngModelCtrl) {
                var pattern = /[^0-9A-Za-z_-]*/g;

                function fromUser(text) {
                    if (!text)
                        return text;

                    var transformedInput = text.replace(pattern, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }

                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });

    app.controller("customRoomController", function() {
        this.request = { diff:"easy" }; // Initializes our difficulty as medium

        this.join = function() {
            if (this.request.username === '' || typeof this.request.username === 'undefined') {
                this.request.username = "Usuario";
            }

            $("#ui").hide();
            $("#loader").show();
            
            username = this.request.username;
            socket.emit('ready', this.request, function(resp) {
                if (resp === "full") {
                    alert("that room is full!");
                    $("#ui").show();
                    $("#loader").hide();
                } else if (resp === "ok") {
                    $("#overlay").hide();
                    $("#waiting").show();
                } else {
                    console.error("Malformed acknowledgement of room!");
                    console.error("Response: " + resp);
                }
            });
        };
    });

    app.controller("chatController", function() {
        this.msg = "";

        this.sendMessage = function() {
            var data = {user: username, msg: this.msg};

            socket.emit('chatMsg', data);
            this.msg = "";
            updateScroll();
        };
    });
})();
