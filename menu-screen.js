class MenuScreen {
  constructor(containerElement) {
    this.containerElement = containerElement;
    this.onCardSetSelection = this.onCardSetSelection.bind(this);

    // div to be populated with names of card sets
    const choices = document.querySelector('#choices');

    // populates divs with names of card sets
    for (let key in FLASHCARD_DECKS) {
      const flashCardSet = FLASHCARD_DECKS[key];
      const title = flashCardSet.title;
      const newDiv = document.createElement('div');
      newDiv.addEventListener('click', this.onCardSetSelection);
      newDiv.textContent = title;
      choices.appendChild(newDiv);
    }
  }

  show() {
    this.containerElement.classList.remove('inactive');
  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

  onCardSetSelection(event){

    const setSelection = event.currentTarget;
    console.log('choice of flash cards: ' + setSelection.textContent);

    // Send card set selection back to app class
    const eventInfo = {
          cardSetSelection: setSelection.textContent
    };
    document.dispatchEvent(new CustomEvent('menu-set-button-clicked', { detail: eventInfo }));

  }
}
