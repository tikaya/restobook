// importons les services
const categorieService = require('../services/categorieService');
const platService = require('../services/platService');
const avisService = require('../services/avisService');
const reservationService = require('../services/reservationService');
const clientService = require('../services/clientService');
const tableService = require('../services/tableService');
const employeService = require('../services/employeService');
const logService = require('../services/logService');
const { forgotPassword } = require('../services/authService');



//L'objet contenant les methode (midllewares terminaux) rendant des vue au client 
const pageController = {
    accueil: async(req,res , next) => {
        try {
            res.render('index',{title:'Accueil'})
        }catch(error) {
            next(error)
        }
    },
    carte: async (req, res, next) => {
        try {
            const categories = await categorieService.getAllCategories()
            const plats = await platService.getAllPlats();
            res.render('carte',{title: 'Notre carte',categories,plats})
        } catch (error){
            next(error)
        }
    },
    avis: async(req,res,next) => {
        try{
            const avis = await avisService.getAvisApproves();
            res.render('avis',{title:'Avis',avis})
        }catch(error){
            next(error)
        }
    },

    contact: async(req,res,next)=> {
        try {
            res.render('contact',{title:'Contact'})
        }catch(error){
            next(error)
        }
    },

    mentionslegales: async(req,res,next)=>{
        try {
            res.render('mentions-legales', {title:"Mentions légales"})
        }catch(error){
            next(error)
        }
    },

    reservation: async(req,res,next) =>{
        try{
            res.render('reservation',{title:"Réserver"})
        }catch(error){
            next(error)
        }
    },
    connection: async(req,res,next) => {
        try {
            res.render("login",{title:'Connection'})
        }catch(error) {
            next(error)
        }
    },
    inscription: async(req,res,next) => {
        try{
            res.render('inscription',{title:"Inscription"})
        }catch(error) {
            next(error)
        }
    },

espaceClient: async (req, res, next) => {
    try {
        res.render('espace-client', { title: 'Mon espace', user: req.user })
    } catch (error) {
        next(error)
    }
},

espaceServeur: async (req, res, next) => {
    try {
        const reservations = await reservationService.getAllReservations();
        const avis = await avisService.getAllAvis();
        const plats = await platService.getAllPlats()
        const categories = await categorieService.getAllCategories()
        res.render('espace-serveur', { title: 'Espace serveur', user: req.user, reservations, avis, plats,categories})
    } catch (error) {
        next(error)
    }
},

espaceAdmin: async (req, res, next) => {
    try {
        const reservations = await reservationService.getAllReservations();
        const avisAll = await avisService.getAllAvis();
        const clients = await clientService.getAllClients();
        res.render('espace-admin', { title: 'Administration', user: req.user, reservations, avis: avisAll, clients })
    } catch (error) {
        next(error)
    }
},

adminReservations: async (req, res, next) => {
    try {
        const reservations = await reservationService.getAllReservations();
        const clients = await clientService.getAllClients()
        res.render('admin/reservations', { title: 'Gestion réservations', user: req.user, reservations,clients })
    } catch (error) { next(error) }
},

adminTables: async(req,res,next) => {
 try {
    const tables = await tableService.getAllTables()
    res.render('admin/tables',{title : 'Gestion tables',user:req.user,tables})
 } catch (error) {next(error)}
},

adminMenu: async (req,res,next) => {
    try {
        const categories = await categorieService.getAllCategories()
        const plats = await platService.getAllPlats()
        res.render('admin/menu',{title:'Gestion Menu',user:req.user,plats,categories})
    } catch(error) {
        next(error)
    }
},

adminAvis: async (req,res ,next) =>{
    
    try {
        const avis = await avisService.getAllAvis();
        res.render('admin/avis',{title:'Gestion avis',user:req.user,avis})
    } catch(error) {
        next(error)
    }

},

adminComptes: async(req,res,next) => {
    try {
        const clients = await clientService.getAllClients()
        const employes = await employeService.getAllEmployes()
        res.render('admin/comptes',{title:'Gestion comptes',user:req.user,clients,employes}) 
    } catch(error) {
        next(error)
    }
},

adminLogs : async (req,res,next) => {
    try {
        const logs = await logService.getAllLogs()
        res.render('admin/logs',{title:'Gestion logs',user:req.user,logs})
    }catch(error) {
        next(error)
    }
},

// Solution — passer avis aussi
serveurReservations: async (req, res, next) => {
    try {
        const reservations = await reservationService.getAllReservations();
        const avis         = await avisService.getAllAvis(); // ✅ ajouter
        
        res.render('serveur/reservations', { title: 'Réservations', user: req.user, reservations, avis })
    } catch (error) { next(error) }
},

serveurAvis : async (req,res,next) => {
    //Si tous se passe bien:
    try {
        // On va récuperer tous les avis 
        const avis = await avisService.getAllAvis();
        //Enfin on à rendre au client HTML (effet de bord final)
        res.render('serveur/avis',{title:'Gestion avis',user:req.user,avis})
    }catch (error) {
        next(error) // Au cas ou il à une erreur dans la quelque part
    }
},

serveurMenu: async (req,res,next) => {
  try {
     // Premier effet de bord : récuperer tous les plats et catégories
    const categories = await categorieService.getAllCategories();
    const plats = await platService.getAllPlats();
    // Deuxième effet de bord : rendre le HTML au client
    res.render("serveur/menu",{title:'Gestion menu',user:req.user,plats,categories})
  } catch (error) {
    next(error)

}
},

forgotPassword: async (req,res,next) => {
    try {
        res.render("forgot-password",{title:'Mot de passe oublié'})
    }catch(error) {
        next(error)
    }
},

changePassword: async (req,res,next) => {
    try {
        res.render("change-password",{title:"Changer le mot de passe"})
    }catch(error){next(error)}
}






};





module.exports=pageController;