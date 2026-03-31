# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Gomoku (五子棋) game implementation with human vs AI mode, built with Python and Tkinter GUI library.

## Common Commands
- Run the game: `python gomoku.py`
- The game can also be launched by double-clicking the `gomoku.py` file if Python is associated with .py files.

## Architecture
The entire codebase is contained in a single file `gomoku.py`:

### Core Structure
- **Configuration constants**: Defined at the top of the file (board size, cell dimensions, colors, player identifiers)
- **GomokuGame class**: Main game class that handles all game logic and UI
  - UI components: Tkinter window, canvas for drawing the board, buttons, status labels
  - Game state: 2D array representing the board, game over flag, turn tracking
  - Core methods:
    - `draw_board()` / `draw_piece()`: Rendering functions
    - `on_click()`: Handle user input
    - `make_move()`: Place a piece on the board
    - `ai_move()`: AI turn logic
    - `get_best_move()`: AI move selection using position evaluation
    - `evaluate_position()` / `calculate_score()`: Position scoring system
    - `check_win()`: Win condition detection (5 consecutive pieces in any direction)
    - `restart_game()`: Reset game state

### AI Algorithm
The AI uses a heuristic scoring approach:
1. Considers only positions that have neighboring pieces within 2 cells
2. Evaluates each position by calculating both attack score (AI's potential) and defense score (blocking human player's potential)
3. Prioritizes winning moves and moves that block the human player from winning
4. Uses pattern-based scoring for different formations (five in a row, live four,冲四, live three, etc.)

### Game Flow
1. Human player goes first (black pieces)
2. Click on the board to place a piece
3. AI automatically makes a move after human player
4. Game ends when either player gets 5 consecutive pieces or the board is full