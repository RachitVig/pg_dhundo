import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from app.core.config import settings

logger = logging.getLogger("app.core.email")

def send_email(to_email: str, subject: str, body: str):
    """
    Sends an email using the SMTP settings configured in .env.
    If settings are missing, logs a warning and prints the message details.
    """
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning(
            f"SMTP credentials not configured. Skipping real mail dispatch.\n"
            f"TO: {to_email}\n"
            f"SUBJECT: {subject}\n"
            f"BODY:\n{body}"
        )
        return False

    try:
        # Create message container
        msg = MIMEMultipart()
        msg["From"] = settings.SMTP_USER
        msg["To"] = to_email
        msg["Subject"] = subject

        # Attach body
        msg.attach(MIMEText(body, "html"))

        # Setup SMTP session
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()  # Secure connection
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        
        # Send mail
        server.sendmail(settings.SMTP_USER, to_email, msg.as_string())
        server.quit()
        logger.info(f"Successfully sent email to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False
