/*|*******************************************************

                     SIDEBAR BUTTONS

*********************************************************/  
function navigateToPage(url) {
    window.location.href = url; 
}

/*|*******************************************************

                        RESERVATION

*********************************************************/  
function getRandomInt(min, max) {
    min = Math.ceil(min); 
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function checkTimeSlots() {
    var timeSlots = document.querySelectorAll('.timeslot-container input[type="checkbox"]');
    var allChecked = true;

    timeSlots.forEach(function(checkbox) {
        if (!checkbox.checked) {
            allChecked = false;
        }
    });

    if( allChecked ) {
        alert("All time slots are checked!");
    } else {
        alert("Some time slots are not checked!");
    }
}

function convertMinutesToTime(minutes) {
    var hours = Math.floor(minutes / 60);
    var minutesRemainder = minutes % 60;
  
    var formattedHours = String(hours).padStart(2, '0');
    var formattedMinutes = String(minutesRemainder).padStart(2, '0');
  
    return formattedHours + ':' + formattedMinutes;
}

function isCheckTimeWithinRange(startTime, endTime, checkTime) {
    if( checkTime >= startTime && checkTime < endTime ) {
        return true;
    }
}

/*|*******************************************************

                        MODAL

*********************************************************/  
function openModal() {
    const modal = document.getElementById("confirmModal");
    modal.style.display = "block";
}
  
function closeModal() {
    const modal = document.getElementById("confirmModal");
    modal.style.display = "none";
}
  
function confirmReservation() {
    console.log("Reservation confirmed!");
    closeModal();
}
/*|*******************************************************

                        SEATS

*********************************************************/  
window.addEventListener('DOMContentLoaded', function() {

    // - Parse the required data
    const laboratory = JSON.parse(laboratoryData);
    const reservations = JSON.parse(reservationsData);
    const student = JSON.parse(studentReservationsData);

    var seatContainer = document.getElementById('lab-seats');
    var seatCounter = 1;
    const baseTimeInMin = 450;    

    // - Generate row boxes
    for( let i = 0; i < laboratory.col; i++ ) {
        var rowBoxes = document.createElement('div');
        rowBoxes.className = 'row-box';

        // - Generate seats
        for( let j = 0; j < laboratory.row; j++ ) {
            var seatBoxes = document.createElement('div');
            seatBoxes.className = 'seat-box';
            seatBoxes.innerHTML =  i * laboratory.row + j + 1;
            seatCounter++;

            // - Seatboxes Event Listener
            seatBoxes.addEventListener('click', function()  {
                var timeSlotContainer = document.getElementById('timeslot-container');
                timeSlotContainer.innerHTML = '';
                
                // - Update seat number label:
                var seatLabel = document.getElementById('seat-number-label');
                seatLabel.innerHTML = `Seat Number: ${ i * laboratory.row + j + 1}`;

                // - Get the required data
                const dateInput = document.getElementById("date-input").value;
                
                // - Get all the reserved time slots of the lab for the current date
                const dateReservations = [];
                reservations.forEach((reservation) => {
                    const reservationDate = reservation.reservationDate;
                    const parsedDate = new Date(reservationDate);
                    const formattedDate = parsedDate.toISOString().split('T')[0];

                    if( formattedDate === dateInput ) {
                        dateReservations.push(reservation);
                    }
                });

                // - Get all the reserved time slots of the student for the current date
                const studentReservations = [];
                student.forEach((reservation) => {
                    const reservationDate = reservation.reservationDate;
                    const parsedDate = new Date(reservationDate);
                    const formattedDate = parsedDate.toISOString().split('T')[0];

                    if( formattedDate === dateInput ) {
                        studentReservations.push(reservation);
                    }                
                })

                // - Display all the time slots
                for( let timeIndex = 0; timeIndex < 19; timeIndex++ ) {

                    // - Find the time in hours and minutes
                    var baseStartTime = baseTimeInMin + (30 * timeIndex);
                    var hours = Math.floor(baseStartTime / 60);
                    var minutes = baseStartTime % 60;
                    var checkTime = hours.toString() + minutes.toString().padStart(2, '0');;
                    
                    // - Time to be displayed
                    var startTime = convertMinutesToTime(baseStartTime);
                    var endTime = convertMinutesToTime(baseTimeInMin + (30*(1 + timeIndex)));

                    // - Create label and container
                    var timeSlotBox = document.createElement('div');
                    var timeSlotLabel = document.createElement('label');
                    timeSlotLabel.className = 'timeslot-label';
                    timeSlotLabel.textContent = startTime + " - " + endTime;

                    // - Find if the time slot exists
                    var timeSlotReservation = null;
                    var startTimeCheck, endTimeCheck;
                    dateReservations.forEach( reservation => {
                        const doesStartTimeMatch = reservation.startTime.toString() === checkTime;
                        const currentSeatNumber = i * laboratory.row + j + 1;
                        const doesSeatNumberMatch = reservation.seatNumber === currentSeatNumber;
                        if( doesStartTimeMatch && doesSeatNumberMatch ) {
                            timeSlotReservation = reservation;
                            startTimeCheck = reservation.startTime;
                            endTimeCheck = reservation.endTime;
                        }
                    });
                    
                    var detailsLink = document.createElement('a');
                    detailsLink.className = "details-link";

                    if( timeSlotReservation === undefined || timeSlotReservation === null ) {
                        timeSlotBox.innerHTML = '<input type = "checkbox" name = "seat-time-' + (i * laboratory.row + j + 1) + '-' + checkTime + '">';
                        timeSlotBox.className = 'timeslot-box';
                    } else {
                        timeSlotBox.innerHTML = '<input type = "checkbox" disabled>';
                        timeSlotBox.className = 'timeslot-box';
                        timeSlotBox.style.backgroundColor = 'red';
                        if( timeSlotReservation.isAnonymous ) {
                            detailsLink.textContent = "Anonymous";
                        } else {
                            detailsLink.href = `/profile?studentID=${timeSlotReservation.studentID}`;
                            detailsLink.textContent = timeSlotReservation.studentID;
                        }
                        detailsLink.style.display = "block";
                    }
                    
                    if( isCheckTimeWithinRange( startTimeCheck, endTimeCheck, (hours*100) + minutes) ) {
                        timeSlotBox.innerHTML = '<input type = "checkbox" disabled>';
                        timeSlotBox.style.backgroundColor = 'red';
                    }

                    timeSlotBox.appendChild(detailsLink);
                    timeSlotBox.appendChild(timeSlotLabel);
                    timeSlotContainer.appendChild(timeSlotBox);
                }

                // - Append confirm reservation
                var confirmButtonBox = document.getElementById('confirm-button-box');
                confirmButtonBox.innerHTML = "";
                var confirmButton = document.createElement('button');
                confirmButton.id = 'confirm-button';
                confirmButton.innerHTML = "Confirm Reservation";

                var confirmButtonBox = document.getElementById('confirm-button-box');
                confirmButtonBox.appendChild( confirmButton );
            });
            rowBoxes.appendChild(seatBoxes);
        }
        seatContainer.appendChild(rowBoxes);
    }
});

/*
window.addEventListener('DOMContentLoaded', function() {

    // - Get required data from the div blocks
    const laboratory = JSON.parse(document.getElementById('laboratory-data').getAttribute('laboratory-data'));
    const reservations = JSON.parse(document.getElementById('reservations-data').getAttribute('reservations-data')); 

    // - Retrieve the HTML objects
    var labSeats = document.getElementById('lab-seats');
    var timeSlotContainer = document.getElementById('time-slot-container');
    var seatLabel = document.getElementById('seat-number-label');
    var dateInput = document.getElementById('date-input');

    // - Variables
    const baseTimeInMin = 450;

    // - Generate row boxes
    for( let i = 0; i < laboratory.col; i++ ) {
        var rowBoxes = document.createElement('div');
        rowBoxes.className = 'row-box';

        // - Generate seats 
        for( let j = 0; j < laboratory.row; j++ ) {

            // - Seat number
            var seatNumber = i * laboratory.row + j + 1;

            // - Create seatboxes
            var seatBoxes = document.createElement('div');
            seatBoxes.className = 'seat-box';
            seatBoxes.innerHTML = seatNumber;

            // - Create event listener for each seatbox
            seatBoxes.addEventListener( 'click', function() {
                timeSlotContainer.innerHTML = '';                           // reset time slot container
                seatLabel.innerHTML = `Seat Number: ${ seatNumber }`;       // update seat number label
                var currentDate = dateInput.value;                          // get the current date
                const dateReservations = [];                                // reservation array
                
                // - Get all reserved timeslots based on the current date and the current seat
                reservations.forEach( (reservation) => {
                    var reservationDate = reservation.reservationDate;
                    const parsedDate = new Date(reservationDate);
                    const formattedDate = parsedDate.toISOString().split('T')[0];

                    if( formattedDate === dateInput ) {
                        dateReservations.push(reservation);
                    }
                });

                // - Display all the time slots
                for( let timeIndex = 0; timeIndex < 19; timeIndex++ ) {

                    // - Find the time in hours and minutes
                    var baseStartTime = baseTimeInMin + (30 * timeIndex);
                    var hours = Math.floor(baseStartTime / 60);
                    var minutes = baseStartTime % 60;
                    var checkTime = hours.toString() + minutes.toString().padStart(2, '0');;
                    
                    // - Time to be displayed
                    var startTime = convertMinutesToTime(baseStartTime);
                    var endTime = convertMinutesToTime(baseTimeInMin + (30*(1 + timeIndex)));

                    // - Create label and container
                    var timeSlotBox = document.createElement('div');
                    var timeSlotLabel = document.createElement('label');
                    timeSlotLabel.className = 'timeslot-label';
                    timeSlotLabel.textContent = startTime + " - " + endTime;

                    // - Find if the time slot exists
                    var timeSlotReservation = null;
                    var startTimeCheck, endTimeCheck;
                    dateReservations.forEach( reservation => {
                        const doesStartTimeMatch = reservation.startTime.toString() === checkTime;
                        const currentSeatNumber = i * laboratory.row + j + 1;
                        const doesSeatNumberMatch = reservation.seatNumber === currentSeatNumber;
                        if( doesStartTimeMatch && doesSeatNumberMatch ) {
                            timeSlotReservation = reservation;
                            startTimeCheck = reservation.startTime;
                            endTimeCheck = reservation.endTime;
                        }
                    });
                    
                    if( timeSlotReservation === undefined || timeSlotReservation === null ) {
                        timeSlotBox.innerHTML = '<input type = "checkbox" name = "seat-time-' + (i * laboratory.row + j + 1) + '-' + checkTime + '">';
                        timeSlotBox.className = 'timeslot-box';
                    } else {
                        timeSlotBox.innerHTML = '<input type = "checkbox" disabled>';
                        timeSlotBox.className = 'timeslot-box';
                        timeSlotBox.style.backgroundColor = 'red';
                    }
                    
                    if( isCheckTimeWithinRange( startTimeCheck, endTimeCheck, (hours*100) + minutes) ) {
                        timeSlotBox.innerHTML = '<input type = "checkbox" disabled>';
                        timeSlotBox.style.backgroundColor = 'red';
                    }

                    timeSlotBox.appendChild(timeSlotLabel);
                    timeSlotContainer.appendChild(timeSlotBox);
                }

                // - Append confirm reservation
                var confirmButtonBox = document.getElementById('confirm-button-box');
                confirmButtonBox.innerHTML = "";
                var confirmButton = document.createElement('button');
                confirmButton.id = 'confirm-button';
                confirmButton.innerHTML = "Confirm Reservation";

                var confirmButtonBox = document.getElementById('confirm-button-box');
                confirmButtonBox.appendChild( confirmButton );
            });
            rowBoxes.appendChild(seatBoxes);
        }
        labSeats.appendChild(rowBoxes);
    }
});
*/