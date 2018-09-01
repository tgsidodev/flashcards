/* flashcard-screen.js */
class FlashcardScreen {
  constructor(containerElement) {
    this.containerElement = containerElement;
    this.currentCard = null;
    this.cardSetName = null;
  }

  show() {
    this.containerElement.classList.remove('inactive');
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

  updateScoreStatus(rightScore,wrongScore){
    const rightDiv = document.querySelector('#main .status .correct');
    const wrongDiv = document.querySelector('#main .status .incorrect');
    rightDiv.textContent = rightScore + ' ';
    wrongDiv.textContent = wrongScore + ' ';
  }

  loadNewCard(card){
    if(card === null || card === undefined){
      const eventInfo = {
            cardSetSelection: "nothing"
      };
      document.dispatchEvent(new CustomEvent('no-more-cards', { detail: eventInfo }));
    } else {
        card.show();
    }
  }
}
