import {Job} from "../models/job.model.js";

export const postJob = async (req, res)=>{
    try{
        const userId = req.id;

        const requiredFields=["title", "description", "requirements", "salary", "experience", "location", "jobType", "position", "companyId"];

        const missingFields = requiredFields.filter((key) => !req.body[key]);

        if(missingFields.length>0){
            return res.status(400).json({
                message: `Enter the fields: ${missingFields.join(", ")}`,
                success: false,
            })
        }

        const job = await Job.create({
            title,
            description,
            requirements,
            salary: Number(salary), // salary: Number(req.body.salary), this is done to implicitly convert string type (if input by user) to number type.
            location,
            jobType,
            experience,
            position,
            company: companyId,
            created_by: userId,
        });

        return res.status(201).json({
            message: "Job posted successfully.",
            job,
            success: true,
        });
    }
    catch(err) {
        console.log(err);
    }
}

export const getAllJobs = async (req, res)=>{
    try{
        const keyword = req.query.keyword || "";

        // here query is a mongoDB search object which will be used to search jobs
        const query = {
            $or: [
                {title: {$regex: keyword, $options: "i"} },
                {description: {$regex: keyword, $options: "i"} },
            ]
        };

        // {title: {$regex: keyword, $options: "i"}}, Searches for documents where the title field contains the value of keyword.
        // $regex: A MongoDB operator to perform a regular expression (regex) match. Example: If keyword = "developer", this matches any title containing "developer", such as "Full-Stack Developer" or "developer guide".
        // $options: "i": Specifies case-insensitive matching for the regex.Example: It will match "Developer", "DEVELOPER", or "developer".

        // Combined Behavior: If keyword = "node", the query matches any document where:title contains "node" (e.g., "Node.js Developer"), OR description contains "node" (e.g., "Experience with Node.js").


        //now we will find the jobs satisfying the conditions in query
        const jobs = await Job.find(query).populate({
            path: "company",
        })
        .sort({createdAt: -1}); // sort: Specifies the order in which the results should be returned. { createdAt: -1 }: Sorts the documents by the createdAt field in descending order(newest jobs appear first). 1:Ascending Order

        if(!jobs){
            return res.status(404).json({
                message: "No jobs found.",
                success: false,
            });
        }

        return res.status(200).json({
            jobs,
            success: true,
        });
    }
    catch(err) {
        console.log(err);
    }
}

export const getJobById = async (req, res)=>{
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if(!job){
            return res.status(404).json({
                message: "Job not found.",
                success: false,
            });
        }

        return res.status(200).json({
            job,
            success:true,
        });
    }
    catch(err) {
        console.log(err);
    }
}

export const getAdminJobs = async (req, res)=>{
    try{
        const adminId = req.id;
        const jobs = await Job.find({created_by: adminId});

        if(!jobs){
            return res.status(404).json({
                message: "No jobs found.",
                success: false,
            });
        };

        return res.status(200).json({
            jobs,
            success: true,
        });
    }
    catch(err){
        console.log(err);
    }
}