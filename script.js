/**
 * LUXURY WEDDING INVITATION - JAVASCRIPT LOGIC
 * Features:
 * 1. Dynamic Guest Name URL Parser (?to=NamaTamu)
 * 2. Autoplay Bypass on "Buka Undangan" Click
 * 3. Interactive Floating Vinyl Audio Player with Spin & State Control
 * 4. Real-time Wedding Countdown Timer
 * 5. Clipboard Copy with Toast Feedback for Bank Accounts & Addresses
 * 6. Gallery Lightbox Preview
 * 7. Dynamic RSVP & Instant Wishes Feed
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ===================================================================
       1. DYNAMIC GUEST NAME (?to=NamaTamu)
       =================================================================== */
    const initGuestName = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const guestNameParam = urlParams.get('to');
        const guestNameElement = document.getElementById('guest-name');
        const rsvpNameInput = document.getElementById('rsvpName');

        if (guestNameParam && guestNameParam.trim() !== '') {
            const formattedName = decodeURIComponent(guestNameParam.replace(/\+/g, ' ')).trim();
            if (guestNameElement) {
                guestNameElement.textContent = formattedName;
            }
            if (rsvpNameInput) {
                rsvpNameInput.value = formattedName;
            }
        } else {
            if (guestNameElement) {
                guestNameElement.textContent = 'Tamu Undangan';
            }
        }
    };

    /* ===================================================================
       2. AUDIO PLAYER & VINYL FLOATING CONTROLLER
       Bypasses browser autoplay restrictions via user interaction
       =================================================================== */
    const audio = document.getElementById('weddingAudio');
    const vinylButton = document.getElementById('vinylButton');
    const audioIcon = document.getElementById('audioIcon');
    const audioControlContainer = document.getElementById('audio-control-container');
    const btnOpenInvitation = document.getElementById('btnOpenInvitation');
    const heroCover = document.getElementById('hero-cover');

    let isAudioPlaying = false;

    // Helper to start playing audio safely
    const playAudio = () => {
        if (!audio) return;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isAudioPlaying = true;
                updateAudioUI(true);
            }).catch((error) => {
                console.warn('Playback dicegah oleh peramban atau jaringan:', error);
                isAudioPlaying = false;
                updateAudioUI(false);
            });
        }
    };

    // Helper to pause audio safely
    const pauseAudio = () => {
        if (!audio) return;
        audio.pause();
        isAudioPlaying = false;
        updateAudioUI(false);
    };

    // Update vinyl turntable UI & icons
    const updateAudioUI = (playing) => {
        if (!vinylButton || !audioIcon) return;

        if (playing) {
            vinylButton.classList.remove('paused');
            vinylButton.classList.add('playing');
            audioIcon.className = 'bi bi-disc-fill';
            vinylButton.setAttribute('title', 'Jeda Musik');
        } else {
            vinylButton.classList.remove('playing');
            vinylButton.classList.add('paused');
            audioIcon.className = 'bi bi-play-fill';
            vinylButton.setAttribute('title', 'Putar Musik');
        }
    };

    // Listen to native audio events to sync state automatically
    if (audio) {
        audio.addEventListener('play', () => {
            isAudioPlaying = true;
            updateAudioUI(true);
        });

        audio.addEventListener('pause', () => {
            isAudioPlaying = false;
            updateAudioUI(false);
        });

        audio.addEventListener('ended', () => {
            isAudioPlaying = false;
            updateAudioUI(false);
        });
    }

    // Toggle play / pause when floating vinyl button is clicked
    if (vinylButton) {
        vinylButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (audio.paused) {
                playAudio();
            } else {
                pauseAudio();
            }
        });
    }

    /* ===================================================================
       3. "BUKA UNDANGAN" TRIGGER
       =================================================================== */
    if (btnOpenInvitation) {
        btnOpenInvitation.addEventListener('click', () => {
            // 1. Play background music immediately on user touch/click
            playAudio();

            // 2. Animate and dismiss full-screen cover
            if (heroCover) {
                heroCover.classList.add('opened');
            }

            // 3. Unlock document scrolling
            document.body.classList.remove('lock-scroll');

            // 4. Reveal the floating vinyl audio button
            if (audioControlContainer) {
                audioControlContainer.classList.remove('hidden');
            }

            // 5. Scroll smoothly to top of main content
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /* ===================================================================
       4. COUNTDOWN TIMER
       Target: Minggu, 12 Desember 2026 08:00:00 WIB
       =================================================================== */
    const initCountdown = () => {
        const targetDate = new Date('2026-12-12T08:00:00+07:00').getTime();

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    };

    /* ===================================================================
       5. SALIN REKENING / ALAMAT KE CLIPBOARD DENGAN TOAST FEEDBACK
       =================================================================== */
    const initClipboard = () => {
        const copyButtons = document.querySelectorAll('.copy-btn');
        const copyToastEl = document.getElementById('copyToast');
        const toastMessageEl = document.getElementById('toastMessage');
        const toastInstance = copyToastEl ? new bootstrap.Toast(copyToastEl) : null;

        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                let textToCopy = '';

                if (button.dataset.clipboardTarget) {
                    const targetEl = document.querySelector(button.dataset.clipboardTarget);
                    if (targetEl) {
                        textToCopy = targetEl.textContent.trim();
                    }
                } else if (button.dataset.clipboardText) {
                    textToCopy = button.dataset.clipboardText.trim();
                }

                if (!textToCopy) return;

                // Copy using modern Clipboard API or fallback
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        handleCopySuccess(button, toastInstance, toastMessageEl, textToCopy);
                    }).catch(() => {
                        fallbackCopyText(textToCopy, button, toastInstance, toastMessageEl);
                    });
                } else {
                    fallbackCopyText(textToCopy, button, toastInstance, toastMessageEl);
                }
            });
        });
    };

    const fallbackCopyText = (text, button, toastInstance, toastMessageEl) => {
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = text;
        tempTextArea.style.position = 'fixed';
        tempTextArea.style.left = '-9999px';
        document.body.appendChild(tempTextArea);
        tempTextArea.focus();
        tempTextArea.select();

        try {
            document.execCommand('copy');
            handleCopySuccess(button, toastInstance, toastMessageEl, text);
        } catch (err) {
            console.error('Gagal menyalin:', err);
        }
        document.body.removeChild(tempTextArea);
    };

    const handleCopySuccess = (button, toastInstance, toastMessageEl, text) => {
        // Change button feedback state temporarily
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="bi bi-check2 me-1"></i> Tersalin!';
        button.classList.add('btn-copied');

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('btn-copied');
        }, 2000);

        // Show Toast Notification
        if (toastInstance && toastMessageEl) {
            if (/^\d+$/.test(text.replace(/\s+/g, ''))) {
                toastMessageEl.textContent = 'Nomor Rekening Berhasil Disalin!';
            } else {
                toastMessageEl.textContent = 'Alamat Pengiriman Berhasil Disalin!';
            }
            toastInstance.show();
        }
    };

    /* ===================================================================
       6. GALERI LIGHTBOX MODAL
       =================================================================== */
    const initGalleryModal = () => {
        const galleryWraps = document.querySelectorAll('.gallery-img-wrap');
        const galleryModalEl = document.getElementById('galleryModal');
        const modalImg = document.getElementById('modalImg');
        const modalCaption = document.getElementById('galleryModalCaption');

        if (!galleryModalEl || !modalImg) return;

        const galleryModal = new bootstrap.Modal(galleryModalEl);

        galleryWraps.forEach(wrap => {
            wrap.addEventListener('click', () => {
                const fullSrc = wrap.getAttribute('data-img-src') || wrap.querySelector('img').src;
                const caption = wrap.getAttribute('data-caption') || 'Foto Prewedding';

                modalImg.src = fullSrc;
                if (modalCaption) {
                    modalCaption.textContent = caption;
                }
                galleryModal.show();
            });
        });
    };

    /* ===================================================================
       7. RSVP & DYNAMIC WISHES (BUKU TAMU)
       =================================================================== */
    const initRSVPAndWishes = () => {
        const rsvpForm = document.getElementById('rsvpForm');
        const wishesList = document.getElementById('wishesList');
        const wishesCount = document.getElementById('wishesCount');
        const copyToastEl = document.getElementById('copyToast');
        const toastMessageEl = document.getElementById('toastMessage');
        const toastInstance = copyToastEl ? new bootstrap.Toast(copyToastEl) : null;

        // Sample initial heartfelt wishes
        const initialWishes = [
            {
                name: 'Dimas Anggara & Keluarga',
                status: 'Hadir',
                message: 'Barakallahu lakum wa baraka alaikum wa jama\'a bainakuma fii khoir. Selamat menempuh hidup baru Raden & Arum, semoga menjadi keluarga sakinah mawaddah warahmah!',
                time: '1 jam yang lalu'
            },
            {
                name: 'Clarissa Maharani',
                status: 'Hadir',
                message: 'Happy wedding dear Arum & Raden! So happy for both of you. Semoga lancar sampai hari H dan selalu dilimpahi kebahagiaan seumur hidup.',
                time: '3 jam yang lalu'
            },
            {
                name: 'Budi Santoso',
                status: 'Ragu-ragu',
                message: 'Selamat untuk kedua mempelai. Insya Allah diusahakan hadir untuk memberikan doa restu secara langsung. Lancar dan sehat selalu!',
                time: '5 jam yang lalu'
            }
        ];

        let wishesData = [...initialWishes];

        const renderWishes = () => {
            if (!wishesList) return;
            wishesList.innerHTML = '';

            wishesData.forEach(item => {
                let badgeClass = 'status-hadir';
                if (item.status === 'Tidak Hadir') badgeClass = 'status-tidak-hadir';
                if (item.status === 'Ragu-ragu') badgeClass = 'status-ragu';

                const wishEl = document.createElement('div');
                wishEl.className = 'wish-item';
                wishEl.innerHTML = `
                    <div class="wish-header">
                        <span class="wish-author">${escapeHtml(item.name)}</span>
                        <span class="wish-status-badge ${badgeClass}">${escapeHtml(item.status)}</span>
                    </div>
                    <div class="wish-message">${escapeHtml(item.message)}</div>
                    <div class="wish-time"><i class="bi bi-clock me-1"></i>${escapeHtml(item.time)}</div>
                `;
                wishesList.appendChild(wishEl);
            });

            if (wishesCount) {
                wishesCount.textContent = `${wishesData.length} Ucapan`;
            }
        };

        // Form submit handler
        if (rsvpForm) {
            rsvpForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const nameInput = document.getElementById('rsvpName');
                const statusInput = document.getElementById('rsvpStatus');
                const messageInput = document.getElementById('rsvpMessage');

                const name = nameInput.value.trim();
                const status = statusInput.value;
                const message = messageInput.value.trim();

                if (!name || !status || !message) {
                    alert('Mohon lengkapi semua kolom yang wajib diisi.');
                    return;
                }

                // Add new wish to top
                const newWish = {
                    name: name,
                    status: status,
                    message: message,
                    time: 'Baru saja'
                };

                wishesData.unshift(newWish);
                renderWishes();

                // Reset message input while keeping name for convenience
                messageInput.value = '';

                // Toast notification
                if (toastInstance && toastMessageEl) {
                    toastMessageEl.textContent = 'Terima kasih atas konfirmasi & doa restu Anda!';
                    toastInstance.show();
                }
            });
        }

        renderWishes();
    };

    // Helper to prevent XSS in guest wishes
    const escapeHtml = (string) => {
        const div = document.createElement('div');
        div.textContent = string;
        return div.innerHTML;
    };

    // Initialize all components
    initGuestName();
    initCountdown();
    initClipboard();
    initGalleryModal();
    initRSVPAndWishes();
});
