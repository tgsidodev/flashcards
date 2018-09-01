/* flashcard.js */
class Flashcard {
  constructor(containerElement, frontText, backText) {
    this.containerElement = containerElement;
    this.word = frontText;
    this.definition = backText;
    this.flashcardElement = this._createFlashcardDOM(this.word,this.definition);
    this.originX = null;
    this.originY = null;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dragStarted = false;

    // methods:
    this._flipCard = this._flipCard.bind(this);
    this.show = this.show.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.changeScore = this.changeScore.bind(this);

    // event listerner registration
    this.flashcardElement.addEventListener('pointerdown', this.onDragStart);
    this.flashcardElement.addEventListener('pointerup', this.onDragEnd);
    this.flashcardElement.addEventListener('pointermove', this.onDragMove);
    this.flashcardElement.addEventListener('click', this._flipCard);
  }

  show(){
    this.containerElement.append(this.flashcardElement);
    this.card = document.querySelector('.flashcard-box .word');
    // adds fade up animation to word part of card
    this.card.classList.add('fade-up');

    this.flashcardElement.style.transform = 'translate(' +
      0+ 'px, ' + 0 + 'px)' + 'rotate(' +
        0 + 'deg)';
  }

  // Creates the DOM object representing a flashcard with the given
  // |frontText| and |backText| strings to display on the front and
  // back of the card. Returns a reference to root of this DOM
  // snippet. Does not attach this to the page.
  //
  // More specifically, this creates the following HTML snippet in JS
  // as a DOM object:
  // <div class="flashcard-box show-word">
  //   <div class="flashcard word">frontText</div>
  //   <div class="flashcard definition">backText</div>
  // </div>
  // and returns a reference to the root of that snippet, i.e. the
  // <div class="flashcard-box">
  _createFlashcardDOM(frontText, backText) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('flashcard-box');
    cardContainer.classList.add('show-word');

    const wordSide = document.createElement('div');
    wordSide.classList.add('flashcard');
    wordSide.classList.add('word');
    wordSide.classList.add('fade-up');
    wordSide.textContent = frontText;

    const definitionSide = document.createElement('div');
    definitionSide.classList.add('flashcard');
    definitionSide.classList.add('definition');
    definitionSide.textContent= backText;

    cardContainer.appendChild(wordSide);
    cardContainer.appendChild(definitionSide);
    return cardContainer;
  }

  _flipCard(event) {
    this.flashcardElement.classList.toggle('show-word');
  }

  onDragStart(event) {
    this.originX = event.clientX;
    this.originY = event.clientY;
    this.dragStarted = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    this.flashcardElement.style.transition = '0s';
    event.currentTarget.style.transform = 'translate(' +
      0+ 'px, ' + 0 + 'px)' + 'rotate(' +
        0 + 'deg)';
  }

  onDragMove(event) {
    if (!this.dragStarted) {
      return;
    }
    event.preventDefault();
    const deltaX = event.clientX - this.originX;
    const deltaY = event.clientY - this.originY;
    const translateX = this.offsetX + deltaX;
    const translateY = this.offsetY + deltaY;
    const distanceFromOriginX = deltaX;
    const rotationDegrees = .2 * deltaX;


    event.currentTarget.style.transform = 'translate(' +
      translateX + 'px, ' + translateY + 'px)' + 'rotate(' +
        rotationDegrees + 'deg)';

    const body = document.querySelector('body');
    if(distanceFromOriginX >= 150){ // right
      body.style.backgroundColor = '#97b7b7';
      this.changeScore(1,false);

    } else if (distanceFromOriginX <= -150) { // left
      body.style.backgroundColor = '#97b7b7';
      this.changeScore(-1,false);
    } else { // neutral
      body.style.backgroundColor = '#d0e6df';
      this.changeScore(0,false);
    }

  }

  onDragEnd(event) {
    const body = document.querySelector('body');
    body.style.backgroundColor = '#d0e6df';

    this.dragStarted = false;
    this.offsetX += event.clientX - this.originX;
    this.offsetY += event.clientY - this.originY;

    const distanceFromOriginX = event.clientX - this.originX;
    if(distanceFromOriginX >= 150){ // right
      console.log('released right');
      this.flashcardElement.remove();
      this.changeScore(1,true);
    } else if (distanceFromOriginX <= -150) { // left
      console.log('released left');
      this.flashcardElement.remove();
      this.changeScore(-1,true);
    } else { // neutral
      console.log('released in middle');
      this.flashcardElement.style.transition = '.6s';
      event.currentTarget.style.transform = 'translate(' +
        0+ 'px, ' + 0 + 'px)' + 'rotate(' +
          0 + 'deg)';
      this.originX = null;
      this.originY = null;
      this.offsetX = 0;
      this.offsetY = 0;
      this.changeScore(0,true);
    }

  }

  /* Send +1/-1/0 to change score back to app class */
  changeScore(number, isReleased){
    const eventInfo = {
          scoreIncrement: number,
          isReleased: isReleased,
          word: this.word
    };
    document.dispatchEvent(new CustomEvent('scoreChange', { detail: eventInfo }));
  }

}
