import * as nodemailer from 'nodemailer';
import config from '../config/env.config';

export class MailService {
  public async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `http://${config.host}:${config.port}/api/auth/verify-email?token=${token}`;

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
      html: `<p>Please verify your email by clicking <a href="${verificationLink}">this link</a>.</p>`,
    };

    await transporter.sendMail(mailOptions);
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `http://${config.host}:${config.port}/api/auth/password-reset?token=${token}`;

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
      // text: `You can reset your password by folowing this link: ${resetLink}`,
      html: `<p>You can reset your password by following <a href="${resetLink}">this link</a>.</p>`,
    };

    await transporter.sendMail(mailOptions);
  }
}
