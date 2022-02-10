const titleBtn = document.getElementById("title-btn");
const submitBtn = document.getElementById("submit-btn");

const titleInput = document.querySelector(".title");
const alert = document.querySelector(".alert");
const searchInput = document.querySelector(".search");
const textareaInput = document.querySelector(".textarea");

const rowContainer = document.querySelector(".row");
// const searchInput = document.querySelector("[data-search]");

// ********default values
let edit = false;

let editTitle;
let editText;

let editId = "";

// ********addEventlistener***********
submitBtn.addEventListener("click", addCard);

window.addEventListener("DOMContentLoaded", setupUI);
// ********functions************

// ****display card function
function displayCard(id, title, text) {
  html = `
  <div class="card-container col-sm-6 mb-3" data-id="${id}">
  <div class="card">
  <div class="card-body">
  <h5 class="card-title">${title}</h5>
  <p class="card-text">${text}</p>
  <button type= "button" id= "edit" class="btn btn-success ">Edit</button>
  <button type= "button" id= "del" class="btn btn-danger ">Delete</button>
  </div>
  </div>
  </div>
  `;

  rowContainer.insertAdjacentHTML("beforeend", html);
  // const cardContainer = document.querySelector(".card-container");
  // cardId = cardContainer.dataset.id;
}

// Event delegation : bubbling and capturing method
rowContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-danger")) {
    deleteNote(e);
  }
  if (e.target.classList.contains("btn-success")) {
    editNote(e);
  }
});

// ****set Default values function

function setDefaultValues() {
  titleInput.value = "";
  textareaInput.value = "";
  edit = false;
  editId = "";
  submitBtn.textContent = "Submit";
}

// ****display alert function

function displayAlert(text, color) {
  alert.style.display = "block";
  let p = alert.children[0];
  p.innerHTML = text;

  alert.classList.add(`bg-${color}`);

  setTimeout(() => {
    alert.style.display = "none";
    p.textContent = "";
    alert.classList.remove(`bg-${color}`);
  }, 1000);
}

// ****add card function
function addCard() {
  const submitValue = textareaInput.value;
  const titleValue = titleInput.value;

  const id = new Date().getTime().toString();

  if (submitValue && titleValue && !edit) {
    displayCard(id, titleValue, submitValue);

    displayAlert("Note is Added... ", "success");
    addToLocalStorage(id, titleValue, submitValue);
    setDefaultValues();
  } else if (submitValue && titleValue && edit) {
    editTitle.innerHTML = titleValue;
    editText.innerHTML = submitValue;
    displayAlert("A Note Has Been Changed...", "success");

    editItemFromStorage(editId, titleValue, submitValue);
    setDefaultValues();
  } else {
    displayAlert("Fill the title and Note Below...", "danger");
  }
}

// *********Search tool

searchInput.addEventListener("input", function () {
  const value = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll(".card-container");
  cards.forEach(function (card) {
    let cardTitle = card.getElementsByTagName("h5")[0].innerText.toLowerCase();
    let cardText = card.getElementsByTagName("p")[0].innerText.toLowerCase();
    console.log(cardTitle, cardText);

    if (cardTitle.includes(value) || cardText.includes(value)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

// ****delete NOte function
function deleteNote(e) {
  const card = e.target.closest(".card-container");

  const id = card.dataset.id;
  rowContainer.removeChild(card);

  displayAlert("A Note Has Been Deleted...", "danger");
  setDefaultValues();
  delItemFromStorage(id);
}

// ****edit NOte function

function editNote(e) {
  const card = e.target.closest(".card-container");
  editTitle = e.target.previousElementSibling.previousElementSibling;
  editText = e.target.previousElementSibling;

  titleInput.value = editTitle.innerHTML;
  textareaInput.value = editText.innerHTML;
  edit = true;
  editId = card.dataset.id;
  submitBtn.textContent = "Edit";
}

// ******** GetItemFromStorage function

function getLocalStorage() {
  //*** */ if Note exist than get value, if NOT then return [];
  return localStorage.getItem("Note")
    ? JSON.parse(localStorage.getItem("Note"))
    : [];
}

//******** */ AddToLocalStorage funtion
function addToLocalStorage(id, title, note) {
  const addStorage = {
    id,
    title,
    note,
  };

  // we haven't set the local storage Yet so getLocalStorage() will return this []
  let values = getLocalStorage();
  values.push(addStorage);

  localStorage.setItem("Note", JSON.stringify(values));
}

// //******** */ delItemFromStorage funtion
function delItemFromStorage(id) {
  let values = getLocalStorage();
  editId = id;

  values = values.filter(function (val) {
    // IF ID IS MATCHED THAN FILTER ARRAY ELSE return VALUE
    if (val.id !== editId) {
      return val;
    }
  });

  localStorage.setItem("Note", JSON.stringify(values));
}

//******** */ editItemFromStorage funtion

function editItemFromStorage(id, title, note) {
  let values = getLocalStorage();
  editId = id;

  values = values.map(function (val) {
    if (val.id === editId) {
      val.title = title;
      val.note = note;
    }
    return val;
  });
  localStorage.setItem("Note", JSON.stringify(values));
}

function setupUI() {
  let values = getLocalStorage();

  if (values.length > 0) {
    values.forEach(function (item) {
      displayCard(item.id, item.title, item.note);
    });
  }
}
