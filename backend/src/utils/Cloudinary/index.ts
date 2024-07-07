import { v2 as cloudinary } from 'cloudinary';
import env from '../../config/env';


    // Configuration
cloudinary.config({ 
        cloud_name: 'dtksdaodc', 
        api_key: '179797792261787', 
        api_secret: env.cloudinary_api_secret // Click 'View Credentials' below to copy your API secret
    });

export default cloudinary 
