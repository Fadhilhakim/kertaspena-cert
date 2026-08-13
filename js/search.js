(function () {
  const params = new URLSearchParams(window.location.search);
  const eventSlug = params.get('event');
  const eventConfig = getEventBySlug(eventSlug);
  const context = document.getElementById('event-context');
  const input = document.getElementById('participant-search');
  const results = document.getElementById('results');
  const selection = document.getElementById('selection');
  const selectedName = document.getElementById('selected-name');
  const selectedRepresentative = document.getElementById('selected-representative');
  const certificateButton = document.getElementById('certificate-btn');
  const pageError = document.getElementById('page-error');

  let participants = [];
  let selected = null;

  function showError(message) {
    pageError.textContent = message;
    pageError.hidden = false;
  }

  function hideError() {
    pageError.hidden = true;
    pageError.textContent = '';
  }

  function renderResults(items) {
    results.replaceChildren();
    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = input.value.trim() ? 'Peserta tidak ditemukan. Coba kata kunci lain.' : 'Mulai ketik nama peserta untuk mencari.';
      results.appendChild(empty);
      return;
    }
    items.forEach((person) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'result-item';
      button.innerHTML = `<span class="result-name"></span><span class="result-meta"></span>`;
      button.querySelector('.result-name').textContent = person.nama;
      button.querySelector('.result-meta').textContent = person.utusan;
      button.addEventListener('click', () => selectParticipant(person));
      results.appendChild(button);
    });
  }

  function selectParticipant(person) {
    selected = person;
    selectedName.textContent = person.nama;
    selectedRepresentative.textContent = `Utusan: ${person.utusan}`;
    selection.hidden = false;
  }

  input.addEventListener('input', () => {
    hideError();
    selected = null;
    selection.hidden = true;
    const query = input.value.trim().toLocaleLowerCase('id-ID');
    const filtered = query ? participants.filter((person) => person.nama.toLocaleLowerCase('id-ID').includes(query)) : [];
    renderResults(filtered);
  });

  certificateButton.addEventListener('click', () => {
    if (!eventConfig) return;
    if (!selected) {
      showError('Nama peserta wajib dipilih.');
      return;
    }
    window.location.href = `../sertifikat/sertifikat.html?event=${encodeURIComponent(eventSlug)}&id=${encodeURIComponent(selected.nomor)}`;
  });

  if (!eventConfig) {
    context.textContent = 'Kegiatan tidak valid.';
    showError('Kegiatan tidak ditemukan. Silakan kembali dan pilih kegiatan yang tersedia.');
    input.disabled = true;
    renderResults([]);
    return;
  }

  context.textContent = `${eventConfig.label} • ${eventConfig.date}`;

  fetch(eventConfig.data)
    .then((response) => {
      if (!response.ok) throw new Error('Data peserta gagal dimuat.');
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) throw new Error('Format data peserta tidak valid.');
      participants = data;
      renderResults([]);
    })
    .catch((error) => {
      console.error(error);
      showError('Data peserta tidak dapat dimuat. Silakan coba lagi.');
    });
})();
