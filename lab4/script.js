class Note {
  constructor(title, content, color, date, pin) {
    this.title = title;
    this.content = content;
    this.color = color;
    this.date = date;
    this.pin = pin;
  }

  displayNote() {
    return `
    <div class="note" style="background-color:${this.color};">
         <div onclick="deleteNote(this)" class="hamburger"><div></div></div>
        <div class="note-header">
            <h3>${this.title}</h3>
            <p>${this.date}</p>
        </div>
        <div class="note-body">
             <p>${this.content}</p>
        </div>  
       ${this.pin === true ? `<div class="pin"></div>` : ``}
       <button onclick="createPopup(this)" class="btn">Edit</button>
    </div>
    `;
  }
}

let notes = [];

function sortNotes(array) {
  const sortedNotes = array.sort((a, b) => {
    return b.pin - a.pin;
  });
  return sortedNotes;
}

function displayNotes() {

  let notesContainer = document.querySelector(".notes-container");


  notesContainer.innerHTML = "";

  let notesFromStorage = JSON.parse(localStorage.getItem("notes"));
  if (notesFromStorage) {
    notes = [];
    sortedNotes = sortNotes(notesFromStorage);


    sortedNotes.forEach((note) => {
     
      let newNote = new Note(
        note.title,
        note.content,
        note.color,
        note.date,
        note.pin
      );

      
      notes.push(newNote);
    });
  }


  notes.forEach((note) => {
    notesContainer.innerHTML += note.displayNote();
  });
}

function addNote() {

  let title = document.getElementById("title").value;
  let content = document.getElementById("content").value;
  let color = document.getElementById("color").value;
  let date = new Date().toLocaleDateString();
  let pin = document.getElementById("pin").checked;


  let newNote = new Note(title, content, color, date, pin);


  notes.push(newNote);


  localStorage.setItem("notes", JSON.stringify(notes));

  displayNotes();
}

function getIndex(element) {
  const note = element.parentElement;

  const noteIndex = Array.from(note.parentElement.children).indexOf(note);
  return noteIndex;
}
function deleteNote(element) {
  const noteIndex = getIndex(element);
  notes.splice(noteIndex, 1);
  localStorage.setItem("notes", JSON.stringify(notes));

  displayNotes();
}

function editNote(noteIndex) {
  try {
    let title = document.getElementById("title-edit").value;
    let content = document.getElementById("content-edit").value;
    let color = document.getElementById("color-edit").value;
    let date = notes[noteIndex].date;
    let pin = document.getElementById("pin-edit").checked ? true : false;

    let newNote = new Note(title, content, color, date, pin);


    notes.splice(noteIndex, 1, newNote); 

    localStorage.setItem("notes", JSON.stringify(notes));

    displayNotes();
  } catch {
    console.log("error");
  }
}

function createPopup(element) {
  const elementIndex = getIndex(element);
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.innerHTML = `
  <div class="popup-overlay">
  <div class="popup-content">
    <div class="popup-header">
      <h3>Edit Note</h3>
      <div onclick="closePopup()" class="hamburger"><div></div></div>
    </div>
    <div class="popup-body">
      <form>
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title-edit" value="${notes[elementIndex].title}" placeholder="Title">
        </div>
        <div class="form-group">
          <label for="content">Content</label>
          <textarea id="content-edit" placeholder="Content"> ${notes[elementIndex].content}</textarea>
        </div>
        <div class="form-group">
          <label for="color">Color</label>
          <input type="color" value="${notes[elementIndex].color}" id="color-edit">
        </div>
        <div class="form-group">
          <label for="pin">Pin</label>
          ${notes[elementIndex].pin === true ? `<input type="checkbox" checked id="pin-edit">` : `<input type="checkbox"  id="pin-edit">`}
        </div>
        <div class="form-group">
          <button type="button" onclick="editNote(${elementIndex})" class="btn">Edit Note</button>
        </div>
      </form>
    </div>
  </div>
  </div>
  `;
  document.body.appendChild(popup);
}

function closePopup() {
  document.querySelector(".popup").remove();
}

displayNotes();