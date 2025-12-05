import {s3Client,stsClient} from '../config/s3.js';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import { ApiError } from '../utils/ApiError.js';
import { AssumeRoleCommand } from '@aws-sdk/client-sts';



const uploadObjectOnS3= async function (file,Key) {// uploding local file to s3 without using presigned url
  try {
      const fileBuffer = fs.readFileSync(file.path);
      
      const command = new PutObjectCommand({
        Bucket: process.env.STORAGE_BUCKET,
        Key: Key,
        ContentType: file.mimetype,
        Body: fileBuffer,
      });
    
      await s3Client.send(command);
    
      return {
        Key,
        url: `${process.env.STORAGE_ENDPOINT}/${process.env.STORAGE_BUCKET}/${Key}`,
      };
  } catch (error) {
    throw new ApiError(500,`uploadOnS3 error: ${error}`)
  }
}


const generatePresignedDownloadUrl= async function (Key,time="300") {
  try {
      const command= new GetObjectCommand({
        Bucket: process.env.STORAGE_BUCKET,
        Key: Key,
      })
      const url= await getSignedUrl(s3,command,{expiresIn: time})
      return url
  } catch (error) {

    throw new ApiError(500,`downloadOnS3 error: ${error}`)

  }

}

const generatePresignedUploadUrl= async function(ContentType,Key, time="300"){
  try {
        const command = new PutObjectCommand({
            Bucket: process.env.STORAGE_BUCKET,
            Key: Key,
            ContentType: ContentType,
          });
        
        const uploadUrl= await getSignedUrl(s3,command,{expiresIn: time})

        return uploadUrl
        
  } catch (error) {
    throw new ApiError(500,`PresignedUploadUrl of S3 error: ${error}`)
    
  }
        
}

const deleteObjectOnS3= async function(Key){
  try {
      const command= new DeleteObjectCommand({
          Bucket: process.env.STORAGE_BUCKET,
          Key: Key
      });
      const del=await s3Client.send(command)
      return del
  } catch (error) {
    throw new ApiError(500,`deleteOnS3 error: ${error}`)
  }
}

const listObjectsByPrefixOnS3= async function(Prefix){
  try {

    const list= await s3Client.send(new ListObjectsV2Command({
      Bucket: process.env.STORAGE_BUCKET,
      Prefix: Prefix
    }))

    if (list.KeyCount==0) {
      console.log("No objects found.");

    }
    
    return list

    
  } catch (error) {
    throw new ApiError(500,`listing by prefix on s3 error: ${error}`)
    
  }
}

const deleteByPrefixOnS3= async function(Prefix){
  try {
      const list=await listObjectsByPrefixOnS3(Prefix)
      if(list.KeyCount>0){
        const objectsToDelete= list.Contents.map(x=>({ Key :x.Key}))
    
        const del= await s3Client.send(new DeleteObjectsCommand({
            Bucket:process.env.STORAGE_BUCKET,
            Delete: {Objects: objectsToDelete}
          }
    
        ))
        return del
    
      }else{
        return null
      }
  } catch (error) {
    throw new ApiError(500,`deleting by prefix error: ${error}`)
    
  }

  
  


}

const stsOnS3= async function () {
try {
    const command = new AssumeRoleCommand({
     RoleArn: "arn:aws:iam::123456789012:role/test", // any string for MinIO
     RoleSessionName: "minio-session",
     DurationSeconds: 900 // min 900 sec

    });

    const res = await stsClient.send(command);

    return res.Credentials;

} catch (error) {
  console.log(`sts error: ${error}`)
  
}
  
}









export {
  uploadObjectOnS3,
  generatePresignedUploadUrl,
  generatePresignedDownloadUrl,
  deleteObjectOnS3,
  deleteByPrefixOnS3,
  listObjectsByPrefixOnS3,
  stsOnS3
}
