/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId = 'aagepadho'
const location = 'global'
const text = 'Apple'

// Imports the Google Cloud Translation library
const { TranslationServiceClient } = require('@google-cloud/translate')

// Instantiates a client
const translationClient = new TranslationServiceClient()

async function translateText() {
  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: 'en',
    targetLanguageCode: 'mr',
  }

  try {
    // Run request
    const [response] = await translationClient.translateText(request)

    for (const translation of response.translations) {
      console.log(`Translation: ${translation.translatedText}`)
    }
  } catch (err) {
    console.log(err)
  }
}

translateText()
