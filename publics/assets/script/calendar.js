document.addEventListener('DOMContentLoaded', function () {
    var Calendar = FullCalendar.Calendar;
    var calendars = {};
    var terrainIds = ['terrain1', 'terrain2', 'terrain3', 'terrain4'];

    terrainIds.forEach(function(terrain) {
        var calendarEl = document.getElementById(`calendar-${terrain}`);
        var calendar = new Calendar(calendarEl, {
            locale: 'fr',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridWeek,timeGridDay'
            },
            initialView: 'timeGridWeek',
            selectable: true,
            height: "auto",
            editable: true,
            firstDay: 1,
            expandRows: true,
            handleWindowResize: true,
            slotMinTime: '08:00:00',
            slotMaxTime: '23:00:00',
            slotDuration: '01:00:00',
            select: function(info) {
                const reservationData = {
                    terrainId: terrain,
                    start: info.startStr,
                    end: info.endStr,
                    title: `Réservé sur ${terrain}`
                };

                fetch('http://localhost:3000/reserve', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reservationData),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur réseau');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.message) {
                        calendar.addEvent({
                            start: info.start,
                            end: info.end,
                            color: 'green',
                            rendering: 'inverse-background',
                            allDay: false,
                            title: reservationData.title
                        });
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de l\'enregistrement de la réservation:', error);
                    alert("Une erreur est survenue lors de l'enregistrement de la réservation.");
                });
            },
        });

        calendars[terrain] = calendar;
        calendar.render();
    });

    // Fonction pour charger les réservations existantes
    function loadReservations(terrain) {
        fetch(`http://localhost:3000/getReservations`) // Assurez-vous que l'URL est correcte
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
                            color: reservation.color, // Utilisez la couleur définie dans le serveur
                        });
                    }
                });
            })
            .catch(error => {
                console.error('Erreur lors du chargement des réservations:', error);
            });
    }

    // Charge les réservations pour chaque terrain lors de l'initialisation
    terrainIds.forEach(function(terrain) {
        loadReservations(terrain);
    });

    // Gestion du changement de terrain
    var terrainSelect = document.getElementById('terrain-select');
    terrainSelect.addEventListener('change', function() {
        var selectedTerrain = terrainSelect.value;
        terrainIds.forEach(function(terrain) {
            var calendarDiv = document.getElementById(`calendar-${terrain}`);
            calendarDiv.style.display = (terrain === selectedTerrain) ? 'block' : 'none';
        });
    });

    // Initialiser pour afficher seulement le premier terrain
    terrainIds.forEach(function(terrain) {
        var calendarDiv = document.getElementById(`calendar-${terrain}`);
        calendarDiv.style.display = (terrain === terrainIds[0]) ? 'block' : 'none';
    });
});
