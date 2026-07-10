import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Env variable names must match .env file exactly
SMTP_SERVER   = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT     = int(os.environ.get("SMTP_PORT", 587))
SMTP_EMAIL    = os.environ.get("SMTP_USER", "")          # matches .env key SMTP_USER
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
USE_MOCK      = os.environ.get("USE_MOCK_EMAIL", "false").lower() == "true"


# ─────────────────────────────────────────────────────────────────────────────
# 1. Email to OWNER — new booking inquiry
# ─────────────────────────────────────────────────────────────────────────────
def send_booking_inquiry_to_owner(
    owner_email: str, pg_name: str,
    user_name: str, user_email: str, user_phone: str,
    requirements: str, preferred_time: str
):
    subject = f"🔔 New Booking Request for {pg_name}"

    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:36px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">PG Dhundo</h1>
            <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Owner Notification</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;">New Booking Inquiry 🎉</h2>
            <p style="color:#64748b;margin:0 0 24px;font-size:15px;">
              A user has requested to visit <strong style="color:#1d4ed8;">{pg_name}</strong>. Please review the details below and confirm or reject from your dashboard.
            </p>

            <!-- Info Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
              <tr><td style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:600;">VISITOR DETAILS</p>
              </td></tr>
              <tr><td style="padding:20px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px 0;width:50%;">
                      <span style="font-size:12px;color:#94a3b8;display:block;">Full Name</span>
                      <span style="font-size:15px;font-weight:600;color:#1e293b;">{user_name}</span>
                    </td>
                    <td style="padding:8px 0;">
                      <span style="font-size:12px;color:#94a3b8;display:block;">Phone</span>
                      <span style="font-size:15px;font-weight:600;color:#1e293b;">{user_phone}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;" colspan="2">
                      <span style="font-size:12px;color:#94a3b8;display:block;">Email</span>
                      <span style="font-size:15px;font-weight:600;color:#1e293b;">{user_email}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;" colspan="2">
                      <span style="font-size:12px;color:#94a3b8;display:block;">Preferred Visit Time</span>
                      <span style="font-size:15px;font-weight:600;color:#f59e0b;">📅 {preferred_time}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;" colspan="2">
                      <span style="font-size:12px;color:#94a3b8;display:block;">Requirements</span>
                      <span style="font-size:15px;color:#334155;">{requirements}</span>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <p style="margin:28px 0 0;color:#64748b;font-size:14px;">
              Log in to your <strong>Owner Dashboard</strong> to confirm or set a scheduled time for this visit.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:13px;">PG Dhundo &bull; Chandigarh, India &bull; <a href="#" style="color:#3b82f6;text-decoration:none;">Unsubscribe</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
"""
    _send_email(owner_email, subject, html_content)


# ─────────────────────────────────────────────────────────────────────────────
# 2. Email to USER — immediate acknowledgment right after booking is submitted
# ─────────────────────────────────────────────────────────────────────────────
def send_booking_acknowledgment_to_user(
    user_email: str, user_name: str, pg_name: str,
    preferred_time: str, requirements: str
):
    subject = f"✅ Booking Request Received — {pg_name}"

    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0ea5e9,#6366f1);padding:36px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">PG Dhundo</h1>
            <p style="margin:8px 0 0;color:#c7d2fe;font-size:14px;">Booking Request Received</p>
          </td>
        </tr>

        <!-- Icon Row -->
        <tr>
          <td style="text-align:center;padding:32px 40px 0;">
            <div style="display:inline-block;background:#eff6ff;border-radius:50%;width:72px;height:72px;line-height:72px;font-size:36px;">📋</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px 40px 36px;">
            <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;text-align:center;">Hi {user_name}, we've got your request!</h2>
            <p style="color:#64748b;margin:0 0 28px;font-size:15px;text-align:center;line-height:1.7;">
              Your booking inquiry for <strong style="color:#6366f1;">{pg_name}</strong> has been received successfully.
              The owner will review your request and confirm a visit time shortly.
            </p>

            <!-- Booking Summary Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
              <tr><td style="padding:16px 24px;background:#6366f1;">
                <p style="margin:0;font-size:13px;color:#e0e7ff;text-transform:uppercase;letter-spacing:1px;font-weight:600;">BOOKING SUMMARY</p>
              </td></tr>
              <tr><td style="padding:24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:10px 0;width:45%;vertical-align:top;">
                      <span style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">PG NAME</span>
                      <span style="font-size:15px;font-weight:700;color:#1e293b;">{pg_name}</span>
                    </td>
                    <td style="padding:10px 0;vertical-align:top;">
                      <span style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">STATUS</span>
                      <span style="font-size:13px;font-weight:700;color:#f59e0b;background:#fef3c7;padding:3px 10px;border-radius:20px;">⏳ PENDING OWNER REVIEW</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;" colspan="2">
                      <span style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">YOUR PREFERRED VISIT TIME</span>
                      <span style="font-size:15px;font-weight:600;color:#0ea5e9;">📅 {preferred_time}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;" colspan="2">
                      <span style="font-size:12px;color:#94a3b8;display:block;margin-bottom:4px;">YOUR REQUIREMENTS</span>
                      <span style="font-size:14px;color:#334155;">{requirements}</span>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- What's Next -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #6366f1;border-radius:0 8px 8px 0;padding:16px 20px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 8px;font-weight:700;color:#1e293b;font-size:15px;">What happens next?</p>
                <p style="margin:0;color:#475569;font-size:14px;line-height:1.7;">
                  ✉️ The owner has been notified of your inquiry.<br>
                  🔔 You will receive another email once the owner confirms and schedules your visit.<br>
                  💬 You can also chat with the owner directly through the PG Dhundo app.
                </p>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:13px;">PG Dhundo &bull; Chandigarh, India &bull; <a href="#" style="color:#6366f1;text-decoration:none;">Unsubscribe</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
"""
    _send_email(user_email, subject, html_content)


