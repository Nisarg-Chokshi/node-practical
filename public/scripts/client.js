document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('actionModal');
  const openModalBtn = document.querySelector('.open-modal-btn');
  const acceptButton = document.getElementById('acceptButton');
  const rejectButton = document.getElementById('rejectButton');
  const remarksInput = document.getElementById('remarks');

  openModalBtn.addEventListener('click', function () {
    console.log('openModalBtn clicked');
    modal.style.display = 'block';
  });

  acceptButton.addEventListener('click', function () {
    //TODO: API call to accept ticket with remarks
    fetch(`/api/acceptTicket`, { method: 'POST' })
      .then((response) => {
        if (response.ok) {
        } else {
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    modal.style.display = 'none';
  });

  rejectButton.addEventListener('click', function () {
    //TODO: API call to reject ticket with remarks
    fetch(`/api/rejectTicket`, { method: 'POST' })
      .then((response) => {
        if (response.ok) {
        } else {
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});
