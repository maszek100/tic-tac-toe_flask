class Board(object):
    """ Class that represents a tictactoe board
    :author Jordan Limbach <limbachjordan@gmail.com> """

    winning_combos = (
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    )

    def __init__(self, marks=[]):
        """ Initializes a board object
        :author Jordan Limbach <limbachjordan@gmail.com>
        :param marks {list} - Marks on the tictactoe board """
        self.board = ['' for i in range(0,9)] if len(marks) == 0 else marks

    def available_spaces(self):
        """ Returns the list of available moves on the board
        :author Jordan Limbach <limbachjordan@gmail.com>
        :return List of available moves """
        # k will be numeric index, v is the value in that index
        return [k for k, v in enumerate(self.board) if v is '']

    def game_complete(self):
        """ Determines if the game is over
        :author Jordan Limbach <limbachjordan@gmail.com>
        :return True if game is complete, False otherwise """
        # A winner exists
        if self.winner() != None:
            return True
        # No open spaces left
        if '' not in [v for v in self.board]:
            return True
        return False

    def is_open(self, square):
        """ Checks if a spot on the board is open
        :param square {int} - Spot on the board
        :return True if open, False otherwise """
        return self.board[square] == ''

    def move(self, square, player='X'):
        """ Makes a move on the board
        :author Jordan Limbach <limbachjordan@gmail.com>
        :param square - Spot on the board
        :param player {str} - Letter to make move with """
        self.board[square] = player
    
    def is_draw(self):
        """ Determines if the game is a draw
        :author Jordan Limbach <limbachjordan@gmail.com>
        :return True if game is a tie, False otherwise """
        # Game is over and there is no winner
        return self.game_complete() == True and self.winner() is None

    def get_players_moves(self, player='X'):
        """ Gets a players current moves
        :author Jordan Limbach <limbachjordan@gmail.com>
        :param player {str} - Letter to make move with """
        return [k for k, v in enumerate(self.board) if v == player]

    def winner(self):
        """ Checks if there is a winner on the board
        :author Jordan Limbach <limbachjordan@gmail.com>
        : return 'X' or 'O' if a player won, otherwise None """
        for player in ('X', 'O'):
            moves = self.get_players_moves(player)
            for combo in self.winning_combos:
                win = True
                for m in combo:
                    if m not in moves:
                        win = False
                if win:
                    return player
        return None

    def get_opponent(self, player):
        """ Returns opponent of player
        :param player {str} X or O
        :return Player's opponent """
        return 'X' if player == 'O' else 'O'

    def minimax(self, player):
        """ Minimax algorithm for getting the next best move
        for the computer
        :param player {str} X or O
        :return Game state, spot on the board that is the best next move """
        if len(set(self.board)) == 1: return 0,4
 
        opponent = self.get_opponent(player)
    
        winner = self.winner()
        if winner is not None:
            if winner == 'X':
                return 1,-1  # state of 1 is a winning position for X
            else: 
                return -1,-1  # state of -1 is a losing position for X

        if self.is_draw():  # state of 0 indicates draw
            return 0,-1

        result_list = []
        moves = self.available_spaces() 
        for move in moves:  # Check each open moves
            self.move(move, player)
            ret, mm_move = self.minimax(opponent)
            result_list.append(ret)
            self.move(move, '')

        if player == 'X':
            maxele = max(result_list)
            return maxele,moves[result_list.index(maxele)]
        else:
            minele = min(result_list)
            return minele,moves[result_list.index(minele)]