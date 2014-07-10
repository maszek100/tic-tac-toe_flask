angular.module('tictactoe', ['ngRoute'])

.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        controller: 'TicCtrl',
    })
    .otherwise({
        redirectTo: '/'
    });
})

/** single controller to control app **/
.controller('TicCtrl', function($scope, $http) {
    var audio_on = true; // audio on when page refreshed
    $scope.audio_icon = 'glyphicon glyphicon-volume-up';

    /** callback to reset the game state **/
    $scope.reset = function() {
        $scope.show_ai_first = true;
        $scope.thinking      = false;
        $scope.error         = false;
        $scope.game_over     = false;
        $scope.quote = {
            'text'  : 'Click on the board to start!',
            'by'    : 'AI Awesome ',
            'audio' : 'dk-start.mp3'
        };
        $scope.board = ['','','','','','','','',''];
        if (audio_on) playAudio($scope.quote.audio);
    };

    /** toggles audio on and off **/
    $scope.toggle_audio = function() {
        audio_on = !audio_on;
        if (audio_on) $scope.audio_icon = 'glyphicon glyphicon-volume-up';
        else {
            pauseAudio();
            $scope.audio_icon = 'glyphicon glyphicon-volume-off';
        }
    };

    /** handles user and computer move **/
    $scope.move = function(pos) {
        $scope.show_ai_first = false;

        // Check if space is already filled, game is over or computer is thinking
        if (pos && ($scope.board[pos] || $scope.game_over || $scope.thinking)) {
            return;
        }
        else {
            $scope.thinking = true;
            if (pos !== undefined) $scope.board[pos] = 'O'; // set user move

            // send ajax request to get the computer's move
            // expected response: {move: int, result: (0=>cont,1=>win,(0, move = -1)=>draw)
            $http.post('/move', {'board':$scope.board})
            .success(function(data, status, headers, config) {
                if(data.move != -1) $scope.board[data.move] = 'X';
                board_state = 'move';
                if (data.state == 1) { // win
                    $scope.game_over = true;
                    $scope.result    = 'Computer Wins!';
                    board_state      = 'win';
                } else if (data.state === 0 && data.move == -1) { // draw
                    $scope.game_over = true;
                    $scope.result    = 'Draw?!?! Let\'s go again';
                    board_state      = 'draw';
                } // else continue

                // Get random clip (quote) based on board state
                if (pos) {
                    max_num = audio_clips[board_state].length;
                    ran     = Math.floor(Math.random() * max_num);
                    q       = audio_clips[board_state][ran];
                    if (!audio_on) q.audio = false;
                    $scope.quote = q;
                    playAudio(q.audio);
                }
                $scope.thinking = false;
            })
            .error(function(data, status, headers, config) {
                $scope.error = true;
            });
        }
    };

    // reset game board on page refresh and make first computer move
    $scope.reset();

    // audio clips we can use while playing depending on the board state
    audio_clips = {
        'move' : [
            {
                'text'  : 'It\'s time to kick ass and chew bubble gum... and I\'m all outta gum.',
                'by'    : 'Duke Nukem - Duke Nukem 3D, 1996',
                'audio' : 'all-out-of-gum.mp3'
            },
            {
                'text'  : 'I eat Green Berets for breakfast. And right now, I\'m very hungry!',
                'by'    : 'John Matrix - Commando, 1985',
                'audio' : 'eat-green-berets.mp3'
            },
            {
                'text'  : 'Hey laser lips you\'re momma was a snowblower!',
                'by'    : 'Number 5 - Short Circuit, 1986',
                'audio' : 'laser-lips.mp3'
            },
            {
                'text'  : 'Your mother was a hamster and your father smelt of elderberries.',
                'by'    : 'French Soldier - Monty Python and the Holy Grail, 1975',
                'audio' : 'hamster.wav'
            },
            {
                'text'  : 'Hey! Where did you get those clothes... at the... toilet store?',
                'by'    : 'Brick Tamland - Anchorman: The Legend of Ron Burgundy, 2004',
                'audio' : 'toilet.mp3'
            }
        ],
        'win' : [
            {
                'text'  : 'Is that all you\'ve got!',
                'by'    : 'Medal Honor Allied Assault, 2002',
                'audio' : 'is-that-all-you-got.mp3'
            },
            {
                'text'  : 'Hasta la vista, baby!',
                'by'    : 'The Terminator - Terminator 2: Judgement Day, 1991',
                'audio' : 'hastalavistababy.wav'
            }
        ],
        'draw' : [
            {
                'text'  : 'Ohh! Great Odin\'s raven!',
                'by'    : 'Ron Burgundy - Anchorman: The Legend of Ron Burgundy, 2004',
                'audio' : 'raven.mp3'
            },
            {
                'text'  : '60% of the time, it works... everytime.',
                'by'    : 'Brian Fantana - Anchorman: The Legend of Ron Burgundy, 2004',
                'audio' : '60-percent.mp3'
            }
        ]
    };
});