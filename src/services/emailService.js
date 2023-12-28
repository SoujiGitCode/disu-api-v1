const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendWelcomeEmail(newUser) {
    const msg = {
        to: newUser.email,
        // to: 'juan.mejias.ar@gmail.com',
        // to: 'dev.reinaldo.cardenas@gmail.com',
        from: 'info@disu.app', // Tu dirección de correo verificada
        templateId: 'd-4f13e8fa3bc64bcd9b5e9323d13f604b', // ID del template dinámico
        // Puedes agregar campos dinámicos aquí si los agregas al template más adelante
        // dynamic_template_data: {
        //     user_name: 'Nombre del Usuario',
        //     ...
        // }

        "dynamic_template_data": {
            "subject": `${newUser.name} Te damos la Bienvenida a Disu`
        },

    };

    return sgMail.send(msg);
}

module.exports = {
    sendWelcomeEmail,
};
