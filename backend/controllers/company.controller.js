import {Company} from "../models/company.model.js";

export const registerCompany = async(req, res)=>{
    try{
        const {companyName} = req.body;
        if(!companyName){
            return res.status(404).json({
                message: "Please enter Company name.",
                success: false,
            });
        }

        const doesCompanyExists = await Company.findOne({name: companyName});
        if(doesCompanyExists){
            return res.status(404).json({
                message: "Company already registered",
                success: false,
            });
        }

        await Company.create({
            name: companyName,
            userId: req.id, // coming from userAuth from company.route.js ie. the id of user who created the company as in company.model.js
        });

        return res.status(201).json({
            message: "Company registered successfully",
            companyName,
            success: true,
        });
    }
    catch(err) {
        console.log(err);
    }
}

export const getCompanyByUser = async (req, res)=>{
    try{
        const userId=req.id;
        const company = await Company.findOne({userId: userId});
        if(!company){
            return res.status(404).json({
                message: "Company not found",
                status: false,
            });
        }

        return res.status(200).json({
            company,
            success:true,
        })
    }
    catch(err) {
        console.log(err);
    }
}

export const getCompanyById = async (req, res)=>{
    try{
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(404).json({
                message: "Company not found",
                status: false,
            });
        }
        return res.status(200).json({
            company,
            status: true,
        });
    }
    catch(err) {
        console.log(err);
    }
}

export const updateCompany = async (req, res)=>{
    try{
        const allowedEditFields = ["description", "website", "location", "logo"];
        const disallowedFields = Object.keys(req.body).filter((key) => !allowedEditFields.include(key));

        if(disallowedFields.length>0){
            return res.status(400).json({
                message: `You can't edit ${disallowedFields.join(", ")}`,
                success: false,
            })
        }
        const file = req.file;

        const companyToUpdate = await Company.findById(req.params.id);

        if(!companyToUpdate){
            return res.status(404).json({
                message: "Company not found",
                status: false,
            });
        }

        Object.keys(req.body).forEach((key)=>(companyToUpdate[key]=req.body[key]));

        await companyToUpdate.save();

        return res.status(200).json({
            message: "Company information updated.",
            success: true,
        });
    }
    catch(err) {
        console.log(err);
    }
}

export const deleteCompany = async (req, res)=>{
    try{
        const companyToDelete = await Company.findById(req.params.id);
        await Company.findByIdAndDelete(companyToDelete._id);

        return res.status(200).json({
            message: "Company datat deleted",
            success: true,
        })
    }
    catch(err) {
        console.log(err);
    }
}