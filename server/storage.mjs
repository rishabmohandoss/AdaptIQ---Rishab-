import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
export function resumeStorage(env = process.env) {
  const client = new S3Client({ region: env.AWS_REGION });
  function params(key) {
    if (!env.RESUME_BUCKET) throw Object.assign(new Error('Resume uploads are not configured.'), { status: 503 });
    return { Bucket: env.RESUME_BUCKET, Key: key };
  }
  return {
    put: (key, body, type) => client.send(new PutObjectCommand({ ...params(key), Body: body, ContentType: type, ServerSideEncryption: 'AES256' })),
    get: key => client.send(new GetObjectCommand(params(key))),
    delete: key => client.send(new DeleteObjectCommand(params(key)))
  };
}
