import { Handler } from '@netlify/functions';
import * as nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

class MailerService {
  smtpConfig: smtpTransport.SmtpOptions;
  transporter: nodemailer.Transporter;
  smOptions: nodemailer.SendMailOptions;

  constructor() {}

  async sendMail(
    fromName: string,
    fromAddress: string,
    subject: string,
    message: string
  ) {
    if (process.env.MAIL_LOGIN) {
      this.smtpConfig = {
        host: process.env.MAIL_HOST as string,
        port: parseInt(process.env.MAIL_PORT as string),
        secure:
          process.env.MAIL_SECURE != null
            ? process.env.MAIL_SECURE === 'true'
            : false,
        auth: {
          user: process.env.MAIL_LOGIN as string,
          pass: process.env.MAIL_PASSWORD as string
        }
      };
    } else {
      this.smtpConfig = {
        host:
          process.env.MAIL_HOST != null
            ? (process.env.MAIL_HOST as string)
            : 'mail.shaw.ca',
        port:
          process.env.MAIL_PORT != null
            ? parseInt(process.env.MAIL_PORT as string)
            : 25,
        secure: false
      };
    }

    this.transporter = nodemailer.createTransport(this.smtpConfig);
    this.smOptions = {
      to:
        process.env.MAIL_TO != null
          ? (process.env.MAIL_TO as string)
          : 'hfournier@intratela.com',
      from: `${fromName} <${fromAddress}>`,
      subject: subject,
      text: message,
      html: message
    };

    return new Promise<void>(
      (resolve: (msg: any) => void, reject: (err: Error) => void) => {
        this.transporter.sendMail(this.smOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(`Message Sent ${info.response}`);
          }
        });
      }
    );
  }
}

const handler: Handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const data = JSON.parse(event.body);

    const mailService = new MailerService();
    const result = await mailService.sendMail(
      data.name,
      data.email,
      data.subject,
      data.message
    );
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(error)
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Your message was sent successfully! Thank you.'
    })
  };
};

export { handler };
