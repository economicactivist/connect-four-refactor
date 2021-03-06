/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class ConnectFour {
  constructor(p1, p2, width = 7, height = 6) {
    this.width = width
    this.height = height
    this.players = [p1, p2]
    this.currPlayer = p1
    this.board = []
  }

  startGame = () => {
    this.makeBoard()
    this.makeHtmlBoard()
  }

  resetGame = () => {
    const boardToEmpty = document.querySelector('#board')
    while (boardToEmpty.firstChild) {
      boardToEmpty.removeChild(boardToEmpty.firstChild)
    }

    this.board = []
  }

  makeBoard = () => {
    // const makeRows = new Array(WIDTH).fill(null)  [ended up being a bad idea]

    for (let i = 0; i < this.height; i++) {
      // TODO: set "board" to empty HEIGHT x WIDTH matrix array
      this.board.push(Array.from({ length: this.width }))
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard = () => {
    const htmlBoard = document.querySelector('#board')
    const top = document.createElement('tr')
    top.setAttribute('id', 'column-top')
    top.addEventListener('click', this.handleClick)

    for (let x = 0; x < this.width; x++) {
      let headCell = document.createElement('td')
      headCell.setAttribute('id', x)
      top.append(headCell)
    }
    htmlBoard.append(top)

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr')
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td')
        cell.setAttribute('id', `${y}-${x}`)
        row.append(cell)
      }
      htmlBoard.append(row)
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol = x => {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y
      }
    }
    return null
  }

  placeInTable = (y, x) => {
    let id = `${y}-${x}`
    const cellToFill = document.getElementById(id)
    const newPiece = document.createElement('div')
    newPiece.classList.add('piece')
    newPiece.style.backgroundColor = this.currPlayer.color
    cellToFill.append(newPiece)
  }
  endGame = msg => {
    alert(msg)
    this.resetGame()
  }

  handleClick = evt => {
    let x = +evt.target.id
    let y = this.findSpotForCol(x)
    if (y === null) {
      return
    }

    this.board[y][x] = this.currPlayer

    this.placeInTable(y, x)

    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`)
    }

    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!')
    }

    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0]
  }

  checkForWin = () => {
    const _win = cells => {
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      )
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ]
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ]
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ]
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ]

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true
        }
      }
    }
  }
}

class Player {
  constructor(color) {
    this.color = color
  }
}

const startBtn = document.querySelector('#start')
startBtn.addEventListener('click', () => {
  let p1 = new Player(document.getElementById('p1-color').value)
  let p2 = new Player(document.getElementById('p2-color').value)
  let connectFourGame = new ConnectFour(p1, p2)
 
  connectFourGame.startGame()
})
