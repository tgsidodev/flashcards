/* app.js */
const RIGHT = 1;
const WRONG = -1;
const NEUTRAL = 0;

class App {
  constructor() {
    const menuElement = document.querySelector('#menu');
    this.menu = new MenuScreen(menuElement);

    const mainElement = document.querySelector('#main');
    this.flashcards = new FlashcardScreen(mainElement);

    const resultElement = document.querySelector('#results');
    this.results = new ResultsScreen(resultElement);

    // instance variables
    this.cards = [];
    this.cardSetName = null;
    this.previousRightScore = 0;
    this.currentRightScore = 0;
    this.previousWrongScore = 0;
    this.currentWrongScore = 0;
    this.cardIndex = 0;
    this.cardSetLength = null;
    this.accuracyMap = {};
    this.cardIndex = 0;
    this.isContinuingGame = false;
    this.isStartingOver = false;

    // methods:
    this.updateScore = this.updateScore.bind(this);
    this.updateAccuracyMap = this.updateAccuracyMap.bind(this);
    this.getNextCard = this.getNextCard.bind(this);
    this.startGame = this.startGame.bind(this);
    this.resetInstanceVariables = this.resetInstanceVariables.bind(this);
    this.getCardSetNameIndex = this.getCardSetNameIndex.bind(this);
    this.populateFlashCards = this.populateFlashCards.bind(this);

    // event listeners:
    this.onMenuSetButtonClicked = this.onMenuSetButtonClicked.bind(this);
    this.onScoreChange = this.onScoreChange.bind(this);
    this.onBackToMenuClicked = this.onBackToMenuClicked.bind(this);
    this.onStartOverClicked = this.onStartOverClicked.bind(this);
    this.onContinueClicked = this.onContinueClicked.bind(this);
    this.onNoMoreCards = this.onNoMoreCards.bind(this);

    document.addEventListener('scoreChange', this.onScoreChange);
    document.addEventListener('back-to-menu-button-clicked', this.onBackToMenuClicked);
    document.addEventListener('start-over-button-clicked', this.onStartOverClicked);
    document.addEventListener('continue-button-clicked', this.onContinueClicked);
    document.addEventListener('no-more-cards', this.onNoMoreCards);
    document.addEventListener('menu-set-button-clicked', this.onMenuSetButtonClicked);
  }

  populateFlashCards(cardSetNameIndex){
    const cardSet = FLASHCARD_DECKS[cardSetNameIndex];
    this.cardSetLength = cardSet.length;
    const flashcardContainer = document.querySelector('#flashcard-container');
    for(let word in cardSet.words){
        const card = new Flashcard(flashcardContainer, word, cardSet.words[word]);
        this.cards.push(card);
    }
  }

  getCardSetNameIndex(cardSetName){
    let cardSetNameIndex = null;
    for(let j = 0; j < FLASHCARD_DECKS.length; j++){
      if(FLASHCARD_DECKS[j].title === cardSetName){
        cardSetNameIndex = j;
        break;
      }
    }
    return cardSetNameIndex;
  }

  resetInstanceVariables(){
    this.cards = [];
    this.cardSetName = null;
    this.previousRightScore = 0;
    this.currentRightScore = 0;
    this.previousWrongScore = 0;
    this.currentWrongScore = 0;
    this.cardIndex = 0;
    this.cardSetLength = null;
    this.accuracyMap = {};
    this.cardIndex = 0;
    this.isContinuingGame = false;
    this.isStartingOver = false;
  }

  startGame(){
    if (this.isContinuingGame) {
      const currentRightScore = this.currentRightScore;
      // modified previously to only include cards got wrong
      const cards = this.cards;
      const cardSetName = this.cardSetName;
      this.resetInstanceVariables();
      this.cards = cards;
      this.cardSetName = cardSetName
      this.previousRightScore = currentRightScore;
    } else { //starting over or 1st game
      const cardSetName = this.cardSetName;
      this.resetInstanceVariables();
      this.cardSetName = cardSetName;
      let cardSetNameIndex = this.getCardSetNameIndex(this.cardSetName);
      this.populateFlashCards(cardSetNameIndex);
    }

    this.updateScore();
    this.flashcards.show();
    this.flashcards.loadNewCard(this.getNextCard());
  }

  updateScore(){
    this.flashcards.updateScoreStatus(this.currentRightScore,this.currentWrongScore);
    this.previousRightScore = this.currentRightScore;
    this.previousWrongScore = this.currentWrongScore;
  }

  updateAccuracyMap(cardWord,scoreIncrement){
    if(scoreIncrement === RIGHT){
      this.accuracyMap[cardWord] = true;
    } else if (scoreIncrement === WRONG) {
        this.accuracyMap[cardWord] = false;
    }
  }

  getNextCard(){
    if(this.cardIndex >= this.cards.length) {
      return null;
    }
    let newCard = this.cards[this.cardIndex]
    this.cardIndex++;
    return newCard;
  }

  // Event Listeners:
  onMenuSetButtonClicked(event){
    console.log("onMenuSetButtonClicked: " + event.detail.cardSetSelection + ' was clicked');
    this.cardSetName = event.detail.cardSetSelection;
    this.menu.hide();
    this.startGame();
  }

  onScoreChange(event){
    const scoreIncrement = event.detail.scoreIncrement;
    const isReleased = event.detail.isReleased;
    const cardWord = event.detail.word;

    if(scoreIncrement === RIGHT){
      this.flashcards.updateScoreStatus(this.previousRightScore + 1,this.previousWrongScore);
    } else if (scoreIncrement === WRONG) {
      this.flashcards.updateScoreStatus(this.previousRightScore,this.previousWrongScore + 1);
    } else if (scoreIncrement === NEUTRAL) {
      this.flashcards.updateScoreStatus(this.previousRightScore,this.previousWrongScore);
    }

    // score after card released
    if(isReleased){
      if(scoreIncrement === RIGHT){
        this.currentRightScore++;
        this.updateScore();
        this.flashcards.loadNewCard(this.getNextCard());
      } else if (scoreIncrement === WRONG) {
        this.currentWrongScore++;
        this.updateScore();
        this.flashcards.loadNewCard(this.getNextCard());
      } else if (scoreIncrement === NEUTRAL) {
        // player still needs to decide so do nothing here...
      }
      this.updateAccuracyMap(cardWord,scoreIncrement);
    }
  }

  onBackToMenuClicked(){
    console.log('back-to-menu-button-received');
    this.results.hide();
    this.menu.show();
  }

  onStartOverClicked(){
    console.log('start-over-button-received');
    this.results.hide();
    this.isStartingOver = true;
    this.startGame();
  }

  onContinueClicked(){
    console.log('continue-button-received');
    this.results.hide();
    this.isContinuingGame = true;

    let newCardArray = [];
    let counter = 0;
    for (var i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      if(this.accuracyMap[card.word] === false){
        const flashcardContainer = document.querySelector('#flashcard-container');
        newCardArray.push(new Flashcard(flashcardContainer, card.word, card.definition))
      }
    }
    this.cards = newCardArray;

    this.startGame();
  }

  onNoMoreCards(){
    console.log('no more cards left!!!');
    this.flashcards.hide();
    this.results.show(this.currentRightScore,this.currentWrongScore);
  }

}
