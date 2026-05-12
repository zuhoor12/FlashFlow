import { Modal } from './Component/modal/Modal.js'
import { FromData } from './Component/form/getFormData.js'
import { Validation } from './Component/form/validation.js';
import { DataBaseController } from './Component/localStorageManager.js';
import { BoxManager } from './Component/BoxManager.js';

let closeBox = document.getElementById("closeBox");
const addword = document.getElementById("addWordbtn");
let addvocabulary = document.getElementById("addvocabulary");
let modal = new Modal();
let DatabaseManagerInstance = new DataBaseController();
let newInstanceOFBox = new BoxManager(modal);
let boxManager = document.querySelectorAll(".boxManager");
let getDatafrominput = new FromData();

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



