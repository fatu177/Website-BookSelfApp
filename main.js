books = [];
RENDER_EVENT = 'render-book';
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem('books')) {
        books = JSON.parse(localStorage.getItem('books'));
        books.forEach(book => splitbooks(book))
    }
    const submitForm = document.getElementById("bookForm");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
        localStorage.setItem('books', JSON.stringify(books));
    });
    const searchBook = document.getElementById('searchBook');
    searchBook.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBookData();
    });
});

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);

});

function addBook() {
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = Number(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    const id = generateID();
    const bookItem = generateBook(id, title, author, year, isComplete);
    books.push(bookItem);
    splitbooks(bookItem);

    document.dispatchEvent(new CustomEvent(RENDER_EVENT));
}

function generateID() {
    return new Date().getTime();
}

function generateBook(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function splitbooks(book) {
    const div = document.createElement('div');
    div.setAttribute('data-bookid', book.id);
    div.setAttribute('data-testid', 'bookItem');
    const h3 = document.createElement('h3');
    h3.setAttribute('data-testid', 'bookItemTitle');
    h3.innerText = book.title;
    const p = document.createElement('p');
    p.setAttribute('data-testid', 'bookItemAuthor');
    p.innerText = `Penulis: ${book.author}`;
    const p2 = document.createElement('p');
    p2.setAttribute('data-testid', 'bookItemYear');
    p2.innerText = `Tahun: ${book.year}`;
    const div2 = document.createElement('div');
    const button = document.createElement('button');
    button.setAttribute('data-testid', 'bookItemIsCompleteButton');
    const button2 = document.createElement('button');
    button2.setAttribute('data-testid', 'bookItemDeleteButton');
    button2.innerText = 'Hapus Buku';
    div2.append(button, button2);
    div.append(h3, p, p2, div2);
    if (book.isComplete == true) {
        button.innerText = 'Belum Dibaca'
        const CompleteBookList = document.getElementById('completeBookList');
        CompleteBookList.append(div);
    } else {
        button.innerText = 'Selesai Dibaca'
        const inCompleteBookList = document.getElementById('incompleteBookList');
        inCompleteBookList.append(div);
    }
    button.addEventListener('click', () => {
        book.isComplete = !book.isComplete;
        button.innerText = book.isComplete ? 'Belum Dibaca' : 'Sudah Dibaca';
        const BookList = document.querySelector(`[data-bookid='${book.id}']`);
        BookList.remove();
        if (book.isComplete == true) {
            const CompleteBookList = document.getElementById('completeBookList');
            CompleteBookList.append(div);
        } else {
            const inCompleteBookList = document.getElementById('incompleteBookList');
            inCompleteBookList.append(div);
        }
        localStorage.setItem('books', JSON.stringify(books))
    })
    button2.addEventListener('click', () => {
        const BookList = document.querySelector(`[data-bookid='${book.id}']`);
        BookList.remove();
        deleteBook(book.id);
        localStorage.setItem('books', JSON.stringify(books))
    })
}
function deleteBook(id) {
    books = books.filter(book => book.id != id);
}

function searchBookData() {
    const searchBooks = document.getElementById('searchBookTitle').value;
    const data = books.filter(book => book.title.match(new RegExp(searchBooks, 'gi')) == null);
    const data2 = books.filter(book => book.title.match(new RegExp(searchBooks, 'gi')) != null);
    data.forEach(el => {
        const databook = document.querySelector(`[data-bookid='${el.id}'`);
        databook.setAttribute('hidden', true);
    });
    data2.forEach(el => {
        const databook = document.querySelector(`[data-bookid='${el.id}'`);
        databook.removeAttribute('hidden');
    });
}