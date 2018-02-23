let question = []
let game = {}

$.get('questions.json', function (data) {
  question = data
})

function startGame (numberOfQuestion) {
  game = new Game(numberOfQuestion)
  nextQuestion()
  $('div.page#start').toggleClass('active')
  $('div.page#game').toggleClass('active')
}

function answer (choice) {
  let correct = game.answer(choice)

  if (correct) {
    alert('Correct')
  } else {
    alert('Incorrect')
  }

  $('.score').html(game.score)
  nextQuestion()
}

function nextQuestion () {
  question = game.nextQuestion()

  if (!question) {
    endGame()
  } else {
    $('#question').html(game.count + '. ' + question.question)
    $('#choice:1').html(question.answers[0])
    $('#choice:2').html(question.answers[1])
    $('#choice:3').html(question.answers[2])
    $('#choice:4').html(question.answers[3])
  }
}

function endGame () {
  $('div.page#end').toggleClass('active')
  $('div.page#game').toggleClass('active')
}

function restartGame () {
  $('div.page#end').toggleClass('active')
  $('div.page#start').toggleClass('active')
}

function randomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function Game (numQuestion) {
  this.numQuestion = numQuestion
  this.question = Array.from(question)
  this.count = 0
  this.score = 0
}

Game.prototype.nextQuestion = function () {
  if (this.numQuestion <= 0) return null

  let random = randomInt(this.numQuestion--)
  this.currentQuestion = this.question[random]

  this.question.splice(random, 1)
  this.count++

  return this.currentQuestion
}

Game.prototype.answer = function (choice) {
  let correct = this.currentQuestion.correctChoice == choice

  if (correct) {
    this.score++
  }

  return correct
}


