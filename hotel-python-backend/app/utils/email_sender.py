"""Small SMTP helper used for transactional emails (e.g. password reset).

If SMTP credentials are not configured, sending is skipped gracefully: the
function logs a warning (including the message, so a developer can still grab
a reset link from the server log during a demo) and returns False instead of
crashing the request.
"""
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config.config import settings

logger = logging.getLogger(__name__)


def send_email(to_email: str, subject: str, html_body: str) -> bool:
    """Send a single HTML email. Returns True on success, False otherwise."""
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning(
            "SMTP not configured (SMTP_USER/SMTP_PASSWORD empty) — email to %s "
            "was NOT sent. Subject: %s", to_email, subject
        )
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{settings.SMTP_TITLE} <{settings.SMTP_USER}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, [to_email], msg.as_string())
        logger.info("Email sent to %s (subject: %s)", to_email, subject)
        return True
    except Exception as e:
        logger.error("Failed to send email to %s: %s", to_email, e)
        return False


def password_reset_email_html(full_name: str, reset_link: str) -> str:
    """Build the HTML body for the password-reset email."""
    name = full_name or "Pelanggan"
    return f"""\
<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#1f2937">
  <div style="background:#0f172a;padding:24px;text-align:center;border-radius:12px 12px 0 0">
    <h1 style="color:#f5c451;margin:0;font-size:22px;letter-spacing:2px">EVA GROUP HOTEL</h1>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;padding:28px;border-radius:0 0 12px 12px">
    <p>Halo {name},</p>
    <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Klik tombol
       di bawah ini untuk membuat kata sandi baru:</p>
    <p style="text-align:center;margin:28px 0">
      <a href="{reset_link}"
         style="background:#f5c451;color:#0f172a;text-decoration:none;font-weight:bold;
                padding:12px 28px;border-radius:8px;display:inline-block">
        Atur Ulang Kata Sandi
      </a>
    </p>
    <p style="font-size:13px;color:#6b7280">
       Tautan ini hanya berlaku selama <b>30 menit</b> dan hanya dapat digunakan satu kali.
       Jika tombol tidak berfungsi, salin dan tempel tautan berikut ke browser Anda:</p>
    <p style="font-size:12px;color:#2563eb;word-break:break-all">{reset_link}</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
    <p style="font-size:12px;color:#9ca3af">
       Jika Anda tidak meminta pengaturan ulang kata sandi, abaikan email ini —
       kata sandi Anda tidak akan berubah.</p>
  </div>
</div>"""
