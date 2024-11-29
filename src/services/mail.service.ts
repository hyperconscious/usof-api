import * as nodemailer from 'nodemailer';
import config from '../config/env.config';
import verificationTemplate from '../templates/verificationTemplate';
import passwordResetTemplate from '../templates/passwordResetTemplate';

export class MailService {
  public async sendVerificationEmail(
    email: string,
    token: string,
    callbackUrl: string,
  ) {
    const verificationLink = `${callbackUrl}?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: 465,
      secure: true,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });

    const mailOptions = {
      from: '"Usof" <nikonov.kirill@gmail.com>',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking this link: ${verificationLink}`,
      html: verificationTemplate(verificationLink),
    };

    await transporter.sendMail(mailOptions);
  }

  public async sendPasswordResetEmail(
    email: string,
    token: string,
    callbackUrl: string,
  ) {
    const resetLink = `${callbackUrl}?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: 465,
      secure: true,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });

    const mailOptions = {
      from: '"Usof" <nikonov.kirill@gmail.com>',
      to: email,
      subject: 'Reset Password',
      text: `You can reset your password by folowing this link: ${resetLink}`,
      html: passwordResetTemplate(resetLink),
    };

    await transporter.sendMail(mailOptions);
  }
}
