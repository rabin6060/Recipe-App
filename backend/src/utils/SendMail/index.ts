import env from '../../config/env'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const sendMail = async (option:any) => {
    const transporter = nodemailer.createTransport({
        host:env.email_host,
        port:env.email_port,
        secure:env.email_port==='465',
        auth:{
            user:env.email_username,
            pass:env.email_password
        }
    } as SMTPTransport.Options)
    const emailOptions = {
        from : 'ToDo support',
        to: option.email,
        subject:option.subject,
        text:option.message
    }
      try {
        await transporter.sendMail(emailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}