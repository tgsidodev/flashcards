/* results-screen.js */
class ResultsScreen {
  constructor(containerElement) {
    this.containerElement = containerElement;
    this.onBackToMenu = this.onBackToMenu.bind(this);
    this.onStartOver = this.onStartOver.bind(this);
    this.onContinue = this.onContinue.bind(this);
  }

  onBackToMenu(event){
    console.log('onBackToMenu clicked' );
    const eventInfo = {
          info: 'none_rn'
    };
    document.dispatchEvent(new CustomEvent('back-to-menu-button-clicked', { detail: eventInfo }));
  }

  onStartOver(event){
    console.log('onStartOver clicked' );
    const eventInfo = {
          info: 'none_rn'
    };
    document.dispatchEvent(new CustomEvent('start-over-button-clicked', { detail: eventInfo }));
  }

  onContinue(event){
    console.log('onContinue clicked' );
    const eventInfo = {
          info: 'none_rn'
    };
    document.dispatchEvent(new CustomEvent('continue-button-clicked', { detail: eventInfo }));
  }

  show(numberCorrect, numberWrong) {
    this.containerElement.classList.remove('inactive');

    const percentDiv = document.querySelector('#results .percent');
    const rightDiv = document.querySelector('#results .correct');
    const wrongDiv = document.querySelector('#results .incorrect');

    const percentage = Math.ceil((numberCorrect/(numberCorrect + numberWrong)) * 100);
    percentDiv.textContent = percentage;
    rightDiv.textContent = numberCorrect + ' ';
    wrongDiv.textContent = numberWrong + ' ';

    const backToMenuButton = document.querySelector('#results .to-menu');
    backToMenuButton.addEventListener('click', this.onBackToMenu);

    if(percentage === 100){ // startOver option if all cards correct
      const startOverButton = document.querySelector('#results .continue');
      startOverButton.textContent = "Start over?";
      startOverButton.removeEventListener('click', this.onContinue);
      startOverButton.addEventListener('click', this.onStartOver);
    } else { // continue option if some cards answered incorrectly
      const continueButton = document.querySelector('#results .continue');
      continueButton.textContent = "Continue";
      continueButton.removeEventListener('click', this.onStartOver);
      continueButton.addEventListener('click', this.onContinue);
    }

  }

  hide() {
    this.containerElement.classList.add('inactive');
  }

}
