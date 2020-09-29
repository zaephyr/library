let myLibrary;
const tbody = document.querySelector('#books');

const book = (title, author, pages, status) => {
    return { title, author, pages, status };
};

if (localStorage.getItem('books') !== null) {
    myLibrary = JSON.parse(localStorage.getItem('books'));
} else {
    myLibrary = [];
    myLibrary[0] = book('The Black Swan', 'Nassim Nicholas Taleb', 400, true);
    myLibrary[1] = book('Crime and Punishement', 'Fyodor Dostoevsky', 576, true);
    myLibrary[2] = book('The Hobit', 'J.R.R. Tolkien', 295, false);
}

function addBookButton() {
    const title = document.getElementById('title');
    const author = document.getElementById('author');
    const pages = document.getElementById('pages');

    if (title.value.length >= 2 && author.value.length >= 2) {
        const newBook = book(title.value, author.value, pages.value, false);
        myLibrary.push(newBook);
    } else {
        alert('You need to fill title and author');
    }
    updateTable();
}

function removeBook(ele) {
    const selectRow = ele.parentNode.parentNode.firstChild.textContent;
    const index = myLibrary.findIndex((obj) => obj.title == selectRow);
    myLibrary.splice(index, 1);
    updateTable();
}

function changeStatus(ele) {
    const selectRow = ele.parentNode.parentNode.firstChild.textContent;
    const index = myLibrary.findIndex((obj) => obj.title == selectRow);
    if (myLibrary[index].status) {
        myLibrary[index].status = false;
    } else {
        myLibrary[index].status = true;
    }
    updateTable();
}

function nameShort() {
    const nameCell = document.querySelectorAll('td:nth-child(2)');
    const nameArr = [];
    for (let i = 0; i < nameCell.length; i++) {
        nameArr.push(nameCell[i].textContent);
    }
    window.addEventListener('resize', () => {
        console.log('resize');
        const nameCellWidth = document.querySelectorAll('td:nth-child(2)')[0].clientWidth;
        for (let i = 0; i < nameArr.length; i++) {
            if (nameCellWidth < 175) {
                if (nameArr[i].length > 14) {
                    const singleNameArr = nameArr[i].split(' ');
                    if (singleNameArr.length == 2) {
                        nameCell[i].textContent = singleNameArr[0].toString().charAt(0) + '. ' + singleNameArr[1];
                    } else if (singleNameArr.length == 3) {
                        nameCell[i].textContent =
                            singleNameArr[0].toString().charAt(0) +
                            '. ' +
                            singleNameArr[1].toString().charAt(0) +
                            '. ' +
                            singleNameArr[2];
                    }
                }
            } else {
                nameCell[i].textContent = nameArr[i];
            }
        }
    });
}

function updateTable(arr) {
    tbody.innerHTML = '';

    for (let i = 0; i < myLibrary.length; i++) {
        const row = document.createElement('tr');

        const title = document.createElement('td');
        title.innerText = myLibrary[i].title;

        const author = document.createElement('td');
        author.innerText = myLibrary[i].author;

        const pages = document.createElement('td');
        pages.innerText = myLibrary[i].pages;

        const status = document.createElement('td');
        const statusButton = document.createElement('button');
        statusButton.setAttribute('onclick', 'changeStatus(this)');
        statusButton.className = 'checkbox';
        statusButton.style.height = '100%';
        statusButton.style.backgroundColor = 'inherit';
        statusButton.style.fontSize = '1rem';
        statusButton.style.border = 0;
        statusButton.style.padding = 0;

        if (myLibrary[i].status) {
            const check = document.createElement('ion-icon');
            check.name = 'shield-checkmark-outline';
            check.style.color = '#81ecec';
            statusButton.appendChild(check);
        } else if (!myLibrary[i].status) {
            const notRead = document.createElement('ion-icon');
            notRead.name = 'close-circle-outline';
            notRead.style.color = '#fd79a8';
            statusButton.appendChild(notRead);
        }

        const delIconPlace = document.createElement('td');

        const deleteButton = document.createElement('button');
        deleteButton.class = 'delete-button';
        deleteButton.setAttribute('onclick', 'removeBook(this)');
        deleteButton.style.backgroundColor = 'inherit';
        deleteButton.style.fontSize = '1rem';
        deleteButton.style.border = 0;
        deleteButton.style.padding = 0;

        const delIcon = document.createElement('ion-icon');
        delIcon.name = 'trash-outline';

        tbody.appendChild(row);
        row.appendChild(title);
        row.appendChild(author);
        row.appendChild(pages);
        status.appendChild(statusButton);
        row.appendChild(status);
        delIconPlace.appendChild(deleteButton);
        deleteButton.appendChild(delIcon);
        row.appendChild(delIconPlace);
        localStorage.setItem('books', JSON.stringify(myLibrary));
        nameShort();
    }
}

const filterButtons = document.querySelectorAll('.filter');
filterButtons.forEach((filterButton) => {
    filterButton.addEventListener('click', () => {
        filterButtons.forEach((filterButton) => {
            filterButton.classList.remove('active');
        });
        filterButton.classList.toggle('active');
        let filter = filterButton.getAttribute('data-filter');
        let checkbox = document.querySelectorAll('.checkbox');

        if (filter == 'all-books') {
            const filterStatus = document.querySelector('.filter-status');
            filterStatus.textContent = 'All Books';
            checkbox.forEach((checkbox) => {
                let row = checkbox.parentNode.parentNode;
                row.style.display = 'table-row';
            });
            return;
        }
        checkbox.forEach((checkbox) => {
            let row = checkbox.parentNode.parentNode;
            const selectRow = checkbox.parentNode.parentNode.firstChild.textContent;
            const index = myLibrary.findIndex((obj) => obj.title == selectRow);
            const filterStatus = document.querySelector('.filter-status');
            if (filter == 'read') {
                filterStatus.textContent = 'Read Books';
                if (myLibrary[index].status) {
                    row.style.display = 'table-row';
                } else {
                    row.style.display = 'none';
                }
                return;
            } else if (filter == 'not-read') {
                filterStatus.textContent = 'Not Read Books';
                if (myLibrary[index].status) {
                    row.style.display = 'none';
                } else {
                    row.style.display = 'table-row';
                }
                return;
            }
        });
    });
});

updateTable();
nameShort();
