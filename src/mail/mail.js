const mailer = require("nodemailer");
const nodemailer = require("nodemailer");
const goodbye = require("./goodbye_template");
const welcome = require("./welcome_template");

const getEmailData = (to, name, template) => {
  let data = null;
  switch (template) {
    case "welcome":
      data = {
        from: "shudder48@gmail.com",
        to,
        subject: `Hello ${name}`,
        html: welcome(),
      };
      break;
    case "goodbye":
      data = {
        from: "shudder48@gmail.com",
        to,
        subject: `Goodbye ${name}`,
        html: goodbye(),
      };
      break;
    default:
      data;
  }
  return data;
};

const sendMail = async (to, name, type) => {
  const transporter = mailer.createTransport({
    service: "Gmail",
    auth: {
      user: "shudder48@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mail = getEmailData(to, name, type);

  transporter.sendMail(mail, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log("email sent successfully");
    }

    transporter.close();
  });
};

module.exports = sendMail;
