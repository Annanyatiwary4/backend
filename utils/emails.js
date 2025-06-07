import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./Emailtemplate.js";
import transporter from "./mailer.js";

export const sendVerificationEmail = async (email, verificationToken,name) => {
  if (!email) {
    throw new Error("No recipient email provided");
  }

  try {
    const response = await transporter.sendMail({
      from: `<${process.env.MAIL_USER}>`, // sender name + email
      to: email, // string email address
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{userName}", name)
      .replace("{verificationCode}", verificationToken),
    });

    console.log("✅ Verification email sent:", response.messageId);
    return response;
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

//send password reset email

export const sendPasswordResetEmail = async (email, resetURL,name) => {

try{
    const response = await transporter.sendMail({
      from: `<${process.env.MAIL_USER}>`, // sender name + email
      to: email, // string email address
      subject: "Reset Your Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL).replace("{userName}", name),
    });
}catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }

};