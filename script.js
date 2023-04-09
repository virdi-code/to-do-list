//to do list app

const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode =false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    //validating the input
    if(newItem.value === ' ') {
        alert('Add an item');
        return;
    }

    //checking for editmode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode')

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }
    else {
        if (checkIfItemExists(newItem)) {
            alert('Item Already Exists');
            return;
        }
    }


    //create item DOM element
    addItemToDOM(newItem);
    //adding item to local storage
    addItemToStorage(newItem);
    checkUI();

    itemInput.value = '';
}

function addItemToDOM(item) {
        //creating the list items
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(item));
    
        const button = createButton('remove-item btn-link text-red');
        li.appendChild(button);
        
        //adding li to DOM 
        itemList.appendChild(li);
}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();


    //add new items to array
    itemsFromStorage.push(item);

    //convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if(localStorage.getItem('items')=== null) {
        itemsFromStorage = [];
    }
    else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
            removeItem(e.target.parentElement.parentElement);
        }
        else {
            setItemToEdit(e.target);
        }
}

function setItemToEdit(item){
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    //item.style.color = '#d64646';

    formBtn.innerHTML = '<i class = "fa-solid fa-pen"</i> Update Item';
    formBtn.style.backgroundColor = '#d64646'
    itemInput.value = item.textContent;

}

function removeItem(item) {
    if(confirm('Are you sure???')){
        //remove item from DOM
        item.remove();

        //remove item from storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
    // if (e.target.parentElement.classList.contains('remove-item')) {
    //     if(confirm('Are you Sure?')){
    //         e.target.parentElement.parentElement.remove();
    //     }
    //     checkUI();
    // };
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    //filter out items to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    //reset to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(){
    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    //clear from local storage
    localStorage.removeItem('items');

    checkUI();
}

function filterItmes(e) {
    const items = itemList.querySelectorAll('li'); //access to the items
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        }
        else {
            item.style.display = 'none';
        }
    });
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);

    // if (itemsFromStorage.includes(item)) {
    //     return true;
    // }
    // else{
    //     return false;
    // }
}

function checkUI() {
    itemInput.value = '';

    const items = itemList.querySelectorAll('li'); //cannot run it globally
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }
    else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';  
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

//initialize appp
function init() {

//event listeners
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItmes);
document.addEventListener('DOMContentLoaded', displayItems);

checkUI();
}

init();
