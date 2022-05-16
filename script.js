// Declare main variable - get main element by id
const body = document.getElementById('body');
const main = document.getElementById('main');
const formTitle = document.getElementById('formTitle');
const formTag = document.getElementById('formTag');
const formAuthor = document.getElementById('formAuthor');
const formDate = document.getElementById('formDate');
const formImgUrl = document.getElementById('formImgUrl');
const formSaying = document.getElementById('formSaying');
const formSummary = document.getElementById('formSummary');
const formContent = document.getElementById('formContent');

const addButton = document.getElementById('add');
let saveButton = document.getElementById('save');
const cancelButton = document.getElementById('cancel');

async function getArticlesFromServer() {
  // Solution here
  const response = await fetch('http://localhost:3000/articles');
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  await response.json().then((response) => {
    renderArticles(response);
  });
}

function addArticleToServer() {
  // creat post object
  const postObject = {
    title: formTitle.value,
    tag: formTag.value,
    author: formAuthor.value,
    date: formDate.value,
    imgUrl: formImgUrl.value
  }
  // Call post request to add a new article
  fetch('http://localhost:3000/articles', {
    method: 'post',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(postObject)
  }).then(function () {
    // Get the new article list
    getArticlesFromServer();

    // Reset Form
    resetForm();

    // Close Modal
    closeModal();
  });
}

function deleteArticleFromServer(id) {
  // Call delete request to delete the article
  fetch(`http://localhost:3000/articles/${id}`, {
    method: 'DELETE',
  }).then(function () {
    // Get the new articles list
    getArticlesFromServer();
  });
}

function updateArticleToServer(id) {
  // creat put object
  const putObject = {
    title: formTitle.value,
    tag: formTag.value,
    author: formAuthor.value,
    date: formDate.value,
    imgUrl: formImgUrl.value

  }
  // Call put request to update the article
  fetch(`http://localhost:3000/articles/${id}`, {
    method: 'PUT',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(putObject)
  }).then(function () {
    // Get the new article list
    getArticlesFromServer();

    // Reset Form
    resetForm();

    // Close Modal
    closeModal();
  });
}

function openAddModal() {

  // clear all events save button events
  clearSaveButtonEvents();

  saveButton.addEventListener('click', function () {
    addArticleToServer()
  });

  body.className = 'show-modal';
}

function openEditModal(article) {
  // Copy article information to form
  formTitle.value = article.title;
  formTag.value = article.tag;
  formAuthor.value = article.author;
  formDate.value = article.date;
  formImgUrl.value = article.imgUrl;

  // clear all events update button events
  clearSaveButtonEvents();

  saveButton.addEventListener('click', function () {
    updateArticleToServer(article.id)
  });

  body.className = 'show-modal';
}

// Remove articles list if exist
function removeOldArticlesFromDOM() {
  main.innerHTML= "";
}

function createArticleDOMNode(article) {
  // Solution here
  // Title
  let title = document.createElement('h2');
  title.className = "title";
  title.textContent = article.title;

  // Tag
  let tag = document.createElement('li');
  tag.className = "info__item";
  tag.textContent = article.tag;

  // Author
  let author = document.createElement('span');
  author.className = "info__mark";
  author.textContent = article.author;

  let authorContainer = document.createElement('li');
  authorContainer.className = "info__item";
  authorContainer.textContent = 'Added By ';
  authorContainer.appendChild(author)

  // Date
  let date = document.createElement('li');
  date.className = "info__item";
  date.textContent = article.date;

  // Information container
  let infoContainer = document.createElement('ul');
  infoContainer.className = "info__container";
  infoContainer.appendChild(tag);
  infoContainer.appendChild(authorContainer);
  infoContainer.appendChild(date);

  // Edit button
  let editButton = document.createElement('button');
  editButton.className = "actions__btn";
  // Add event on edit button and pass article object to populate the form  more at https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
  editButton.addEventListener('click', function () {
    openEditModal(article);
  });
  editButton.textContent = 'Edit';

  // Delete button
  let deleteButton = document.createElement('button');
  deleteButton.className = "actions__btn";
  // Add event on delete button and pass article id to delete it form server more at https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
  deleteButton.addEventListener('click', function () {
    deleteArticleFromServer(article.id);
  });
  deleteButton.textContent = 'Delete';

  // Buttons container
  let buttonsContainer = document.createElement('div');
  buttonsContainer.className = "actions__container";
  buttonsContainer.appendChild(editButton);
  buttonsContainer.appendChild(deleteButton);

  // Image
  let img = document.createElement('img');
  img.src = article.imgUrl;

  // Paragraph
  let paragraph = document.createElement('p');
  paragraph.textContent = article.content;

  // Paragraph container
  let paragraphContainer = document.createElement('div');
  paragraphContainer.className = "content__container";
  paragraphContainer.appendChild(paragraph);

  // Append all article nodes to container
  let articleNode = document.createElement('article');
  articleNode.appendChild(title);
  articleNode.appendChild(infoContainer);
  articleNode.appendChild(buttonsContainer);
  articleNode.appendChild(img);
  articleNode.appendChild(paragraphContainer);

  return articleNode;
}

// Create DOM objects and append them to DOM
function renderArticles(articles) {

  removeOldArticlesFromDOM();

  // Create and append articles given as parameter
  for (let i = 0; i < articles.length; i++) {
    let articleDOMNode = createArticleDOMNode(articles[i]);
    main.appendChild(articleDOMNode);
  }
}

function resetForm() {
  formTitle.value = '';
  formTag.value = '';
  formAuthor.value = '';
  formDate.value = '';
  formImgUrl.value = '';
}
function clearSaveButtonEvents() {

}

// Close modal
function closeModal() {
  body.className = '';
}

// Add event listener on Add button
addButton.addEventListener('click', openAddModal);
// Add event listener on Cancel button
cancelButton.addEventListener('click', closeModal);
// Get all articles
getArticlesFromServer();