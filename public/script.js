// Event listener for search form submission
/* document.getElementById('search-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const query = document.getElementById('search-input').value;
  fetch(`/search?q=${query}`)
    .then(response => response.json())
    .then(data => renderSearchResults(data));
}); */

//const { response } = require("../app");

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

// Add event listeners to all comment icons
document.addEventListener('DOMContentLoaded', function() {
  // Get all elements with the class .comment-icon
  const commentIcons = document.querySelectorAll('.comment-icon');

  // Add event listener to each comment icon
  commentIcons.forEach(icon => {
      icon.addEventListener('click', function() {
          const targetId = icon.getAttribute('data-target');
          const textarea = document.getElementById(targetId);
          if (textarea.style.display === 'none') {
              textarea.style.display = 'block';
          } else {
              textarea.style.display = 'none';
          }
      });
  });
});

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


function gatherChecklistAnswers(currentUser) {
  const answersByCategory = {};

  // Select all dropdowns with class 'answer-dropdown' and iterate over them
  const dropdowns = document.querySelectorAll('.answer-dropdown');
  dropdowns.forEach(dropdown => {
    // Find the closest 'li.question-area' element to access the data-category attribute
    const questionArea = dropdown.closest('.question-area');
    const category = questionArea ? questionArea.getAttribute('data-category') : 'Unknown category';

    // Extract the question ID and text from the dropdown ID
    const questionId = dropdown.id.replace('answer', '');
    const questionText = questionArea.querySelector('p').textContent;

    // Find the corresponding textarea for comments using the question ID
    const commentsTextarea = document.getElementById(questionId + 'comments');

    // Create an object representing the answer and comment for this question
    const answer = {
      questionId: questionId,
      questionText: questionText,
      answer: dropdown.value, // The selected value from the dropdown
      comments: commentsTextarea.value, // The text from the comments textarea
      confirmedBy : currentUser
    };

    // Group answers by category
    if (!answersByCategory[category]) {
      answersByCategory[category] = [];
    }
    answersByCategory[category].push(answer);
  });

  // Return the object grouped by category
  return answersByCategory;
}





function checkAllConfirmed() {
  // Select all dropdowns with class 'answer-dropdown'
  const dropdowns = document.querySelectorAll('.answer-dropdown');

  // Use the Array.prototype.every method to check if all dropdowns have the value 'confirm'
  return Array.from(dropdowns).every(dropdown => dropdown.value === 'confirm');
}


function handleSave() {
  // Implement save functionality
  //console.log('Save button clicked');
  //console.log('All questions confirmed. Saving...');
  const title = document.getElementById('titleInput').textContent; // Replace 'titleInput' with the actual ID of the title input field
  const procedure_no = document.getElementById('procedureNoInput').textContent;
  const version = document.getElementById('versionInput').textContent;
  const revision_date = document.getElementById('revisionDateInput').textContent;
  const changed_by = document.getElementById('changedByInput').textContent;
  const current_date = new Date().toISOString().slice(0, 10);
  const currentUser = "John Doe"; // Replace with the actual current user */
  const type = "type1";
  const location = "location1";
    
  const checklistAnswers = gatherChecklistAnswers(currentUser); // You need to implement this function
  const status = checkAllConfirmed() ? 'Completed' : 'Draft'; // And this function too  
  //console.log('Checklist answers:', checklistAnswers);

  const data = {
    title: title,
    procedure_no: procedure_no,
    version: version,
    revision_date: revision_date,
    changed_by: changed_by,
    current_date: current_date,
    checklistAnswers: checklistAnswers,
    type: type,
    location: location,
    status: status
  };

  console.log('Data to save:', data);

  fetch('/save-checklist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(message => {
        console.log(message);
        if (message === "Response saved successfully") { // adjust this based on the actual success message
            window.location.href = '/'; // redirect to the main page
        } else {
            alert('Failed to save checklist.');
        }
    })
    .catch(err => console.error('Error saving:', err));
}

function handleDraft() {
  // Implement save as draft functionality
  console.log('Save as Draft button clicked');
  const title = document.getElementById('titleInput').textContent; // Replace 'titleInput' with the actual ID of the title input field
  const procedure_no = document.getElementById('procedureNoInput').textContent;
  const version = document.getElementById('versionInput').textContent;
  const revision_date = document.getElementById('revisionDateInput').textContent;
  const changed_by = document.getElementById('changedByInput').textContent;
  const current_date = new Date().toISOString().slice(0, 10);
  const currentUser = "John Doe"; // Replace with the actual current user */
  const type = "type1";
  const location = "location1";
    
  const checklistAnswers = gatherChecklistAnswers(currentUser); // You need to implement this function
  const status = checkAllConfirmed() ? 'Completed' : 'Draft'; // And this function too  

  const data = {
    title: title,
    procedure_no: procedure_no,
    version: version,
    revision_date: revision_date,
    changed_by: changed_by,
    current_date: current_date,
    checklistAnswers: checklistAnswers,
    type: type,
    location: location,
    status: status
  };

  data.status = 'Draft';

    fetch('/save-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(message => {
        console.log(message);
        if (message === "Draft saved successfully") { // adjust this based on the actual success message
            displaySuccessMessage(); // Function to display a success message or modal
        } else {
            alert('Failed to save draft.');
        }
    })
    .catch(err => console.error('Error saving draft:', err));

}

function handleCancel() {
  // Implement cancel functionality
  console.log('Cancel button clicked');
  window.location.href = '/';
}

function displaySuccessMessage() {
  const userChoice = confirm('Draft saved successfully. Would you like to return to the main page?');
  if (userChoice) {
      window.location.href = '/'; // redirect to the main page
  }
}

