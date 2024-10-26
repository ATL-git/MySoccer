document.addEventListener('DOMContentLoaded', function () {
    const Calendar = FullCalendar.Calendar;
    const calendars = {};
    const terrainIds = ['terrain1', 'terrain2', 'terrain3', 'terrain4'];
    let user;

    function initializeCalendars() {
        terrainIds.forEach(function (terrain) {
            const calendarEl = document.getElementById(`calendar-${terrain}`);
            const calendar = new Calendar(calendarEl, {
                locale: 'fr',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay'
                },
                initialView: 'timeGridWeek',
                selectable: true,
                height: 'auto',
                editable: false,
                firstDay: 1,
                expandRows: true,
                handleWindowResize: true,
                slotMinTime: '08:00:00',
                slotMaxTime: '23:00:00',
                slotDuration: '01:00:00',
                select: function (info) {
                    const reservationTitle = user.role === 'Admin' ? 'réservation impossible' : `Réservé par ${user.firstname}`;
                    const reservationData = {
                        terrainId: terrain,
                        start: info.startStr,
                        end: info.endStr,
                        title: reservationTitle
                    };
                    if (confirm(`Voulez-vous vraiment réserver de ${info.start.toLocaleString()} à ${info.end.toLocaleString()} ?`)) {
                        fetch('http://aurelien-maureau.ri7.tech:83/reserve', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(reservationData),
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('une erreur est survenue');
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.message) {
                                const eventColor = user.role === 'Admin' ? 'red' : 'green';
                                calendar.addEvent({
                                    start: info.start,
                                    end: info.end,
                                    color: eventColor,
                                    rendering: 'inverse-background',
                                    allDay: false,
                                    title: reservationData.title
                                });
                                alert(data.message);
                            }
                        })
                        .catch(error => {
                            console.error('Erreur lors de l\'enregistrement de la réservation:', error);
                            alert("Une erreur est survenue");
                        });
                    }
                },
                eventContent: function (resa) {
                    const eventElement = document.createElement('div');
                    eventElement.innerHTML = `<b>${resa.event.title}</b>`;
                    if (user.role === 'Admin') {
                        const deleteButton = document.createElement('button');
                        deleteButton.innerHTML = 'Supprimer';
                        deleteButton.classList.add('delete-btn');
                        deleteButton.addEventListener('click', function () {
                            if (confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
                                deleteReservation(resa.event.id);
                            }
                        });
                        eventElement.appendChild(deleteButton);
                    }
                    return { domNodes: [eventElement] };
                }
            });
            calendars[terrain] = calendar;
            calendar.render();
            loadReservations(terrain);
        });
    }

    function loadReservations(terrain) {
        fetch('http://aurelien-maureau.ri7.tech:83/getReservations')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau lors du chargement des réservations');
                }
                return response.json();
            })
            .then(reservations => {
                reservations.forEach(reservation => {
                    if (reservation.terrainId === terrain) {
                        calendars[terrain].addEvent({
                            id: reservation.id,
                            start: reservation.start,
                            end: reservation.end,
                            title: reservation.title,
                            color: reservation.color,
                        });
                    }
                });
            })
            .catch(error => {
                console.error('Erreur lors du chargement des réservations:', error);
            });
    }

    function deleteReservation(reservationId) {
        fetch(`http://aurelien-maureau.ri7.tech:83/deleteReservation/${reservationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau lors de la suppression de la réservation');
                }
                return response.json();
            })
            .then(data => {
                alert(data.message);
                Object.values(calendars).forEach(calendar => {
                    const event = calendar.getEventById(reservationId);
                    if (event) {
                        event.remove();
                    }
                });
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de la réservation:', error);
                alert("Une erreur est survenue lors de la suppression de la réservation.");
            });
    }

    fetch('http://aurelien-maureau.ri7.tech:83/getUser')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur réseau lors de la récupération du rôle');
            }
            return response.json();
        })
        .then(data => {
            user = data.user;    
            initializeCalendars();
        })
        .catch(error => {
            console.error('Erreur lors de la récupération du rôle de l\'utilisateur:', error);
        });

    const terrainSelect = document.getElementById('terrain-select');
    terrainSelect.addEventListener('change', function () {
        const selectedTerrain = terrainSelect.value;
        terrainIds.forEach(function (terrain) {
            const calendarDiv = document.getElementById(`calendar-${terrain}`);
            if (terrain === selectedTerrain) {
                calendarDiv.style.display = 'block';
                calendars[terrain].updateSize(); // Met à jour la taille du calendrier visible
            } else {
                calendarDiv.style.display = 'none';
            }
        });
    });

    terrainIds.forEach(function (terrain, index) {
        const calendarDiv = document.getElementById(`calendar-${terrain}`);
        calendarDiv.style.display = (index === 0) ? 'block' : 'none'; // Affiche le premier calendrier par défaut
    });
});
