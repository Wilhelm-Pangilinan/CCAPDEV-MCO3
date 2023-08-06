/*|*******************************************************

                     SIDEBAR BUTTONS

*********************************************************/  
function navigateToPage(url) {
	window.location.href = url; 
}

/*|*******************************************************

                     SIDEBAR BUTTONS

*********************************************************/  
function deleteAccount(url, method) {

  fetch(url, {
      method: method, 
  })
  .catch(error => {
      console.error('Error during deletion:', error);
      // Handle the error and display an error message to the user if needed
  });

  navigateToPage('/login');

}


/*|*******************************************************

                CHANGE DESCRIPTION BUTTON

*********************************************************/  
const newDescriptionInput = document.getElementById('new-description');
const profileDescription = document.getElementById('profile-description');
const popUp = document.getElementById('pop-up');

document.getElementById('save-button').addEventListener('click', () => {
    const newDescription = newDescriptionInput.value;
    profileDescription.textContent = newDescription;
    popUp.classList.remove('open-popup');
});

document.getElementById('edit-profile-button').addEventListener('click', () => {
    popUp.classList.add('open-popup');
});

// Get the "Cancel" button inside the "Edit Profile" popup
const cancelButton = document.getElementById('cancel-button');

// Add click event listener to the "Cancel" button
cancelButton.addEventListener('click', () => {
    // Close the "Edit Profile" popup
    popUp.classList.remove('open-popup');
});

/*|*******************************************************

                 DELETE ACCOUNT BUTTON

*********************************************************/  
// Get the delete account button and the delete popup element
const deleteAccountButton = document.getElementById('delete-account');
const deletePopup = document.getElementById('delete-popup');

// Get the cancel and delete buttons inside the delete popup
const cancelDeleteButton = document.getElementById('cancel-delete');
const confirmDeleteButton = document.getElementById('confirm-delete');

// Add click event listener to the delete account button
deleteAccountButton.addEventListener('click', () => {
    // Show the delete confirmation popup
    deletePopup.style.visibility = 'visible';
});

// Add click event listener to the cancel delete button
cancelDeleteButton.addEventListener('click', () => {
    // Hide the delete confirmation popup
    deletePopup.style.visibility = 'hidden';
});

// Add click event listener to the confirm delete button
confirmDeleteButton.addEventListener('click', () => {
      deleteAccount('/delete', 'POST');
});

/*|*******************************************************

					RESERVATION BOXES

*********************************************************/  
/**
 *   ` Formats a 'YYYY-MM-DD' dates string into a localized date representation. 
 *   This function is used for the event listener attached to DOMContentLoaded.
 * 
 *   @param {string} dateString    The date string to be formatted in the 'YYYY-MM-DD' format.
 *   @returns {string}             The formatted date string in the localized format.
 */
function formatDate(dateString) {
	var date = new Date(dateString);
	var options = { weekday: 'long', month: 'long', day: 'numeric' };
	return date.toLocaleDateString('en-US', options);
}

// - Function to update the height of the main-container
function updateMainContainerHeight(height) {
	const mainContainer = document.getElementById('main-container');
    mainContainer.style.height =  `calc(100% + ${height*200}px)`;
}

/*|*******************************************************

					PROFILE INFORMATION

*********************************************************/  
/**
 *   ` Attaches an event listener to DOMContentLoaded event, which executes
 *   after the HTML file has been completely loaded. The event listener is
 *   used to generate the user information based on the user data provided.
 */
window.addEventListener('DOMContentLoaded', function() {

	var reservationContainer = document.getElementById('reservation-container');
	var currentDate = null;
	var mainContainerHeight = 0;

	reservations.forEach(reservation => {
        if( reservation.data.isAnonymous == false ) {
            // - Generate date boxes
            if( reservation.data.reservationDate !== currentDate ) {
                currentDate = reservation.data.reservationDate;

                var dateBox = document.createElement('div');
                dateBox.className = 'date-box';

                var dateText = document.createElement('span');
                dateText.className = 'date-text';
                dateText.textContent = formatDate(reservation.data.reservationDate); 

                dateBox.appendChild(dateText);
                reservationContainer.appendChild(dateBox);
                mainContainerHeight += 1;
            }

            // - Generate reservation boxes
            var reservationBox = document.createElement('div');
            reservationBox.classList.add('reservation-box');

            // - Generate laboratory image 
            var imageBox = document.createElement('div');
            imageBox.classList.add('image-box');

            // - Create lab image span
            var labImage = document.createElement('span');
            labImage.classList.add('lab-image');
            labImage.style.backgroundImage = `url('${reservation.imageURL}')`;
            imageBox.appendChild(labImage);

            var textBox = document.createElement('div');
            textBox.classList.add('text-box');

            // - Create the span element for the pop-up box button 
            var firstLine = document.createElement('span');
            firstLine.classList.add('first-line');
            firstLine.textContent = reservation.data.labName; 

            var secondLine = document.createElement('span');
            secondLine.classList.add('second-line');
            secondLine.textContent = 'Seat #' + reservation.data.seatNumber; 

            var timeBox = document.createElement('div');
            timeBox.classList.add('time-box');
            timeBox.textContent = reservation.data.startTime + ' - ' + reservation.data.endTime;
        
            textBox.appendChild(firstLine);
            textBox.appendChild(secondLine);

            reservationBox.appendChild(imageBox);
            reservationBox.appendChild(textBox);
            reservationBox.appendChild(timeBox);
            
            reservationContainer.appendChild(reservationBox);
            mainContainerHeight += 1;
        }
	})

    if( reservations.length <= 0 ) {
        var reservationBox = document.createElement('div');
        reservationBox.classList.add('reservation-box');
        reservationBox.innerHTML = '<p class = "last-line"> No Reservations </p>';
        reservationContainer.appendChild(reservationBox);
    }

	updateMainContainerHeight(mainContainerHeight);
});
