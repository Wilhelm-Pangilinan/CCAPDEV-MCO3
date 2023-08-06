/*

    HTTP Requests:
    1. Login Page
        a.) Add a success and error message for LOGIN 
        b.) Add a success and error message for REGISTER

    2. Sidebar - replace navigateToPage() with an appropriate HTTP request
        a.) Profile
        b.) Dashboard
        c.) Laboratory
        d.) Reservation 
        e.) Logout 

    3. Profile - should perform a GET request based on the user ID. The client
        should not receive the email, password, and the private reservations of 
        the user.

    4. Dashboard
        a.) should perform a GET request based ONLY on the logged in user.
        b.) should perform a DELETE request and POST request for the delete and update reservation
    
    5. Laboratory - should perform a GET request for all the available laboratories.

    
    LOGIN:
    - Set up the HTTP requests properly
    - Add a success and error message for LOGIN and REGISTER

    RESERVATION:
    - Append the reservation details to the TIMESLOTS so it sends a request to a Student's profile
    - The time slots should show up as green if the user has a current reservation
    - (BONUS) The seats should transition from gray to red

    DASHBOARD:
    - Allow a user to delete their reservations
    - (BONUS) Allow users to add a description

*/