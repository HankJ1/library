let myLibrary = [];
const firstDiv = document.querySelector(".A");
const libraryDiv = document.querySelector(".library-container");
const newBookForm = document.querySelector(".new-book-form");

//constructor function to create book objects
function Book(title, author, numPages, readyn) {
    this.title = title;
    this.author = author;
    this.pageCount = numPages;
    this.readStatus = readyn;
    this.info = function () {
        let a;
        if (readyn.toLowerCase().includes("n")) {
            a = "not read yet"
        } else if (readyn.toLowerCase().includes("y")) {
            a = "read already"
        } else {
            a = "may or may not have been read"
        }
        return `${title} by ${author}, ${numPages} pages, ${a}`
    }
}

//test creating books
let LOTR = new Book("Lord of The Rings", "J.R.R. Tolkien", 500, "Read? yes");
let huckFin = new Book("The Adventures of Huckleberry Finn", "Mark Twain", 275, "Read? yes");
let nativeSon = new Book("Native Son", "Wrichard Right", 333, "Read? yes");
let theNameOfTheWind = new Book("The Name of the Wind", "Patrick Rothfuss", 400, "Read? yes");
new Book("Charlie Wilson's War", "Charlie Wilson", 455, "Read? no");

//adds books to library array but not display
function addBookToLibrary(bookTitle) {
    myLibrary.push(bookTitle);
}

//removes selected book from libary
function removeBookFromLibrary(removeBook) {
    let index = myLibrary.indexOf(removeBook);
    myLibrary.splice(index, 1);
    (document.querySelector(`div[data-title="${removeBook}"]`)).remove();
    localStorage.removeItem(`${removeBook}`);
}

addBookToLibrary(LOTR);
addBookToLibrary(huckFin);


//creates a new element of a specified class type parent datakey and text content... kind of useful
let tempParent;
function createElement(type, userClass, text, parent, datakey) {
    const newElement = document.createElement(`${type}`)
        if (type !== "br") {
            newElement.classList.add(`${userClass}`);
        }
        newElement.textContent=`${text}`;
        newElement.dataset.title=`${datakey}`;
        if (type === "div") { 
            tempParent = newElement;
        }   
        parent.appendChild(newElement);
        
}

//creates a new div and all new elements for a new book to be displayed in library
//bookName is the same as the title in this case but is name of object
function addBookToDisplay(bookName) {
    createElement("div", "book-display", "", libraryDiv, `${bookName.title}`);
    createElement("h3", "legit", `${bookName.title}`, tempParent);
    createElement("h4", "legit", `${bookName.author}`, tempParent);
    createElement("h5", "top-text", `${bookName.pageCount} pages`, tempParent);
    createElement("h6", "bottom-text", `${bookName.readStatus}`, tempParent, `${bookName.title}`);
    createElement("button", "top-button", "Remove", tempParent, `${bookName.title}`);
    createElement("br", "", "", tempParent);
    createElement("button", "bottom-button", "Toggle Read", tempParent, `${bookName.title}`);
    setRemoveButtons();
    setToggleButtons(bookName);
}

//activate remove buttons to remove the associated book where they reside
function setRemoveButtons() {
    const removeButtons = document.querySelectorAll(".top-button");
    removeButtons.forEach(removeButton => {
        removeButton.addEventListener('click', (e) => {
            // console.log(e);
            // console.log(e.target.attributes[1].nodeValue);
            let a = e.target.attributes[1].nodeValue;
            // console.log(this);
            removeBookFromLibrary(a);
        })
    })
}

//makes toggle buttons active based on available divs
function setToggleButtons(objName) {
    let toggleButton = document.querySelector(`.bottom-button[data-title="${objName.title}"]`);
        toggleButton.addEventListener('click', (e) => {
            // console.log(e);
            // console.log(e.target.attributes[1].nodeValue);
            let a = e.target.attributes[1].nodeValue; //gets title of book
            //console.log(a);
            // console.log(this);
            changeReadStatus(a);
            //console.table(objName);
            //localStorage.removeItem(`${objName.title}`);
            //localStorage.setItem(`${objName.title}`, JSON.stringify(objName));
        })
}

//reveals the form to create a book 
function revealAddBook() {
    newBookForm.setAttribute("style", "display: flex");
}

//click the x buttons in new book form to clear form and remove it from veiw.
function hideAddBook() {
    document.querySelector(".title").value = "";
    document.querySelector(".author").value = "";
    document.querySelector(".page-count").value = "";
    document.querySelector(".read").checked = false;
    newBookForm.setAttribute("style", "display: none")
}

//click submit on the add book form to create a new book and then add the div to the library 
//but not the array using the forms on the add book form. then clears the form
function submitNewBook() {
    let title = document.querySelector(".title").value;
    let author = document.querySelector(".author").value;
    let pageNum = document.querySelector(".page-count").value;
    let readStatus = document.querySelector(".read").checked;
        if (readStatus == true) {
            readStatus = "Read? yes"
        } else {
            readStatus = "Read? No"
        }
    let a = new Book(title, author, pageNum, readStatus);
    addBookToDisplay(a);
    localStorage.setItem(`${title}`, JSON.stringify(a));
    // let b = localStorage.getItem(`${title}`);
    hideAddBook();
}

//changes read status abook = title of book
function changeReadStatus(abook) {
    let a = (document.querySelector(`h6[data-title="${abook}"]`)).textContent;
    // console.log(abook);
    if (a.includes("yes")) {
        b = "Read? no";
    } else {
        b = "Read? yes"
    }
    console.log(b);
    //console.log(localStorage.getItem(`${abook}`));
    let tempString = localStorage.getItem(`${abook}`);
    localStorage.removeItem(`${abook}`)
    let tempObj = JSON.parse(tempString);
    tempObj.readStatus = b;
    console.log(tempObj.readStatus);
    localStorage.setItem(`${abook}`, JSON.stringify(tempObj));
    document.querySelector(`h6[data-title="${abook}"]`).textContent = b;
    // console.log(b);
}

//populate library with preset books or local storage if local storage detected
if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i++) {
        let string = localStorage.getItem(localStorage.key(i));
        let obj = JSON.parse(string);
        console.table(obj);
        addBookToDisplay(obj);
    }
} else {
    addBookToDisplay(LOTR);
    addBookToDisplay(huckFin);
    addBookToDisplay(nativeSon);
    addBookToDisplay(theNameOfTheWind);
}


