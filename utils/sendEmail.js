const EmailService = require('../services/email');
const UsersService = require('../services/users');
const emailService = new EmailService();
const usersService = new UsersService();

const sendEmail = async (user) => {
  const adminEmails = await getAdministratorsEmails();

  const message = {
    to: adminEmails,
    from: 'info@ipcindex.com',
    cc: 'afvalenciab@gmail.com',
    subject: `Reporte de ingresos fallidos`,
    html: `<h3>Sr/Sra Administrador!</h3>
           <p>El usuario ${user.email} ha fallado 3 veces consecutivas el ingreso al sistema.</p>`
  };

  const response = await emailService.sendEmail(message);
  return response;
};

const getAdministratorsEmails = async () => {
  const userAdmins = await usersService.getUsersAll({ isAdmin: true });
  let emails = [];
  userAdmins.map((item) => {
    emails.push(item.email)
  });
  return emails;
};

module.exports = sendEmail;
