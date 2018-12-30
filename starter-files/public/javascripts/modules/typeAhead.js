import axios from 'axios';

function searchResultsHTML(stores) {
  return stores
    .map(
      store => `
      <a href="/store/${store.slug}" class="search__result">
        <strong>${store.name}</strong>
      </a>`
    )
    .join('');
}

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('.search__input');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function() {
    if (!this.value) {
      searchResults.style.display = 'none';
    }

    searchResults.style.display = 'block';
    searchResults.innerHTML = '';

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          searchResults.innerHTML = searchResultsHTML(res.data);
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

  // handle keyboard inputs
  searchInput.on('keyup', e => {
    if (![38, 40, 13].includes(e.keyCode)) {
      return;
    }
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;

    if (e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0];
    }
    if (e.keyCode === 40 && !current) {
      [next] = items;
    }
    if (e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1];
    }
    if (e.keyCode === 38 && !current) {
      next = items[items.length - 1];
    }
    if (current && e.keyCode === 13 && current.href) {
      window.location = current.href;
      return;
    }
    if (current) {
      current.classList.remove(activeClass);
    }
    if (next) {
      next.classList.add(activeClass);
    }
  });
}

export default typeAhead;
