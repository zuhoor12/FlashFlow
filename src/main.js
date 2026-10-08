import { Modal } from './Component/modal/Modal.js'
import { FromData } from './Component/form/getFormData.js'
import { Validation } from './Component/form/validation.js';
import { DataBaseController } from './Component/localStorageManager.js';
import { BoxManager } from './Component/BoxManager.js';
import { ThemeManager } from './Component/theme/ThemeManager.js';
import { Speaker } from './Component/speech/Speaker.js';
import { JsonManager } from './Component/data/JsonManager.js';

let closeBox = document.getElementById("closeBox");
const addword = document.getElementById("addWordbtn");
let addvocabulary = document.getElementById("addvocabulary");
let modal = new Modal();
let DatabaseManagerInstance = new DataBaseController();
let newInstanceOFBox = new BoxManager(modal);
let boxManager = document.querySelectorAll(".boxManager");
let getDatafrominput = new FromData();
// dark / light mode toggle, pronunciation (Web Speech API) and JSON import / export
new ThemeManager();
new Speaker(modal);
let jsonManager = new JsonManager(DatabaseManagerInstance);

// we will call the updateTotalWord method to update the total number of words in each box when the page loads, ensuring that the user sees accurate information about their vocabulary progress right away.
await newInstanceOFBox.updateTotalWord();
// in addword event listener, we will clear the input fields and error messages before opening the modal, providing a clean slate for the user to add new vocabulary without any distractions from previous entries or errors.
addword.addEventListener("click", ()=>{
  modal.ClearInput()
  modal.clearError()
  modal.open()
})
// the closeBox event listener will call the close method of the modal instance to hide the modal when the user clicks on the close button, allowing them to exit the modal and return to the main interface without making any changes.
closeBox.addEventListener("click", ()=>{    
  modal.close()
})

// in the addvocabulary event listener,
// we will create a new instance of the Validation class to validate the input data before saving it to the database.
// If the validation is successful, we will save the word and its meaning to the "daily" level in the database,
// update the total word count in the box manager, and re-render the box to reflect the new addition.
// We will also clear any error messages and input fields,
// and close the modal to provide a seamless user experience when adding new vocabulary.
addvocabulary.addEventListener("click", async (event)=>{
    let checkValidate = new Validation(getDatafrominput.getData())
    modal.SubmitOf(event)
    if(checkValidate.validator() == true){
      let data = getDatafrominput.getData()
      await DatabaseManagerInstance.saveWord("daily",data.word, data.meaning)
      await newInstanceOFBox.updateTotalWord()
      await newInstanceOFBox.render(null)
      modal.clearError()
      modal.ClearInput()
      modal.close()
    }
})
// we will call the render method of the box manager instance to display the contents of the "daily" box when the page loads,
// providing the user with an immediate view of their daily vocabulary and allowing them to start engaging with their flashcards right away.
await newInstanceOFBox.render(document.getElementById("daily"))
// the boxManager event listener will call the render method of the box manager instance to update the display of the selected box (daily, medium, or master) whenever a user clicks on one of the box elements, allowing them to easily switch between different levels of vocabulary and see their progress in each category.
boxManager.forEach(element => {
  element.addEventListener("click",()=>{
    newInstanceOFBox.render(element)
  })
});

// ---------- JSON import / export ----------
const importText = document.getElementById("importText");
const importError = document.getElementById("importError");
const importFile = document.getElementById("importFile");

// open the import box with an empty textarea
document.getElementById("importBtn").addEventListener("click", () => {
  importText.value = ""
  importError.innerText = ""
  modal.openImport()
})
document.getElementById("closeImport").addEventListener("click", () => {
  modal.close()
})
// "Choose file" opens the file picker, the content of the chosen .json file is placed in the textarea
document.getElementById("chooseFile").addEventListener("click", () => {
  importFile.click()
})
importFile.addEventListener("change", async () => {
  const file = importFile.files[0]
  if (!file) return
  importText.value = await file.text()
  importError.innerText = ""
  importFile.value = ""
})
// parse the JSON, save the new words in the daily box (see JsonManager.js), then show the daily box
document.getElementById("importSubmit").addEventListener("click", async () => {
  const text = importText.value.trim()
  if (!text) {
    importError.innerText = "Paste some JSON or choose a file first."
    return
  }
  try {
    const result = await jsonManager.importText(text)
    modal.close()
    await newInstanceOFBox.updateTotalWord()
    await newInstanceOFBox.render(document.getElementById("daily"))
    await jsonManager.showResult(result)
  } catch (error) {
    importError.innerText = error.message
  }
})
// download all words as a JSON backup file
document.getElementById("exportBtn").addEventListener("click", () => {
  jsonManager.exportAll()
})
// click on the dark background or press Escape to close any open box
document.getElementById("overlay").addEventListener("click", () => modal.close())
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") modal.close()
})
