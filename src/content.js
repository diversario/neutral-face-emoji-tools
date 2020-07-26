import './styles/content.css';

import App from './components/app.svelte';

const ELEMENT_TO_INSERT_BEFORE_SELECTOR = '.p-customize_emoji_wrapper__container';

// document.querySelectorAll(`div.p-customize_emoji_list__row`).forEach(e => e.addEventListener('click', (t) => { t.target.style.backgroundColor = 'pink' }))

function elementIsReady (selector) {
  return new Promise((resolve) => {
    function checkForElement () {
      const element = document.querySelector(selector);

      if (element) {
        resolve(element);
      } else {
        setTimeout(checkForElement, 1000);
      }
    }

    checkForElement();
  });
}

elementIsReady(ELEMENT_TO_INSERT_BEFORE_SELECTOR).then((element) => {
  const containerDiv = document.createElement('div');

  element.before(containerDiv);
  new App({
    target: containerDiv
  });
});
