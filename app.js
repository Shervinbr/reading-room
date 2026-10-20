const books = window.READING_BOOKS;
const row = document.querySelector('#books');
const layoutStyles = document.createElement('link');
layoutStyles.rel = 'stylesheet';
layoutStyles.href = 'shelf-layout.css?v=2';
document.head.append(layoutStyles);
row.classList.add('mixed-shelves');
const shelfGroups = [];
const bookButtons = [];
function arrangeShelves() {
const perShelf = row.clientWidth >= 800 ? 12 : row.clientWidth >= 620 ? 9 : 7;
shelfGroups.length = 0;
row.replaceChildren();
// Balance the final shelf rather than leaving only one or two books on it.
const shelfCount = Math.ceil(books.length / perShelf);
const capacity = shelfCount ? Math.ceil(books.length / shelfCount) : perShelf;
for (let start = 0; start < books.length; start += capacity) {
  const shelf = document.createElement('div');
  shelf.className = 'mixed-shelf';
  shelf.setAttribute('role', 'group');
  shelf.setAttribute('aria-label', `Shelf ${shelfGroups.length + 1}`);
  const standing = document.createElement('div'); standing.className = 'standing-group';
  const pile = document.createElement('div'); pile.className = 'pile-group';
  const perched = document.createElement('div'); perched.className = 'perched-group';
  const stacked = document.createElement('div'); stacked.className = 'stacked-group';
  pile.append(perched, stacked);
  shelf.append(standing, pile);
  row.append(shelf);
  shelfGroups.push({ standing, perched, stacked });
}
bookButtons.forEach((button, index) => {
  const position = index % capacity;
  const count = Math.min(capacity, books.length - Math.floor(index / capacity) * capacity);
  const standingCount = Math.max(0, count - 4);
  const horizontal = position >= standingCount && position < standingCount + Math.min(2, count);
  const shelfGroup = shelfGroups[Math.floor(index / capacity)];
  button.classList.remove('horizontal-book', 'upright-book');
  button.classList.add(horizontal ? 'horizontal-book' : 'upright-book');
  button.style.setProperty('--lean', `${position === standingCount - 1 ? -3 : position === count - 1 ? 3 : 0}deg`);
  (horizontal ? shelfGroup.stacked : position >= standingCount ? shelfGroup.perched : shelfGroup.standing).append(button);
});
}
const dialog = document.querySelector('#detail');
let activeBook;
function coverContent(book) {
  const cover = document.createElement('div');
  cover.className = 'cover-design';
  cover.style.setProperty('--book-color', book.color);
  cover.style.setProperty('--book-ink', book.ink);
  if (book.cover) {
    const img = document.createElement('img');
    img.src = book.cover;
    img.alt = `${book.title} cover`;
    cover.append(img);
  } else {
    const genre = document.createElement('span'); genre.className = 'cover-genre'; genre.textContent = book.genre || 'THE READING ROOM';
    const title = document.createElement('strong'); title.textContent = book.title;
    const orbit = document.createElement('div'); orbit.className = 'orbits'; orbit.setAttribute('aria-hidden', 'true');
    const author = document.createElement('span'); author.className = 'cover-author'; author.textContent = book.author;
    cover.append(genre, title, orbit, author);
  }
  return cover;
}
books.forEach((book, index) => {
  const button = document.createElement('button');
  button.className = 'book';
  button.style.setProperty('--height', `${224 + (index * 17) % 39}px`);
  button.style.setProperty('--offset', `${index % 2 ? 9 : 0}px`);
  button.style.setProperty('--book-color', book.color);
  button.style.setProperty('--book-ink', book.ink);
  const rated = typeof book.rating === 'number' && book.rating > 0 && book.rating <= 5;
  button.setAttribute('aria-label', `Read my review of ${book.title} by ${book.author}, ${rated ? `${book.rating} out of 5 stars` : 'not rated'}`);
  const spine = document.createElement('span'); spine.className = 'spine';
  const number = document.createElement('span'); number.className = 'spine-number'; number.textContent = String(index + 1).padStart(2, '0');
  const title = document.createElement('strong'); title.textContent = book.title;
  const author = document.createElement('span'); author.className = 'spine-author'; author.textContent = book.author;
  const mark = document.createElement('span'); mark.className = 'spine-mark'; mark.textContent = '✳';
  spine.append(number, title, author, mark);
  const front = document.createElement('span'); front.className = 'book-front'; front.append(coverContent(book));
  button.append(spine, front);
  button.addEventListener('click', () => {
    activeBook = button;
    button.classList.add('selected');
    document.querySelector('#review-title').textContent = book.title;
    document.querySelector('#review-author').textContent = `by ${book.author}`;
    document.querySelector('#rating-text').textContent = rated ? `${book.rating} / 5` : 'Not rated';
    document.querySelector('#stars').textContent = rated ? '★'.repeat(Math.floor(book.rating)) + (book.rating % 1 ? '◐' : '') + '☆'.repeat(5 - Math.ceil(book.rating)) : '';
    document.querySelector('#review-text').textContent = book.review || 'No review yet.';
    document.querySelector('#detail-art').replaceChildren(coverContent(book));
    dialog.showModal();
  });
  bookButtons.push(button);
});
arrangeShelves();
let previousWidth = row.clientWidth;
if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => {
  if (row.clientWidth !== previousWidth) {
    previousWidth = row.clientWidth;
    arrangeShelves();
    if (dialog.open) document.querySelector('.close').focus();
  }
}).observe(row);
document.querySelector('#count').textContent = `${String(books.length).padStart(2, '0')} ${books.length === 1 ? 'BOOK' : 'BOOKS'} READ`;
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { activeBook?.classList.remove('selected'); activeBook?.focus(); });

