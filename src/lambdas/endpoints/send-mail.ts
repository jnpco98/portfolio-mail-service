import AWS from 'aws-sdk';
import { APIGatewayEvent, Context } from 'aws-lambda';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { Response, createResponse } from '../utilities';
import { createMailOutput } from '../output';

interface SendConfig {
  companyName: string;
  agent: string;
  receiver: string;
}

interface MessageConfig {
  firstname: string;
  lastname: string;
  email: string;
  message: string;
  subject: string;
}

interface RequestBody {
  sendConfig: SendConfig;
  messageConfig: MessageConfig;
}

const DEFAULT_SUCCESS_MSG = 'Message has been sent.';
const DEFAULT_ERROR_PARAM_MSG = 'Invalid parameters.';

const transporter = nodemailer.createTransport({
  SES: new AWS.SES({ apiVersion: '2010-12-01' })
});

export async function handler(event: APIGatewayEvent, context: Context): Promise<Response> {
  const body = JSON.parse(event.body || '{}') as RequestBody;
  const { sendConfig, messageConfig } = body;

  if(!sendConfig || !messageConfig) return createResponse(422, { error: DEFAULT_ERROR_PARAM_MSG });

  const { companyName = 'N/A', receiver, agent } = sendConfig;
  const { email = 'N/A', firstname = 'N/A', lastname = 'N/A', message = 'Empty message', subject = `[Contact Request] ${email}` } = messageConfig;

  if(!receiver || !agent) return createResponse(422, { error: DEFAULT_ERROR_PARAM_MSG });

  const mailOptions: Mail.Options = {
    from: `${companyName} ${agent}`,
    to: receiver,
    subject,
    html: createMailOutput({ email, message, name: `${firstname} ${lastname}` })
  };

  try {
    const data = await transporter.sendMail(mailOptions);
    return createResponse(200, { message: DEFAULT_SUCCESS_MSG, data });
  } catch (e) {
    console.error(e);
    return createResponse(422, { error: e });
  }
}