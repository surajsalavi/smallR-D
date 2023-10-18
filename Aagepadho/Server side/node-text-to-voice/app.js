// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech')

// Import other required libraries
const fs = require('fs')
const util = require('util')
// Creates a client
const client = new textToSpeech.TextToSpeechClient()
async function quickStart() {
  // The text to synthesize
  const text = 'एक टेबल आहे'

  // Construct the request
  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: 'mr-IN', ssmlGender: 'mr-IN-Wavenet-B' },
    // select the type of audio encoding
    audioConfig: { audioEncoding: 'MP3' },
  }

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request)
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile)
  await writeFile('output.mp3', response.audioContent, 'binary')
  console.log('Audio content written to file: output.mp3')
}

quickStart()

//   const express=require('express')
//   // Imports the Texttospeech library
//   const {TextToSpeechClient} = require('@google-cloud/text-to-speech').v1beta1;

//   // Instantiates a client
//   const texttospeechClient = new TextToSpeechClient();

//   const app=express()

//   app.get('/getSupportedVoices',async (req,res)=>{

//     try{
//      // Construct request
//      const request = {
//     };

//     // Run request
//     const response = await texttospeechClient.listVoices(request);

//     res.json(response)
//   }
//   catch(err)
//   {
//       console.log(`Some Error Occured ${err}`)
//   }
//   })

// app.listen(5000,()=>{
//   console.log('app started on port number 5000')
// })

// async function callListVoices() {
//     // Construct request
//     const request = {
//     };

//     // Run request
//     const response = await texttospeechClient.listVoices(request);
//     console.log(response);
//   }

// callListVoices();
