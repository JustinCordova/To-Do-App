// Function to create a cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // set expiry date
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie by name
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length); // trim spaces
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length); // return cookie value
    }
    return null;
}

// Function to load todo items from the cookie
function loadTodos() {
    var todos = getCookie("todos");
    if (todos) {
        todos = JSON.parse(todos); // Parse the JSON string back into an object
        todos.forEach(function(item) {
            addTodoItem(item.text, item.checked);
        });
    }
}

// Function to save the current todo list to a cookie
function saveTodos() {
    var todoItems = [];
    var listItems = document.querySelectorAll("#myUL li");
    listItems.forEach(function(item) {
        todoItems.push({
            text: item.firstChild.nodeValue,
            checked: item.classList.contains('checked')
        });
    });

    // Store the todo items in a cookie as a JSON string
    setCookie("todos", JSON.stringify(todoItems), 7); // Save cookies for 7 days
}

// Function to add a new todo item
function addTodoItem(text, checked = false) {
    var li = document.createElement("LI");
    var t = document.createTextNode(text);
    li.appendChild(t);

    if (checked) {
        li.classList.add("checked");
    }

    // Create a close button
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    document.getElementById("myUL").appendChild(li);

    // Re-bind close functionality for all close buttons
    var close = document.getElementsByClassName("close");
    for (var i = 0; i < close.length; i++) {
        close[i].onclick = function() {
            var div = this.parentElement;
            div.style.display = "none";
            saveTodos(); // Save the todo list after removing an item
        };
    }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
        saveTodos(); // Save the todo list after toggling the checked state
    }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
    var inputVal = document.getElementById("myInput").value;
    if (inputVal === '') {
        alert("You must write something!");
    } else {
        addTodoItem(inputVal);
    }
    document.getElementById("myInput").value = "";
    saveTodos(); // Save the todo list after adding a new item
}

// Add event listener for Enter key press
document.getElementById("myInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        newElement();
    }
});

// Load todos from cookies when the page loads
window.onload = function() {
    loadTodos(); // Load the saved todos on page load
};
