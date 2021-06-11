document.addEventListener("DOMContentLoaded", function() {
  // On page load, render the book names from the JSON throguh renderBooks() from a GET request
  fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(books => {
      renderBooks(books)
    })
})

function renderBooks(books) {
  /* Takes the JSON file and  appends each book name to the DOM,
  Additionally, it renders the Books Info through renderBooksInfo() by using an addEventListener*/
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
  /* Two args: the books JSON file and the bookName from the DOM.
  It takes the title properties of the JSON file and compare it to the Book names of the DOM. If true,
  it will manipulate the DOM accordingly with the help of appendUsersLikes() and likeUpdater() */
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
  /* Appends the username property of the users property of the JSON file  */
  book.users.forEach(user => {
    document.querySelector('#show-panel ul').appendChild(document.createElement('li')).textContent = user.username
  })
}

function likeUpdater(book) {
  /* Sends a PATCH request to update the JSON file*/
  const configObj = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(book.users) //Seems it works if you use the entire JSON file. (Less efficient????)
  }
  fetch(`http://localhost:3000/books/${book.id}`, configObj)
}