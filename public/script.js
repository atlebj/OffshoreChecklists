// Event listener for search form submission
document.getElementById('search-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const query = document.getElementById('search-input').value;
  fetch(`/search?q=${query}`)
    .then(response => response.json())
    .then(data => renderSearchResults(data));
});

// Window onload event to fetch all checklists on startup
window.onload = () => {
  fetch('http://localhost:3000/get-all-checklists')
    .then(response => response.json())
    .then(data => {
      console.log('All checklists:', data);
      // Optional: render all checklists on startup
      // renderSearchResults(data);
    })
    .catch(error => {
      console.error('Error fetching all checklists:', error);
    });
};
// Function to handle rendering of search results
function renderSearchResults(data) {
  const resultsElement = document.getElementById('results');
  resultsElement.innerHTML = '';
  data.forEach(list => {
    const listItem = document.createElement('li');
    listItem.textContent = list.title;
    listItem.className = 'checklist-title'; // Add class for styling

    // Add click event listener to the checklist title
    listItem.addEventListener('click', function() {
      // Toggle display of checklist items on click
      const itemsList = listItem.nextElementSibling;
      itemsList.style.display = itemsList.style.display === 'block' ? 'none' : 'block';
    });

    // Create a ul element to hold checklist items (hidden by default)
    const itemsList = document.createElement('ul');
    itemsList.style.display = 'none'; // Hide items by default
    list.items.forEach(item => {
      const itemElement = document.createElement('li');

      // Create a checkbox for each item
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = item;
      checkbox.name = item;

      // Create a label for the checkbox
      const label = document.createElement('label');
      label.htmlFor = item;
      label.appendChild(document.createTextNode(item));

      // Append checkbox and label to the li element
      itemElement.appendChild(checkbox);
      itemElement.appendChild(label);
      itemsList.appendChild(itemElement);
    });

    // Append the items list to the checklist
    resultsElement.appendChild(listItem);
    resultsElement.appendChild(itemsList); // Append itemsList after listItem
  });
}

// Window onload event to fetch all checklists on startup
window.onload = () => {
  const url = 'http://localhost:3000/get-all-checklists';
  console.log('Fetching URL:', url);
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('All checklists:', data);
    })
    .catch(error => {
      console.error('Error fetching all checklists:', error);
    });
};

document.addEventListener('DOMContentLoaded', (event) => {
  
});


function gatherChecklistAnswers() {
  const answers = [];
  // Select all dropdowns with class 'answer-dropdown' and iterate over them
  const dropdowns = document.querySelectorAll('.answer-dropdown');
  dropdowns.forEach(dropdown => {
    // Extract the question ID from the dropdown ID
    const questionId = dropdown.id.replace('answer', '');
    // Find the corresponding textarea for comments using the question ID
    const commentsTextarea = document.getElementById(questionId + 'comments');
    // Create an object representing the answer and comment for this question
    const answer = {
      questionId: questionId,
      answer: dropdown.value, // The selected value from the dropdown
      comments: commentsTextarea.value // The text from the comments textarea
    };
    // Add the answer object to the answers array
    answers.push(answer);
  });

  // Return the array of answers
  return answers;
}


function checkAllConfirmed() {
  // Select all dropdowns with class 'answer-dropdown'
  const dropdowns = document.querySelectorAll('.answer-dropdown');

  // Use the Array.prototype.every method to check if all dropdowns have the value 'confirm'
  return Array.from(dropdowns).every(dropdown => dropdown.value === 'confirm');
}


function handleSave() {
  // Implement save functionality
  console.log('Save button clicked');
  console.log('All questions confirmed. Saving...');
  const checklistAnswers = gatherChecklistAnswers(); // You need to implement this function
  const status = checkAllConfirmed() ? 'Saved' : 'Draft'; // And this function too

  const data = { status, checklistAnswers };

  fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  .then(response => response.text())
  .then(message => console.log(message))
  .catch(err => console.error('Error saving:', err));
}

function handleDraft() {
  // Implement save as draft functionality
  console.log('Save as Draft button clicked');
}

function handleCancel() {
  // Implement cancel functionality
  console.log('Cancel button clicked');
  window.location.href = '/main';
}