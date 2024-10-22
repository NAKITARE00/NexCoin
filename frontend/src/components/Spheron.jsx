import { upload } from '@spheron/storage';

const uploadFileToSpheron = async (data) => {
  const options = {
    protocol: 'ipfs',
    apiKey: '<YOUR_SPHERON_API_KEY>',
  };

  const file = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const response = await upload([file], options);
  console.log('Uploaded to IPFS:', response.cid);
  return response.cid;
};

export default uploadFileToSpheron;