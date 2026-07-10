"""
app/routes/auth.py
Authentication endpoints — registration and login.
Uses bcrypt password hashing and signed JWT tokens.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import (
    LoginRequest, RegisterRequest, TokenResponse, UserSchema,
    ForgotPasswordRequest, ForgotPasswordResponse
)
from app.core.security import hash_password, verify_password, create_access_token
from app.core.email import send_email

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user account.
    Returns a JWT access token on success.
    """
    # Check for duplicate email
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    new_user = User(
        name=req.name,
        email=req.email,
        hashed_password=hash_password(req.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": new_user.email})
    return {
        "status": "success",
        "access_token": token,
        "token_type": "bearer",
        "user": new_user,
    }


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate with email + password.
    Returns a JWT access token on success.
    """
    user = db.query(User).filter(User.email == req.email).first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    token = create_access_token(data={"sub": user.email})
    return {
        "status": "success",
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Simulate/send a password reset token.
    Works for both single users and admin.
    """
    # 1. Check if user is the admin (adminpgdhundo@yopmail.com)
    if req.email == "adminpgdhundo@yopmail.com":
        email_body = """
        <html>
            <body style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #2563eb;">PG Dhundo — Admin Password Reset</h2>
                <p>You requested a password reset for the admin panel.</p>
                <p>Use the temporary passcode below to sign in or reset your credential:</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 10px; font-size: 18px; font-weight: bold; letter-spacing: 2px; text-align: center; margin: 20px 0;">
                    ADMIN123
                </div>
                <p>If you did not request this, please ignore this email.</p>
            </body>
        </html>
        """
        success = send_email(
            to_email=req.email,
            subject="PG Dhundo — Admin Password Reset Request",
            body=email_body
        )
        msg = "Reset email dispatched successfully." if success else "Simulated reset email logged successfully."
        return {
            "status": "success",
            "message": msg
        }

    # 2. Check if it's a regular user
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Avoid user enumeration for security reasons, say success anyway
        return {
            "status": "success",
            "message": "If the account exists, a reset link has been dispatched."
        }

    email_body = f"""
    <html>
        <body style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">PG Dhundo — Password Reset Request</h2>
            <p>Hello {user.name},</p>
            <p>We received a request to reset your PG Dhundo account password.</p>
            <p>Click the link below to access your reset page:</p>
            <p><a href="http://localhost:5173/?reset-token=dummy" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
            <p>If you did not request this, please ignore this email.</p>
        </body>
    </html>
    """
    success = send_email(
        to_email=req.email,
        subject="PG Dhundo — Password Reset Request",
        body=email_body
    )
    msg = "Reset email dispatched successfully." if success else "Simulated reset email logged successfully."
    return {
        "status": "success",
        "message": msg
    }

