// === SET TANGGAL MINIMAL CHECK-IN & CHECK-OUT ===
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');

        checkinInput.min = todayStr;

        checkinInput.addEventListener('change', () => {
            if (checkinInput.value) {
                const checkinDate = new Date(checkinInput.value);
                const nextDay = new Date(checkinDate);
                nextDay.setDate(checkinDate.getDate() + 1);

                const nextY = nextDay.getFullYear();
                const nextM = String(nextDay.getMonth() + 1).padStart(2, '0');
                const nextD = String(nextDay.getDate()).padStart(2, '0');
                const nextDayStr = `${nextY}-${nextM}-${nextD}`;

                checkoutInput.min = nextDayStr;

                if (checkoutInput.value < nextDayStr) {
                    checkoutInput.value = nextDayStr;
                }
            }
        });

        // === LOGIKA HARGA KAMAR ===
        const roomPrices = {
            "Standard Room": 450000,
            "Deluxe Room": 650000,
            "Executive Room": 900000,
            "Presidential Suite": 2500000
        };

        const urlParams = new URLSearchParams(window.location.search);
        const roomName = urlParams.get('kamar');
        document.getElementById('room').value = roomName || 'Belum dipilih';

        // Tambahkan elemen harga ke form
        const priceField = document.createElement('div');
        priceField.classList.add('form-group');
        priceField.innerHTML = `
        <label for="price">Harga per Malam</label>
        <input type="text" id="price" name="price" readonly>
    `;
        document.getElementById('bookingForm').insertBefore(priceField, document.querySelector('#bookingForm button'));

        // Set harga sesuai kamar
        let selectedPrice = 0;
        if (roomPrices[roomName]) {
            selectedPrice = roomPrices[roomName];
            document.getElementById('price').value = `Rp ${selectedPrice.toLocaleString('id-ID')}`;
        } else {
            document.getElementById('price').value = "Tidak tersedia";
        }

        // === SUBMIT FORM ===
        document.getElementById('bookingForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            const room = document.getElementById('room').value;
            const priceText = document.getElementById('price').value;

            const message = `Hai ${name}! 🎉

Terima kasih telah melakukan pemesanan kamar *${room}* di *Hotel Sejarah*. Berikut adalah detail pemesananmu:

🧑‍💼 Nama: ${name}
🏨 Tipe Kamar: ${room}
💰 Harga per Malam: ${priceText}
📅 Check-in: ${checkin}
📅 Check-out: ${checkout}
📱 No. HP: ${phone}
📧 Email: ${email}
📍 Alamat: ${address}

Kami tunggu kedatanganmu di Hotel Sejarah.
Selamat beristirahat dengan nyaman dan penuh sejarah! 🌿`;

            try {
                const response = await fetch("https://api.fonnte.com/send", {
                    method: "POST",
                    headers: {
                        "Authorization": "1dbHfgCGzmKv3SEX6aWt", // Ganti ini!
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        target: phone,
                        message: message,
                        countryCode: "62"
                    })
                });

                if (response.ok) {
                    window.location.href = "thankyou.html";
                } else {
                    alert("Gagal mengirim pesan WhatsApp. Coba lagi.");
                }
            } catch (err) {
                console.error(err);
                alert("Terjadi kesalahan!");
            }
        });
