// importons les services
const categorieService = require('../services/categorieService');
const platService = require('../services/platService');
const avisService = require('../services/avisService');


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
    }

};

module.exports=pageController;