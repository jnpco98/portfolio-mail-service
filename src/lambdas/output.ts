const DEFAULT_OUTPUT = (name: string, email: string, message: string) =>
    `<p>You have a new contact request</p><h3>Contact Details</h3> <ul> <li>Name: ${name}</li><li>Email: ${email}</li></ul> <h3>Message</h3> <p>${message}</p>`;

type MailOutputType = 'default';

interface MailParams {
  name: string;
  email: string;
  message: string;
}

export function createMailOutput(params: MailParams, type?: MailOutputType) {
  const { name, email, message } = params;

  switch(type) {
    default:
    case 'default':
      return DEFAULT_OUTPUT(name, email, message);
  }
}