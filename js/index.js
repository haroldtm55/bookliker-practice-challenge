document.addEventListener("DOMContentLoaded", function() {
  fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(books => {
      renderBooks(books)
    })
});

function renderBooks(books) {
  books.forEach(book => document.getElementById('list').appendChild(document.createElement('li')).textContent = book.title)
  const bookNames = document.querySelectorAll('ul li')
  bookNames.forEach(bookName => {
    bookName.addEventListener('click', function () {
      fetch('http://localhost:3000/books')
        .then(resp => resp.json())
        .then(books => {
          renderBooksInfo(books,bookName)
        })
    })
  })
}

function renderBooksInfo(books,bookName) {
  const showPanel = document.getElementById('show-panel')
  showPanel.innerHTML = ''
  books.forEach(book => {
    if (book.title === bookName.textContent) {
      showPanel.appendChild(document.createElement('img')).setAttribute('src', book['img_url'])
      showPanel.appendChild(document.createElement('h4')).textContent = book.title
      showPanel.appendChild(document.createElement('h4')).textContent = book.subtitle
      showPanel.appendChild(document.createElement('p')).textContent = book.description
      showPanel.appendChild(document.createElement('ul'))
      
      showPanel.appendChild(document.createElement('button')).textContent = 'LIKE'
      const likeButton = document.querySelector('button')
      appendUsersLikes(book)
      if (document.querySelector('#show-panel ul').lastChild.textContent === 'pouros') {
        likeButton.textContent = 'UNLIKE'
      }
      likeButton.addEventListener('click', function () {
        if (likeButton.textContent === 'LIKE') {
          likeButton.textContent = 'UNLIKE'
          book.users.push({id: 1, username: 'pouros'})
          likeUpdater(book)
        } 
        else if (likeButton.textContent === 'UNLIKE') {
          likeButton.textContent = 'LIKE'
          book.users.pop()
          likeUpdater(book)
        }
        document.querySelector('#show-panel ul').innerHTML = ''
        appendUsersLikes(book)  
      })
    }
  }) 
}

function appendUsersLikes(book) {
  book.users.forEach(user => {
    document.querySelector('#show-panel ul').appendChild(document.createElement('li')).textContent = user.username
  })
}

function likeUpdater(book) {
  const configObj = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(book)
  }
  fetch(`http://localhost:3000/books/${book.id}`, configObj)
}
