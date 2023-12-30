const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendWelcomeEmail(newUser) {

    const parsedName = newUser.name.charAt(0).toUpperCase() + newUser.name.slice(1);
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
            "subject": `¡${parsedName}, te damos la Bienvenida a Disu!`
        },

    };

    return sgMail.send(msg);
}


function sendQRCodeEmail(newUser) {

    const parsedName = newUser.name.charAt(0).toUpperCase() + newUser.name.slice(1);
    const customQRCode = `https://disu.app/qr/?id=${newUser?.id || 'invalid'}`;

    const msg = {
        // to: newUser.email,
        // to: 'juan.mejias.ar@gmail.com',
        to: 'dev.reinaldo.cardenas@gmail.com',
        from: 'info@disu.app', // Tu dirección de correo verificada
        templateId: 'd-2aef2dd947e94a9eaa422595dc22d240', // ID del template dinámico
        // Puedes agregar campos dinámicos aquí si los agregas al template más adelante
        // dynamic_template_data: {
        //     user_name: 'Nombre del Usuario',
        //     ...
        // }

        "dynamic_template_data": {
            "subject": `¡${parsedName}, tu QR ha llegado!`,
            "name": parsedName,
            "user-qr": customQRCode

        },

    };

    return sgMail.send(msg);
}


module.exports = {
    sendWelcomeEmail, sendQRCodeEmail
};
