
var prevStartTime, prevEndTime;
for(const timeSlot of timeSlots) {
    try {
        const reservationStartTime = timeSlot.startTime;
        const reservationEndTime = calculateEndTime(timeSlot.startTime);

        // Check if the current reservation overlaps with the previous reservation
        if (prevStartTime && reservationStartTime <= prevEndTime) {
            // There is an overlap, update the existing reservation instead of creating a new one
            const existingReservation = await Reservation.findOne({ endTime: prevStartTime });
            if (existingReservation) {
                // Update the fields of the existing reservation
                existingReservation.endTime = reservationEndTime;
                existingReservation.requestDate = new Date();
                await existingReservation.save();
                console.log("Existing reservation updated.");
            }
        } else {
            // No overlap, create a new reservation
            const reservation = new Reservation({
                labName: laboratory.name,
                labRef: laboratory._id,
                studentID: student.id,
                studentRef: student._id,
                seatNumber: timeSlot.seatNumber,
                reservationDate: date,
                startTime: reservationStartTime,
                endTime: reservationEndTime,
                requestDate: new Date(),
                isAnonymous: isAnonymousValue
            });

            await reservation.save();

            if (reservation) {
                console.log("Reservation added in reservations collection.");
                const reservationIdString = reservation._id.toString();

                // Add the reservation reference to the Laboratory document if not already present
                if (!laboratory.reservationsRef.includes(reservationIdString)) {
                    laboratory.reservationsRef.push(reservation._id);
                    await laboratory.save();
                    console.log("Reservation added in", laboratory.name);
                } else {
                    console.log("Reservation already referenced in laboratory");
                }

                // Add the reservation reference to the Student document if not already present
                if (!student.reservationsRef.includes(reservationIdString)) {
                    student.reservationsRef.push(reservation._id);
                    await student.save();
                    console.log("Reservation added in", student.name);
                } else {
                    console.log("Reservation already referenced in student");
                }
            }
        }

        // Update the previous start and end times for the next iteration
        prevStartTime = reservationStartTime;
        prevEndTime = reservationEndTime;
    } catch (error) {
        console.log(error);
    }
}
