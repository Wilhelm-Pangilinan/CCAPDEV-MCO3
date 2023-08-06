
/*|*******************************************************

					 SIDEBAR BUTTONS

*********************************************************/  
function navigateToPage(url) {
	window.location.href = url; 
}

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

function formatDateDetails(dateString) {
	var date = new Date(dateString);
	var month = date.toLocaleString('en-US', { month: 'long' });
	var day = date.getDate();
	var year = date.getFullYear();
	var hours = date.getHours().toString().padStart(2, '0');
	var minutes = date.getMinutes().toString().padStart(2, '0');
	var seconds = date.getSeconds().toString().padStart(2, '0');
  
	return `${month} ${day}, ${year}, ${hours}:${minutes}:${seconds}`;
  }
  

// - Function to update the height of the main-container
function updateMainContainerHeight(height) {
	const mainContainer = document.getElementById('main-container');
    mainContainer.style.height =  `calc(100% + ${height*200}px)`;
}

/*|*******************************************************

					POP-UP BOXES

*********************************************************/ 
function createModal(reservation) {
	var overlay = document.createElement('div');
	overlay.setAttribute('id', 'overlay');
	overlay.addEventListener('click', () => {
		modal.classList.remove('active');
		overlay.classList.remove('active');
	});

	var modal = document.createElement('div');
	modal.classList.add('modal');
	modal.setAttribute('id', 'modal');

	var modalHeader = document.createElement('div');
	modalHeader.classList.add('modal-header');

	var titleDiv = document.createElement('div');
	titleDiv.classList.add('title');
	titleDiv.textContent = reservation.data.labName;

	var closeButton = document.createElement('button');
	closeButton.setAttribute('data-close-button', '');
	closeButton.classList.add('close-button');
	closeButton.innerHTML = '&times;';
	closeButton.addEventListener('click', () => {
		modal.classList.remove('active');
		overlay.classList.remove('active');
	});

	var modalBody = document.createElement('div');
	modalBody.classList.add('modal-body');
	modalBody.innerHTML = `
		<span class = "modal-text"> Seat Number: </span> ${reservation.data.seatNumber} <br>
		<span class = "modal-text"> Date of Reservation: </span> ${formatDate(reservation.data.reservationDate)} <br>
		<span class = "modal-text"> Time of Reservation: </span> 
		${reservation.data.startTime}  - ${reservation.data.endTime}
		<br> <br> 
		<span class = "modal-text"> Date of Request: </span> ${formatDateDetails(reservation.data.requestDate)} <br>
	`;
	
	console.log( reservation.data.requestDate );
	console.log( formatDateDetails(reservation.data.requestDate) );

	modalHeader.appendChild(titleDiv);
	modalHeader.appendChild(closeButton);
	modal.appendChild(modalHeader);
	modal.appendChild(modalBody);

	document.body.appendChild(overlay);
	document.body.appendChild(modal);

	overlay.classList.add('active');
	modal.classList.add('active');

	return modal;
}


/*|*******************************************************

					RESERVATION BOXES

*********************************************************/  
/**
 *   ` Attaches an event listener to DOMContentLoaded event, which executes
 *   after the HTML file has been completely loaded. The event listener is
 *   used to generate the date and reservations dynamically based on the data
 *   provided in the reservations array.
 * 
 *   TL;DR Generates the reservation boxes after the HTML file is loaded
 */
window.addEventListener('DOMContentLoaded', function() {
	var reservationContainer = document.getElementById('reservation-container');
	var currentDate = null;
	var mainContainerHeight = 0;

	reservations.forEach(reservation => {
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

		firstLine.addEventListener('click', () => {
			var modal = createModal(reservation);
			modal.classList.add('active');
		});
		
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
	})

	// - Generate the last reservation box ('Reserve A Seat')
	var reservationBox = document.createElement('div');
	reservationBox.classList.add('reservation-box');
	reservationBox.innerHTML = '<p class = "last-line"> RESERVE A SEAT </p>';
	reservationBox.addEventListener('click', () => {
		navigateToPage('/laboratory');
	});
	reservationContainer.appendChild(reservationBox);
	updateMainContainerHeight(mainContainerHeight);
});
