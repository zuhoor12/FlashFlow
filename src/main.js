import { Modal } from './Copmonent/modal/Modal.js'
import { FromData } from './Copmonent/form/getFormData.js'
import { Validation } from './Copmonent/form/validation.js';
import { DataBaseController } from './Copmonent/localStorageManager.js';
import { BoxManager } from './Copmonent/BoxManager.js';

let closeBox = document.getElementById("closeBox");
const addword = document.getElementById("addWordbtn");
let addvocabulary = document.getElementById("addvocabulary");
let modal = new Modal();
let DatabaseManagerInstance = new DataBaseController();
let newInstanceOFBox = new BoxManager(modal);
let boxManager = document.querySelectorAll(".boxManager");
let getDatafrominput = new FromData();
await newInstanceOFBox.updateTotalWord();


addword.addEventListener("click", ()=>{
  
  modal.ClearInput()
  modal.clearError()
  modal.open()
  
})
closeBox.addEventListener("click", ()=>{    
  modal.close()
})
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




await newInstanceOFBox.render(document.getElementById("daily"))
boxManager.forEach(element => {
  element.addEventListener("click",()=>{
    newInstanceOFBox.render(element)
  })
});



