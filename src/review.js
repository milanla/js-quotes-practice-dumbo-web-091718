const BASE_URL = 'http://localhost:3000/quotes'
const quoteCon = document.getElementById('quote-list')
const formCon = document.getElementById('new-quote-form')
const editForm = document.querySelector('.edit-quote-form')
let editQ = false


window.addEventListener('load', init)

function init() {

  quoteCon.addEventListener('click', updateQuote)
  formCon.addEventListener('submit', createNewQuote)
  editForm.addEventListener('submit', editQuote)
  formCon.style.display = 'block'
  editForm.style.display = 'none'

  quoteCon.innerHTML = ""
  fetch(BASE_URL)
  .then(res => res.json())
  .then(json => json.forEach(quote => {
    renderQuote(quote)
  }))
}

function renderQuote(quote) {
  quoteCon.innerHTML += `<li class='quote-card' data-id="${quote.id}">
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success' data-id="${quote.id}">Likes: <span>${quote.likes}</span></button>
      <button class='btn-danger' data-id="${quote.id}">Delete</button>
      <button class='btn-info' data-id="${quote.id}">Edit</button>
    </blockquote>
  </li>`
}

function updateQuote() {
  if (event.target.className === 'btn-success') {
    updateLike(event)
  } else if (event.target.className === 'btn-danger') {
    deleteQuote(event)
  } else if (event.target.className === 'btn-info') {
    editQ = !editQ
    if (editQ) {
      editForm.style.display = 'block'
      formCon.style.display = 'none'
      renderEditQuote(event)
    } else {
      editForm.style.display = 'none'
      formCon.style.display = 'block'
    }
  }
}

function updateLike(event) {
  let quoteId = event.target.dataset.id
  let likeNum = event.target.firstElementChild
  let likeCount = Number(likeNum.innerText)
  likeNum.innerText = ++likeCount

  fetch(`${BASE_URL}/${quoteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      likes: likeCount
    })
  })
}

function deleteQuote(event) {
  let quoteId = event.target.dataset.id
  event.target.parentElement.parentElement.remove()

  fetch(`${BASE_URL}/${quoteId}`, {
    method: 'DELETE'
  })
}

function createNewQuote(event) {
  event.preventDefault()
  // debugger
  let quote = event.target[0]
  let author = event.target[1]

  fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quote: quote.value,
      likes: 0,
      author: author.value
    })
  })
  .then(res => res.json())
  .then(renderQuote)

  event.target.reset()
}

function renderEditQuote(event) {
  const quoteId = event.target.dataset.id

  fetch(`${BASE_URL}/${quoteId}`)
  .then(res => res.json())
  .then(function(json){
    let quoteField = editForm[0]
    let authorField = editForm[1]

    editForm.dataset.id = json.id
    quoteField.value = json.quote
    authorField.value = json.author
  })
}

function editQuote(event) {
  event.preventDefault()
  
  let quoteId = event.target.dataset.id
  let quote = editForm[0]
  let author = editForm[1]

  fetch(`${BASE_URL}/${quoteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quote: quote.value,
      author: author.value
    })
  })
  .then(function() {
    init()
  })

}
