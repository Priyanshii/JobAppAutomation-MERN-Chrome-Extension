//Find type attribute of the questions
function findQuestionType(element, inputElement, selectElement, textAreaElement) {
  let inputType;

  if (inputElement) {
    inputType = inputElement.getAttribute('type');
  } else if (selectElement) {
    inputType = 'dropdown'
  } else if (textAreaElement) {
    inputType = 'textarea'
  } else {
    inputType = 'unknown'
  }
  return inputType;
}

//find name attribute of the Input element (Required in case of input element type radio and checkbox)
function findQuestionName(inputElement) {
  let inputName;

  if (inputElement) {
    inputName = inputElement.getAttribute('name');
  }
  return inputName;
}

//find Options of the question ( in case of radio buttons, checkbox and dropdown)
function findInputOptions(element, inputElement, selectElement, textAreaElement) {
  let options = [];

  const inputType = findQuestionType(element, inputElement, selectElement, textAreaElement);
  const inputName = findQuestionName(inputElement);

  if (inputType === 'dropdown') {
    const optionElements = selectElement.querySelectorAll('option');
    optionElements.forEach((optionElement) => {
      options.push(optionElement.textContent);
    });
  } else if (inputType === 'radio' || inputType === 'checkbox') {
    const optionElements = element.querySelectorAll(`label input[name="${inputName}"]`);
    optionElements.forEach((optionElement) => {
      const label = optionElement.closest('label');
      options.push(label.textContent);
    });
  }
  return options;
}

//Fill All input with default values
function fillingInputWithDefaultValues(inputType, inputName, element, inputElement, selectElement, textAreaElement) {

  if (inputElement) {
    if (inputType === 'text') {

      inputElement.value = 'bbcdd';

    } else if (inputType === 'email') {

      inputElement.value = 'bbcdd@gmail.com';

    } else if (inputType === 'checkbox') {

      const checkboxElements = element.querySelectorAll(`input[name="${inputName}"]`);
      if (checkboxElements.length > 0) {
        checkboxElements[0].checked = true;
      }
    } else if (inputType === 'radio') {
      const radioElements = element.querySelectorAll(`input[name="${inputName}"]`);
      if (radioElements.length > 0) {
        radioElements[0].checked = true;
      }
    } else if (inputType === 'file') {
      const dataTransfer = new DataTransfer()

      const file = new File(['Hello World!'], 'bbcdd.txt', { type: 'text/plain' })
      dataTransfer.items.add(file)
      inputElement.files = dataTransfer.files;
      const selectFileLabel = element.querySelector('.default-label');
      selectFileLabel.textContent = 'bbcdd.txt'
    }
  } else if (inputType === 'dropdown') {
    selectElement.click();

    selectElement.selectedIndex = 1;
    const changeEvent = new Event("change", {
      bubbles: true,
      cancelable: false,
    });
    selectElement.dispatchEvent(changeEvent);

  } else if (inputType === 'textarea') {
    textAreaElement.value = 'aaa';
  }
}

async function detectQuestionsOnCurrentPage() {
  const questions = [];
  let questionElements = [];
  let addtionalInfoInputType;
  let additionalInfoLabelText;

  //Job Title
  const jobTitleElement = document.querySelector('.posting-header h2');
  let jobTitle;

  if (jobTitleElement) {
    jobTitle = jobTitleElement.textContent;
  }

  const formElements = document.querySelectorAll('.application-form:not(.hidden)');

  //Get Form Elements
  formElements.forEach(function (form) {
    const questionElement = form.querySelectorAll('.application-question');
    questionElements.push(...questionElement);
  });

  questionElements.forEach((element) => {
    const labelElement = element.querySelector(".application-label");
    let questionText;

    if (labelElement) {
      questionText = labelElement.textContent;
    } else {
      questionText = element.textContent
    }

    if (questionText.endsWith('✱')) {
      questionText = questionText.slice(0, -1);
    }

    const inputElement = element.querySelector("input");
    const selectElement = element.querySelector("select");
    const textAreaElement = element.querySelector("textarea");

    const inputType = findQuestionType(element, inputElement, selectElement, textAreaElement);
    const inputName = findQuestionName(inputElement);

    const options = findInputOptions(element, inputElement, selectElement, textAreaElement);

    const question = {
      text: questionText,
      type: inputType,
      options: options,
    };
    questions.push(question);

    fillingInputWithDefaultValues(inputType, inputName, element, inputElement, selectElement, textAreaElement);
  });

  // const additionalInfoInputElement = document.getElementById('additional-information');

  // if (additionalInfoInputElement) {
  //   additionalInfoLabelText = additionalInfoInputElement.getAttribute('placeholder');
  // } 

  // questions.push({
  //   text: additionalInfoLabelText,
  //   type: 'textarea',
  // })

  chrome.runtime.sendMessage({ type: 'detectedJobApplicationQuestions', questions: questions, title: jobTitle }).then((response) => {
    console.log("Questions on Job Url Sent!");
  });
  return;
}

async function main() {
  try {
    await detectQuestionsOnCurrentPage();
    const submitButton = document.getElementById('btn-submit');

    setTimeout(() => {
      if (submitButton) {
        submitButton.click();
      }
    }, 2000);

  } catch (error) {
    console.error(error);
  }
}


main();