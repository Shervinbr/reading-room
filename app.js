const books = window.READING_BOOKS;
const row = document.querySelector('#books');
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
  row.append(button);
});
// Quiet decorative volumes balance the shelf without inventing reading history.
const space = document.createElement('div'); space.className = 'future-books'; space.setAttribute('aria-hidden', 'true');
space.innerHTML = '<i></i><i></i><i></i><span>Room for the next chapter.</span>';
row.append(space);
document.querySelector('#count').textContent = `${String(books.length).padStart(2, '0')} ${books.length === 1 ? 'BOOK' : 'BOOKS'} READ`;
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => { activeBook?.classList.remove('selected'); activeBook?.focus(); });
