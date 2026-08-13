(function () {
  'use strict';

  const WIDTH = 1123;
  const HEIGHT = 794;
  const PDF_WIDTH_MM = 297;
  const PDF_HEIGHT_MM = 210;
  const YEAR = 2026;

  const params = new URLSearchParams(window.location.search);
  const eventSlug = params.get('event');
  const participantId = params.get('id');
  const config = getEventBySlug(eventSlug);

  const viewport = document.getElementById('certificate-viewport');
  const scaler = document.getElementById('certificate-scaler');
  const certificate = document.getElementById('certificate');
  const certificateError = document.getElementById('certificate-error');
  const downloadButton = document.getElementById('download-btn');
  const backSearch = document.getElementById('back-search');

  let currentParticipant = null;

  function el(tag, styles = {}, text = null) {
    const node = document.createElement(tag);
    Object.assign(node.style, styles);
    if (text !== null) node.textContent = text;
    return node;
  }

  function addEl(parent, tag, styles = {}, text = null) {
    const node = el(tag, styles, text);
    parent.appendChild(node);
    return node;
  }

  function applyCertificateScale() {
    const availableWidth = Math.min(window.innerWidth - 40, WIDTH);
    const scale = Math.min(1, Math.max(0.25, availableWidth / WIDTH));
    scaler.style.transform = `scale(${scale})`;
    viewport.style.height = `${HEIGHT * scale}px`;
  }

  function showError(message) {
    certificateError.textContent = message;
    certificateError.hidden = false;
    viewport.hidden = true;
    downloadButton.hidden = true;
  }

  function showCertificate() {
    certificateError.hidden = true;
    viewport.hidden = false;
    downloadButton.hidden = false;
  }

  function clearCertificate() {
    certificate.innerHTML = '';
  }

  function addCenteredText(parent, text, y, styles = {}) {
    return addEl(parent, 'div', {
      position: 'absolute',
      left: '0',
      top: `${y}px`,
      width: `${WIDTH}px`,
      textAlign: 'center',
      fontFamily: "Poppins, Arial, sans-serif",
      color: '#17251f',
      ...styles,
    }, text);
  }

  function addDescription(parent, config) {
    const group = addEl(parent, 'div', {
      position: 'absolute',
      left: '0',
      top: '0',
      width: `${WIDTH}px`,
      fontFamily: 'Poppins, Arial, sans-serif',
      fontSize: '14px',
      color: '#34414b',
      textAlign: 'center',
      lineHeight: '1.7',
    });

    // Baris 1
    const line1 = addEl(group, 'div', {
      position: 'absolute',
      top: '404px',
      left: '0',
      width: `${WIDTH}px`,
    });
    line1.appendChild(document.createTextNode('Telah mengikuti '));
    addEl(line1, 'span', {
      fontWeight: '700',
      color: '#1b2924',
    }, config.label);

    // Baris 2
    addEl(group, 'div', {
      position: 'absolute',
      top: '432px',
      left: '0',
      width: `${WIDTH}px`,
    }, 'yang diselenggarakan oleh TBM Kertas Pena Campagaya TBM KERTAS PENA Campagaya sebagai penerima Bantuan Pemerintah');

    // Baris 3
    const line3 = addEl(group, 'div', {
      position: 'absolute',
      top: '460px',
      left: '0',
      width: `${WIDTH}px`,
    });
    line3.appendChild(document.createTextNode('Bidang Kebahasaan dan Kesastraan: Fasilitasi Bagi Komunitas Literasi Tahun 2026 dengan judul kegiatan “'));
    addEl(line3, 'span', {
      fontWeight: '700',
      color: '#1b2924',
    }, 'GAKDE BACA; Gerakan Aktualisasi');

    // Baris 4
    const line4 = addEl(group, 'div', {
      position: 'absolute',
      top: '488px',
      left: '0',
      width: `${WIDTH}px`,
    });
    addEl(line4, 'span', {
      fontWeight: '700',
      color: '#1b2924',
    }, 'Komunitas Berdaya Dan Kreatif Berbasis Apresiasi ');
    addEl(line4, 'span', {
      fontWeight: '700',
      fontStyle: 'italic',
      color: '#1b2924',
    }, 'Caradde Ammaca');
    line4.appendChild(document.createTextNode('” pada tanggal '));
    addEl(line4, 'span', {
      fontWeight: '700',
      color: '#1b2924',
    }, config.date);

    // Baris 5
    const line5 = addEl(group, 'div', {
      position: 'absolute',
      top: '516px',
      left: '0',
      width: `${WIDTH}px`,
    });
    line5.appendChild(document.createTextNode('di '));
    addEl(line5, 'span', {
      fontWeight: '700',
      color: '#1b2924',
    }, config.location);

    return group;
  }

  function renderCertificate(person) {
      clearCertificate();

      certificate.style.position = 'relative';
      certificate.style.width = `${WIDTH}px`;
      certificate.style.height = `${HEIGHT}px`;
      certificate.style.overflow = 'hidden';

      // Background
      const bg = addEl(certificate, 'img', {
        position: 'absolute',
        left: '0',
        top: '0',
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        objectFit: 'fill',
      });
      bg.src = config.background;

      // Nomor sertifikat
      addCenteredText(
        certificate,
        `Nomor: ${person.nomor}/${config.code}/TBM-KERTAS_PENA/GAKDE-BACA/VII/2026`,
        225,
        {
          fontSize: '18px',
          fontWeight: '700',
          color: '#222b33',
        }
      );

      // Judul
      addCenteredText(certificate, 'Diberikan kepada:', 272, {
        fontSize: '21px',
        color: '#3b4650',
      });

      // Nama
      addCenteredText(certificate, String(person.nama).toUpperCase(), 306, {
        fontSize: '42px',
        fontFamily: "'Gemunu Libre', 'Times New Roman', serif",
        fontWeight: '800',
        color: '#17251f',
      });

      // Utusan
      addCenteredText(certificate, `Utusan: ${person.utusan}`, 350, {
        fontSize: '22px',
        color: '#3e4a53',
      });

      // Deskripsi
      addDescription(certificate, config);

      // Signature group
      const signatureGroup = addEl(certificate, 'div', {
        position: 'absolute',
        left: '741px',
        top: '530px',
        width: '340px',
        height: '160px',
        textAlign: 'center',
      });

      // Logo / cert image
      const cert = addEl(signatureGroup, 'img', {
        position: 'absolute',
        left: '-480px',
        top: '-430px',
        width: '590px',
        zIndex: '2',
      });
      cert.src = '../assets/logo/cert.png';

      // Tanda tangan
      const ttd = addEl(signatureGroup, 'img', {
        position: 'absolute',
        left: '-350px',
        top: '20px',
        width: '340px',
        zIndex: '3',
      });
      ttd.src = '../assets/ttd/ttd.png';

      certificate.setAttribute('aria-label', `Sertifikat ${person.nama}`);
    }

  async function loadParticipant() {
    if (!config || !participantId) {
      showError('Nama peserta tidak ditemukan pada kegiatan yang dipilih.');
      return;
    }

    try {
      const response = await fetch(config.data);
      if (!response.ok) throw new Error('Data peserta gagal dimuat.');

      const participants = await response.json();
      const person = Array.isArray(participants)
        ? participants.find((item) => String(item.nomor) === String(participantId))
        : null;

      if (!person) {
        showError('Nama peserta tidak ditemukan pada kegiatan yang dipilih.');
        return;
      }

      currentParticipant = person;
      renderCertificate(person);

      backSearch.href = `../search/search.html?${new URLSearchParams({ event: eventSlug })}`;
      showCertificate();
    } catch (error) {
      console.error(error);
      showError('Nama peserta tidak ditemukan pada kegiatan yang dipilih.');
    }
  }


  const overlay = document.getElementById('download-overlay');
  const progressFill = document.getElementById('download-progress');
  const progressPercent = document.getElementById('download-percent');
  const statusText = document.getElementById('download-status');

  let progressTimer = null;

  function showDownloadProgress() {
    clearInterval(progressTimer);

    overlay.hidden = false;
    progressFill.style.width = '0%';
    progressPercent.textContent = '0%';
    statusText.textContent = 'Menyiapkan sertifikat...';

    let progress = 0;

    progressTimer = setInterval(() => {
      if (progress < 88) {
        progress += Math.random() * 8 + 2;
        progress = Math.min(progress, 88);
        progressFill.style.width = `${progress}%`;
        progressPercent.textContent = `${Math.floor(progress)}%`;

        if (progress > 30) statusText.textContent = 'Merender sertifikat...';
        if (progress > 70) statusText.textContent = 'Membuat file PDF...';
      }
    }, 180);
  }

  function finishDownloadProgress() {
    clearInterval(progressTimer);

    progressFill.style.width = '100%';
    progressPercent.textContent = '100%';
    statusText.textContent = 'Selesai!';

    return new Promise(resolve => {
      setTimeout(() => {
        overlay.hidden = true;
        resolve();
      }, 700);
    });
  }

  function hideDownloadProgress() {
    clearInterval(progressTimer);
    overlay.hidden = true;
  }


    function safeFilePart(value) {
      return String(value || 'peserta')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase() || 'peserta';
    }

    async function downloadPdf() {
      if (!currentParticipant) return;

      if (typeof window.html2canvas !== 'function') {
        showError('html2canvas belum siap. Pastikan html2canvas.min.js berhasil dimuat.');
        return;
      }
      if (!window.jspdf || typeof window.jspdf.jsPDF !== 'function') {
        showError('jsPDF belum siap. Pastikan jspdf.umd.min.js berhasil dimuat.');
        return;
      }

      downloadButton.disabled = true;
      downloadButton.textContent = 'Menyiapkan PDF...';
      showDownloadProgress();

      try {
        await document.fonts.ready;
        await new Promise(resolve => requestAnimationFrame(resolve));

        const canvas = await window.html2canvas(certificate, {
          scale: 3,
          useCORS: true,
          backgroundColor: null,
          width: WIDTH,
          height: HEIGHT,
        });

        const imgData = canvas.toDataURL('image/png');

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
          compress: true,
        });

        pdf.addImage(imgData, 'PNG', 0, 0, PDF_WIDTH_MM, PDF_HEIGHT_MM);

        const safeName = safeFilePart(currentParticipant.nama);
        pdf.save(`sertifikat-${safeName}-${eventSlug}.pdf`);

        await finishDownloadProgress();

      } catch (error) {
        console.error(error);
        hideDownloadProgress();
        showError('Sertifikat gagal dibuat menjadi PDF.');
      } finally {
        downloadButton.disabled = false;
        downloadButton.textContent = 'Download Sertifikat';
      }
    }

    window.addEventListener('resize', applyCertificateScale);
    downloadButton.addEventListener('click', downloadPdf);

    applyCertificateScale();
    loadParticipant();
  })();