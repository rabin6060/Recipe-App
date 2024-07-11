
import cloudinary from "../../../utils/Cloudinary";
import { createRecipes, deleteRecipe, getAllRecipes, getSingleRecipe, getUserRecipe, updateRecipe} from "./repository";
import { Recipe } from "./type";
import PDFDocument from 'pdfkit'



export const RecipeService = {
    async createRecipe(body:Recipe){
        const res = await createRecipes(body)
        return res

    },
    async getAll(query:{title?:string,category?:string,ingredients?:string,page:string,limit:string}){
        let filter = {};
        let page = parseInt(query.page)
        let limit = parseInt(query.limit)
        let skip:number
        skip = (page-1)*limit
        if (query.title || query.category || query.ingredients) {
          // Construct the filter object based on query parameters
          console.log(query.category)
          filter = {
            ...(query.title && { title: new RegExp(query.title as string, 'i') }),
            ...(query.category && { categories: { $in: (query.category as string).split(',') } }),
            ...(query.ingredients && { ingredients: { $in: (query.ingredients as string).split(',') } }),
          };
        }
        return getAllRecipes(filter,skip,limit)
    },
    async getRecipe(id:string){
        return getSingleRecipe(id)
    },
    async getUsersRecipe(userId:string){
        return getUserRecipe(userId)
    },
    async delete(id:string){
        return deleteRecipe(id)
    },
    async update(id:string,recipeData:Recipe){
        return updateRecipe(id,recipeData)
    },
    async uploadImages(imageFiles:Express.Multer.File[],videoFiles:Express.Multer.File[]){
        const uploadImagePromises = imageFiles.map((image) =>
            cloudinary.uploader.upload(image.path)
        );
        const uploadVideoPromises = videoFiles.map((video) =>
            cloudinary.uploader.upload(video.path,{resource_type:'video'})
        );

        try {
            const results = await Promise.all([...uploadImagePromises,...uploadVideoPromises]);
            const uploadUrls: string[] = results.map(result => result?.secure_url);
            
            return uploadUrls
        } catch (err) {
            console.error(err);
        }
    },
    async downloadRecipe(id: string){
        const recipe = await getSingleRecipe(id)
        const doc = new PDFDocument();
        if (recipe) {
        let buffers:any = [];
        doc.on('data', buffers.push.bind(buffers));
        

        doc.fontSize(20).fillColor('blue').text(recipe.title, { align: 'center' });
        doc.moveDown();

        doc.fontSize(19).text('Desciption:')

        doc.fontSize(18).text(recipe.desc);
        doc.moveDown();

        doc.fontSize(16).fillColor('green').text('Ingredients', { underline: true });
        recipe.ingredients.forEach((ingredient) => {
            doc.fontSize(14).text(`- ${ingredient}`);
        });
        doc.moveDown();

        doc.fontSize(16).fillColor('orange').text('Categories', { underline: true });
        doc.fontSize(14).text(`- ${recipe.categories}`);
        doc.moveDown();

        doc.fontSize(16).fillColor('red').text('Instructions', { underline: true });
        recipe.instructions.forEach((instruction, index) => {
            doc.fontSize(15).text(`${index + 1}. ${instruction.step}`);
            instruction.substep.forEach((sub) => {
            doc.fontSize(13).text(`  - ${sub.title}: ${sub.desc}`);
            });
        });

        doc.end();

        return new Promise((resolve, reject) => {
            doc.on('end', () => {
            resolve(Buffer.concat(buffers));
            });
            doc.on('error', reject);
        });
                
    }}

}
