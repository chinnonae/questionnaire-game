let question = []
let game = {}
const TIME = 10000
const SECOND = 1000
const DECAY = 100
const EXTRA_TIME = 2000
let ticker = null
let timer = TIME + EXTRA_TIME

$.get('questions.json', function (data) {
  question = data
  console.log(question)
})

function startTicker() {
  timer = TIME + EXTRA_TIME

  ticker = setInterval(function () {
    if (timer <= 0) {
      timeOut()
    }
    timer -= DECAY
    progress = timer / TIME * 100
    progressPercent = timer > TIME ? 100 : progress
    $('.progress-bar-value').css("width", progressPercent + '%')  
  }, DECAY)
}

function timeOut() {
  nextQuestion()
}

function startGame (numberOfQuestion) {
  game = new Game(numberOfQuestion)
  nextQuestion()
  $('div.page#start').toggleClass('active')
  $('div.page#game').toggleClass('active')
  $('.score-value').html('0')
}

function answer (choice) {
  clearInterval(ticker)

  let correct = game.answer(choice)

  let choiceNode = $('#choice\\:' + choice)
  let background = '#F44336'
  if (correct) {
    let score = timer > TIME ? 10 : Math.ceil(timer / SECOND)
    game.score += score
    $('.score-value').html(game.score)

    background = '#C6FF00'
  } else {
    background = '#F44336'
  }

  choiceNode.animate(
    {
    'background-color': background
    }, 
    1000,
    'easeInBounce',
    function() {
      setTimeout(function () {
        choiceNode.css('background-color', '')
        nextQuestion()
      }, 2000) 
    }
  )
}

function nextQuestion () {
  clearInterval(ticker)
  let question = game.nextQuestion()

  if (!question) {
    endGame()
  } else {
    $('#question').html(question.question)
    $('#choice\\:0').html(question.answers[0])
    $('#choice\\:1').html(question.answers[1])
    $('#choice\\:2').html(question.answers[2])
    $('#choice\\:3').html(question.answers[3])
    startTicker()
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
  this.question = question.slice()
  this.count = 0
  this.score = 0
}

Game.prototype.nextQuestion = function () {
  if (this.numQuestion <= 0) return null

  this.numQuestion -= 1
  let random = randomInt(this.question.length)
  this.currentQuestion = this.question[random]

  this.question.splice(random, 1)
  this.count++

  return this.currentQuestion
}

Game.prototype.answer = function (choice) {
  let correct = this.currentQuestion.correctChoice == choice

  return correct
}
