// Creation de l'objet nodemailer
const nodemailer = require('nodemailer');

//Créons l'objet transport  via la methode createTransport de l'objet nodemailer
const transporter = nodemailer.createTransport({
    host:process.env.MAIL_HOST,
    port:process.env.MAIL_PORT,
    secure:false,
    auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
    }
})


 //  Création  de objet client  service avec sa  methode permettant  d'envopyé un email
 const emailService = {
    // Envoi du nouveau mot de passe au client
    sendNewPassword: async(email, newPassword) => {
        await transporter.sendMail({
             from: `"RestoBook" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "RestoBook — Votre nouveau mot de passe",
            html: `
                <h2>Mot de passe réinitialisé</h2>
                <p>Voici votre nouveau mot de passe temporaire :</p>
                <p><strong>${newPassword}</strong></p>
                <p>Vous devrez le changer à votre prochaine connexion.</p>
                <p>L'équipe RestoBook</p>
            `
        })
    },
    sendSignupEmail: async (email, prenom) => {
    await transporter.sendMail({
        from: `"RestoBook" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "RestoBook — Confirmation d'inscription",
        html: `
        <div style="font-family: 'Lato', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF7F2;">

            <!-- HEADER -->
            <div style="background-color: #401F25; padding: 32px 40px; text-align: center;">
                <!-- Ornement -->
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                    <div style="width: 60px; height: 1px; background: linear-gradient(to right, transparent, #C9A84C);"></div>
                    <div style="width: 7px; height: 7px; background: #C9A84C; transform: rotate(45deg); margin: 0 12px;"></div>
                    <div style="width: 60px; height: 1px; background: linear-gradient(to left, transparent, #C9A84C);"></div>
                </div>
                <h1 style="color: #C9A84C; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 700; margin: 0 0 6px 0; letter-spacing: 0.02em;">
                    Le Gourmet Parisien
                </h1>
                <p style="color: rgba(255,255,255,0.5); font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0;">
                    Une cuisine raffinée au cœur du Marais
                </p>
            </div>

            <!-- BANDE OR FINE -->
            <div style="height: 3px; background: linear-gradient(to right, #B08C30, #C9A84C, #D4B96A, #C9A84C, #B08C30);"></div>

            <!-- BODY -->
            <div style="background-color: #ffffff; padding: 48px 48px 40px; border-left: 1px solid #F0EBE3; border-right: 1px solid #F0EBE3;">

                <!-- Salutation -->
                <h2 style="color: #722F37; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 700; margin: 0 0 8px 0;">
                    Bienvenue, ${prenom}&nbsp;!
                </h2>
                <div style="width: 40px; height: 2px; background-color: #C9A84C; margin-bottom: 24px;"></div>

                <p style="color: #2C2220; line-height: 1.8; font-size: 15px; margin: 0 0 16px 0;">
                    Votre compte <strong>RestoBook</strong> a été créé avec succès. Nous sommes ravis de vous accueillir dans notre communauté.
                </p>

                <p style="color: #555555; line-height: 1.8; font-size: 14px; margin: 0 0 20px 0;">
                    Vous pouvez désormais profiter de tous nos services :
                </p>

                <!-- Liste stylisée -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 36px;">
                    <tr>
                        <td style="padding: 10px 16px; border-left: 3px solid #C9A84C; background-color: #FAF7F2; margin-bottom: 8px; display: block; color: #2C2220; font-size: 14px; line-height: 1.5;">
                            🍽️&nbsp;&nbsp;Réserver une table en quelques clics
                        </td>
                    </tr>
                    <tr><td style="height: 6px;"></td></tr>
                    <tr>
                        <td style="padding: 10px 16px; border-left: 3px solid #C9A84C; background-color: #FAF7F2; display: block; color: #2C2220; font-size: 14px; line-height: 1.5;">
                            📋&nbsp;&nbsp;Consulter notre carte et nos menus
                        </td>
                    </tr>
                    <tr><td style="height: 6px;"></td></tr>
                    <tr>
                        <td style="padding: 10px 16px; border-left: 3px solid #C9A84C; background-color: #FAF7F2; display: block; color: #2C2220; font-size: 14px; line-height: 1.5;">
                            ⭐&nbsp;&nbsp;Laisser un avis après votre visite
                        </td>
                    </tr>
                </table>

                <!-- CTA -->
                <div style="text-align: center; margin: 36px 0 28px;">
                    <a href="http://localhost:3000/reservation"
                       style="display: inline-block; background-color: #C9A84C; color: #401F25;
                              padding: 14px 40px; text-decoration: none; font-weight: 700;
                              font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase;
                              border-radius: 2px; box-shadow: 0 4px 16px rgba(201,168,76,0.35);">
                        RÉSERVER UNE TABLE
                    </a>
                </div>

                <!-- Séparateur -->
                <div style="border-top: 1px solid #F0EBE3; margin: 28px 0;"></div>

                <p style="color: #999999; font-size: 13px; text-align: center; font-style: italic; margin: 0;">
                    À très bientôt au Gourmet Parisien !
                </p>
            </div>

            <!-- BANDE OR FINE BAS -->
            <div style="height: 3px; background: linear-gradient(to right, #B08C30, #C9A84C, #D4B96A, #C9A84C, #B08C30);"></div>

            <!-- FOOTER -->
            <div style="background-color: #401F25; padding: 24px 40px; text-align: center;">
                <p style="color: rgba(255,255,255,0.4); font-size: 11px; letter-spacing: 0.08em; margin: 0 0 6px 0; text-transform: uppercase;">
                    12 rue des Archives, 75004 Paris
                </p>
                <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">
                    📞 01 23 45 67 89
                </p>
            </div>

        </div>
        `
    });
}
 }

 module.exports = emailService;