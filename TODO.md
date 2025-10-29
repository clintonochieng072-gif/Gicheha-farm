# TODO: Add Password Reset and Admin Credential Management

## Backend Changes

- [x] Add password reset token fields to Admin model (resetToken, resetTokenExpiry)
- [x] Install nodemailer for email sending
- [x] Add password reset routes: request reset, verify token, reset password
- [x] Add admin credential update route (change password/email)

## Frontend Changes

- [x] Add "Forgot Password" button to AdminLogin component
- [x] Create ForgotPassword component with email input
- [x] Create ResetPassword component for new password entry
- [x] Add "Change Credentials" section to AdminDashboard

## Configuration

- [x] Configure email service settings (Gmail SMTP or similar)

## Testing

- [x] Test email sending functionality
- [x] Test password reset flow
- [x] Test credential update functionality