# ─────────────────────────────────────────────────────────────────────────────
# 3. Email to USER — owner has confirmed with a scheduled time
# ─────────────────────────────────────────────────────────────────────────────
def send_booking_confirmation_to_user(
    user_email: str, user_name: str, pg_name: str,
    scheduled_time: str, owner_message: str
):
    subject = f"🎉 Visit Confirmed — {pg_name}"

    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#059669,#10b981);padding:36px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">PG Dhundo</h1>
            <p style="margin:8px 0 0;color:#a7f3d0;font-size:14px;">Visit Confirmed!</p>
          </td>
        </tr>

        <!-- Icon Row -->
        <tr>
          <td style="text-align:center;padding:32px 40px 0;">
            <div style="display:inline-block;background:#ecfdf5;border-radius:50%;width:80px;height:80px;line-height:80px;font-size:40px;">🏠</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px 40px 36px;">
            <h2 style="margin:0 0 8px;color:#1e293b;font-size:24px;text-align:center;">Great News, {user_name}!</h2>
            <p style="color:#64748b;margin:0 0 28px;font-size:15px;text-align:center;line-height:1.7;">
              The owner of <strong style="color:#059669;">{pg_name}</strong> has confirmed your visit. 
              Here are the details for your scheduled appointment.
            </p>

            <!-- Confirmed Details Card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:12px;overflow:hidden;margin-bottom:24px;">
              <tr><td style="padding:16px 24px;background:#059669;">
                <p style="margin:0;font-size:13px;color:#d1fae5;text-transform:uppercase;letter-spacing:1px;font-weight:600;">✅ CONFIRMED VISIT DETAILS</p>
              </td></tr>
              <tr><td style="padding:24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:12px 0;width:45%;vertical-align:top;">
                      <span style="font-size:12px;color:#059669;display:block;margin-bottom:4px;font-weight:600;">PG NAME</span>
                      <span style="font-size:16px;font-weight:700;color:#1e293b;">{pg_name}</span>
                    </td>
                    <td style="padding:12px 0;vertical-align:top;">
                      <span style="font-size:12px;color:#059669;display:block;margin-bottom:4px;font-weight:600;">STATUS</span>
                      <span style="font-size:13px;font-weight:700;color:#fff;background:#059669;padding:4px 12px;border-radius:20px;">✅ CONFIRMED</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-top:1px solid #a7f3d0;" colspan="2">
                      <span style="font-size:12px;color:#059669;display:block;margin-bottom:6px;font-weight:600;">📅 SCHEDULED VISIT TIME</span>
                      <span style="font-size:20px;font-weight:700;color:#1e293b;">{scheduled_time}</span>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Owner Message -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
              <tr><td style="padding:20px 24px;">
                <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:600;">💬 MESSAGE FROM OWNER</p>
                <p style="margin:0;font-size:15px;color:#334155;line-height:1.7;font-style:italic;">"{owner_message}"</p>
              </td></tr>
            </table>

            <!-- Tips -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 8px;font-weight:700;color:#1e293b;font-size:15px;">📌 Before your visit</p>
                <p style="margin:0;color:#78350f;font-size:14px;line-height:1.8;">
                  🪪 Carry a valid ID proof (Aadhaar, College ID, etc.)<br>
                  💳 Keep payment details ready if you'd like to move in immediately.<br>
                  📱 Save the owner's contact in case of any last-minute changes.
                </p>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:13px;">PG Dhundo &bull; Chandigarh, India &bull; <a href="#" style="color:#10b981;text-decoration:none;">Unsubscribe</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
"""
    _send_email(user_email, subject, html_content)


# ─────────────────────────────────────────────────────────────────────────────
# Internal SMTP dispatcher
# ─────────────────────────────────────────────────────────────────────────────
def _send_email(to_email: str, subject: str, html_content: str):
    if USE_MOCK:
        print("\n" + "="*60)
        print(f"[MOCK EMAIL] TO: {to_email}")
        print(f"[MOCK EMAIL] SUBJECT: {subject}")
        print("="*60 + "\n")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = SMTP_EMAIL
        msg["To"]      = to_email

        msg.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_email, msg.as_string())

        log_msg = f"[EMAIL] [SUCCESS] Sent to {to_email} - {subject}"
        try:
            print(log_msg)
        except UnicodeEncodeError:
            print(log_msg.encode('ascii', 'ignore').decode('ascii'))
    except Exception as e:
        err_msg = f"[EMAIL] [ERROR] Failed to send to {to_email}: {e}"
        try:
            print(err_msg)
        except UnicodeEncodeError:
            print(err_msg.encode('ascii', 'ignore').decode('ascii'))
