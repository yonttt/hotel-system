import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config.config import settings

logger = logging.getLogger(__name__)

def send_booking_notification(reservation_no: str, guest_name: str, guest_email: str, room_number: str, check_in: str, check_out: str):
    """
    Kirim email notifikasi. Satu ke ADMIN (sebagai informasi pesanan baru),
    Satu ke TAMU (jika email tamu tersedia, sebagai konfirmasi/invoice sementara).
    """
    # Mengecek apakah SMTP dikonfigurasi
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning("Email SMTP belum dikonfigurasi di .env. Notifikasi email diskip.")
        return False

    try:
        # 1. Kirim Email ke Admin (yonathantambani109@gmail.com)
        _send_email_to_admin(reservation_no, guest_name, check_in, check_out)

        # 2. Kirim Email ke Tamu (Jika tamu mencantumkan email)
        if guest_email:
            _send_email_to_guest(guest_email, guest_name, reservation_no, check_in, check_out)

        return True
    except Exception as e:
        logger.error(f"Gagal mengirim email: {str(e)}")
        return False


def _send_email_to_admin(reservation_no: str, guest_name: str, check_in: str, check_out: str):
    try:
        msg = MIMEMultipart()
        msg['From'] = f"{settings.SMTP_TITLE} <{settings.SMTP_USER}>"
        msg['To'] = settings.ADMIN_EMAIL
        msg['Subject'] = f"Pesanan Baru Diterima - #{reservation_no}"
        
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="background-color: #d4af37; color: white; padding: 15px; text-align: center; border-radius: 5px;">
                    <h2>Notifikasi Booking Baru!</h2>
                </div>
                <div style="padding: 20px;">
                    <p>Halo Admin,</p>
                    <p>Sistem menerima pesanan kamar baru dari website. Rinciannya:</p>
                    <ul>
                        <li><strong>No. Reservasi:</strong> {reservation_no}</li>
                        <li><strong>Nama Tamu:</strong> {guest_name}</li>
                        <li><strong>Tgl Check-in:</strong> {check_in}</li>
                        <li><strong>Tgl Check-out:</strong> {check_out}</li>
                    </ul>
                    <p>Silahkan masuk ke dashboard Front Office Anda untuk melihat detail pembayaran dan assign kamar tamu.</p>
                </div>
            </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        logger.info(f"Notifikasi admin berhasil dikirim ke {settings.ADMIN_EMAIL}")
    except Exception as e:
        logger.error(f"Error mengirim email admin: {str(e)}")


def _send_email_to_guest(guest_email: str, guest_name: str, reservation_no: str, check_in: str, check_out: str):
    try:
        msg = MIMEMultipart()
        msg['From'] = f"{settings.SMTP_TITLE} <{settings.SMTP_USER}>"
        msg['To'] = guest_email
        msg['Subject'] = f"Konfirmasi Booking Anda di Eva Group Hotel - #{reservation_no}"
        
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="background-color: #2b2b2b; color: #d4af37; padding: 15px; text-align: center; border-radius: 5px;">
                    <h2>Terima Kasih Atas Pesanan Anda</h2>
                </div>
                <div style="padding: 20px;">
                    <p>Halo <b>{guest_name}</b>,</p>
                    <p>Kami telah menerima permohonan reservasi kamar Anda. Berikut adalah detail booking Anda:</p>
                    <ul>
                        <li><strong>No. Reservasi:</strong> {reservation_no}</li>
                        <li><strong>Tgl Check-in:</strong> {check_in}</li>
                        <li><strong>Tgl Check-out:</strong> {check_out}</li>
                    </ul>
                    <p>Mohon segera selesaikan pembayaran agar pesanan Anda dapat kami konfirmasi secara penuh.<br/>
                    Jika ada kendala atau perubahan jadwal, silahkan hubungi kontak admin Eva Group Hotel.</p>
                    <p>Terima kasih dan kami tunggu kedatangan Anda &hearts;</p>
                </div>
            </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        logger.info(f"Notifikasi tamu dikirim ke {guest_email}")
    except Exception as e:
        logger.error(f"Error mengirim email tamu: {str(e)}")
